#!/usr/bin/env python3
"""
Generate Meilisearch index documents from docs MDX source files.

Reads all .mdx files under content/docs/, parses YAML frontmatter and
markdown body, splits by heading sections, and outputs a JSON array
matching the HanzoIndex schema used by the cloud-api /v1/index-docs
endpoint and the Meilisearch app-docs-hanzo-ai-docs index.

Usage:
    python3 scripts/generate-search-index.py > /tmp/docs-index.json

Then index via kubectl port-forward or direct API call:
    kubectl port-forward -n hanzo svc/search 7700:7700 &
    curl -X POST 'http://localhost:7700/indexes/app-docs-hanzo-ai-docs/documents' \
         -H 'Authorization: Bearer <MASTER_KEY>' \
         -H 'Content-Type: application/json' \
         --data-binary @/tmp/docs-index.json
"""

import json
import os
import re
import sys
from pathlib import Path


CONTENT_ROOT = Path(__file__).resolve().parent.parent / "content" / "docs"
BASE_URL = "https://docs.hanzo.ai/docs"
TAG = "docs-hanzo-ai"


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Parse YAML frontmatter from MDX content. Returns (metadata, body)."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("---", 3)
    if end == -1:
        return {}, text
    fm_text = text[3:end].strip()
    body = text[end + 3:].strip()

    meta = {}
    for line in fm_text.split("\n"):
        line = line.strip()
        if ":" in line:
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if value.lower() == "true":
                value = True
            elif value.lower() == "false":
                value = False
            meta[key] = value
    return meta, body


def strip_mdx_components(text: str) -> str:
    """Remove JSX/MDX component tags, imports, and code fences from text."""
    # Remove import statements
    text = re.sub(r'^import\s+.*$', '', text, flags=re.MULTILINE)
    # Remove JSX self-closing tags like <Card ... />
    text = re.sub(r'<\w+[^>]*/>', '', text)
    # Remove JSX opening/closing tags like <Cards>, </Cards>
    text = re.sub(r'</?[A-Z]\w*[^>]*>', '', text)
    # Remove code fences but keep the content descriptive
    text = re.sub(r'```\w*(?:\s+tab="[^"]*")?', '', text)
    text = text.replace('```', '')
    # Remove HTML comments
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    # Collapse multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def slugify(text: str) -> str:
    """Convert heading text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = text.strip('-')
    return text


def file_to_url_path(filepath: Path) -> str:
    """Convert a file path to a docs.hanzo.ai URL path."""
    rel = filepath.relative_to(CONTENT_ROOT)
    parts = list(rel.parts)

    # Remove .mdx extension from last part
    parts[-1] = parts[-1].replace(".mdx", "")

    # Handle (framework) group routes -- these are Next.js route groups
    parts = [p for p in parts if not p.startswith("(")]

    # index files map to directory URL
    if parts[-1] == "index":
        parts = parts[:-1]

    # Skip hidden files like .shared.mdx
    if any(p.startswith(".") for p in parts):
        return ""

    url_path = "/".join(parts)
    return f"{BASE_URL}/{url_path}" if url_path else BASE_URL


def file_to_page_id(filepath: Path) -> str:
    """Generate a stable page ID from the file path."""
    rel = filepath.relative_to(CONTENT_ROOT)
    parts = list(rel.parts)
    parts[-1] = parts[-1].replace(".mdx", "")
    parts = [p for p in parts if not p.startswith("(")]
    if parts[-1] == "index":
        parts = parts[:-1]
    return "-".join(parts) if parts else "root"


def file_to_breadcrumbs(filepath: Path) -> list[str]:
    """Generate breadcrumb trail from file path."""
    rel = filepath.relative_to(CONTENT_ROOT)
    parts = list(rel.parts)
    parts[-1] = parts[-1].replace(".mdx", "")
    parts = [p for p in parts if not p.startswith("(") and p != "index"]
    # Capitalize each part for display
    return [p.replace("-", " ").title() for p in parts]


def split_by_headings(body: str) -> list[dict]:
    """Split markdown body into sections by ## headings."""
    sections = []
    current_heading = None
    current_heading_id = None
    current_lines = []

    for line in body.split("\n"):
        heading_match = re.match(r'^(#{1,3})\s+(.+)$', line)
        if heading_match:
            # Flush previous section
            content = "\n".join(current_lines).strip()
            content = strip_mdx_components(content)
            if content:
                sections.append({
                    "heading": current_heading,
                    "heading_id": current_heading_id,
                    "content": content,
                })
            current_heading = heading_match.group(2).strip()
            current_heading_id = slugify(current_heading)
            current_lines = []
        else:
            current_lines.append(line)

    # Flush last section
    content = "\n".join(current_lines).strip()
    content = strip_mdx_components(content)
    if content:
        sections.append({
            "heading": current_heading,
            "heading_id": current_heading_id,
            "content": content,
        })

    return sections


def process_file(filepath: Path) -> list[dict]:
    """Process a single MDX file into HanzoIndex documents."""
    try:
        text = filepath.read_text(encoding="utf-8")
    except Exception as e:
        print(f"WARNING: cannot read {filepath}: {e}", file=sys.stderr)
        return []

    meta, body = parse_frontmatter(text)
    title = meta.get("title", "")
    description = meta.get("description", "")

    url = file_to_url_path(filepath)
    if not url:
        return []

    page_id = file_to_page_id(filepath)
    breadcrumbs = file_to_breadcrumbs(filepath)
    tag = TAG

    documents = []
    idx = 0

    # Add description as first document
    if description:
        documents.append({
            "id": f"{page_id}-{idx}",
            "title": title,
            "url": url,
            "page_id": page_id,
            "tag": tag,
            "content": description,
            "breadcrumbs": breadcrumbs,
        })
        idx += 1

    # Split body into sections
    sections = split_by_headings(body)
    seen_headings = set()

    for section in sections:
        heading = section["heading"]
        heading_id = section["heading_id"]
        content = section["content"]

        # Add heading document (once per unique heading)
        if heading and heading_id and heading_id not in seen_headings:
            seen_headings.add(heading_id)
            documents.append({
                "id": f"{page_id}-{idx}",
                "title": title,
                "url": f"{url}#{heading_id}" if heading_id else url,
                "page_id": page_id,
                "tag": tag,
                "section": heading,
                "section_id": heading_id,
                "content": heading,
                "breadcrumbs": breadcrumbs,
            })
            idx += 1

        # Add content document
        # Truncate very long sections to keep index manageable
        if len(content) > 2000:
            content = content[:2000] + "..."

        if content.strip():
            documents.append({
                "id": f"{page_id}-{idx}",
                "title": title,
                "url": f"{url}#{heading_id}" if heading_id else url,
                "page_id": page_id,
                "tag": tag,
                "section": heading,
                "section_id": heading_id,
                "content": content,
                "breadcrumbs": breadcrumbs,
            })
            idx += 1

    return documents


def main():
    if not CONTENT_ROOT.exists():
        print(f"ERROR: content root not found: {CONTENT_ROOT}", file=sys.stderr)
        sys.exit(1)

    mdx_files = sorted(CONTENT_ROOT.rglob("*.mdx"))
    # Exclude projects (too many upstream docs) and hidden files
    mdx_files = [
        f for f in mdx_files
        if "projects" not in str(f)
        and not any(p.startswith(".") for p in f.relative_to(CONTENT_ROOT).parts)
    ]

    all_documents = []
    for filepath in mdx_files:
        docs = process_file(filepath)
        all_documents.extend(docs)

    print(json.dumps(all_documents, indent=None, ensure_ascii=False))
    print(
        f"Generated {len(all_documents)} index documents from {len(mdx_files)} MDX files",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
