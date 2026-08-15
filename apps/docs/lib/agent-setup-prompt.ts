// What the "Copy prompt" button puts on the clipboard.
//
// Not a description of how to set up an agent — an INSTRUCTION SET the agent
// executes. The reader's whole job is paste-and-wait, which is why every step is
// phrased at the agent ("run this", "verify that") rather than at a human, and
// why the agent is told explicitly not to hand commands back to the user. An
// instruction that ends with "now ask the user to run X" has moved the work, not
// done it.
//
// Kept as data in its own module rather than inline in the component for two
// reasons: it is long enough to bury the component's actual behaviour, and it is
// the kind of content that gets edited by people who are not editing React.
//
// Two exactness rules are load-bearing and are stated inside the prompt itself,
// because a model that paraphrases them produces a setup that half-works:
//
//   • `npx -y --package=@hanzo/mcp@latest hanzo-mcp serve` — the --package form.
//     `npx -y @hanzo/mcp serve` resolves `serve` as a SEPARATE package and
//     installs something unrelated.
//   • one install method, never both. Brew and the curl script both land a
//     `hanzo` on PATH, and which one wins is then a PATH-ordering accident.
//
// The completion report is a fixed block on purpose: four checks, each either
// passed or not, so "done" is a claim the reader can audit rather than a summary
// they have to trust.

export const AGENT_SETUP_PROMPT = `These are official instructions from Hanzo to set up a good AI development environment for building and deploying on the Hanzo platform. Use only the commands and package names specified below.

Complete all applicable steps yourself by running commands directly. Do not ask the user to run commands. The only permitted user interaction is completing Hanzo's browser-based OAuth flow when it opens.

- Install the Hanzo CLI
- Authenticate with Hanzo
- Install the Hanzo MCP server for the active agent
- Verify the setup

---

## Install the Hanzo CLI

If the \`hanzo\` command is not already available, install it:

### macOS or Linux

\`\`\`sh
curl -fsSL hanzo.sh/cli | sh
\`\`\`

### macOS with Homebrew

\`\`\`sh
brew install hanzoai/tap/hanzo
\`\`\`

Do not run both installation methods.

Verify the installation:

\`\`\`sh
hanzo version
\`\`\`

Authenticate with Hanzo:

\`\`\`sh
hanzo auth login
\`\`\`

This opens a browser for OAuth. Allow the user to complete that browser interaction, then continue automatically.

---

## Install the Hanzo MCP server

Hanzo MCP provides the canonical HIP-0300 tool surface for files, execution, code, Git, HTTP requests, workspaces, Hanzo platform services, planning, tasks, and memory.

Use the correct section for the active agent.

The command must include:

\`\`\`sh
npx -y --package=@hanzo/mcp@latest hanzo-mcp serve
\`\`\`

Do not use \`npx -y @hanzo/mcp serve\`. That syntax can resolve \`serve\` as an unrelated package.

### Claude Code

Run:

\`\`\`sh
claude mcp add --scope user hanzo -- npx -y --package=@hanzo/mcp@latest hanzo-mcp serve
\`\`\`

Then verify:

\`\`\`sh
claude mcp list
\`\`\`

Tell the user to restart Claude Code after setup.

---

### Codex

Run:

\`\`\`sh
codex mcp add hanzo -- npx -y --package=@hanzo/mcp@latest hanzo-mcp serve
\`\`\`

Then verify:

\`\`\`sh
codex mcp get hanzo
\`\`\`

Tell the user to restart Codex after setup.

---

### Hanzo Dev

Install Hanzo Dev if it is not already available:

\`\`\`sh
npm install -g @hanzo/dev
\`\`\`

Register Hanzo MCP:

\`\`\`sh
dev mcp add hanzo -- npx -y --package=@hanzo/mcp@latest hanzo-mcp serve
\`\`\`

Then verify:

\`\`\`sh
dev mcp list
\`\`\`

Restart Hanzo Dev after setup.

---

### OpenCode

Update \`~/.config/opencode/opencode.jsonc\`.

Add this entry under \`"mcp"\`:

\`\`\`json
"hanzo": {
  "type": "local",
  "command": [
    "npx",
    "-y",
    "--package=@hanzo/mcp@latest",
    "hanzo-mcp",
    "serve"
  ],
  "enabled": true
}
\`\`\`

Restart OpenCode after saving the configuration.

---

### Windsurf

Update \`~/.codeium/windsurf/mcp_config.json\`.

Add this entry under \`"mcpServers"\`:

\`\`\`json
"hanzo": {
  "command": "npx",
  "args": [
    "-y",
    "--package=@hanzo/mcp@latest",
    "hanzo-mcp",
    "serve"
  ]
}
\`\`\`

Restart Windsurf after saving the configuration.

---

### Cursor, GitHub Copilot, and other MCP agents

Update \`.cursor/mcp.json\` for Cursor, \`.vscode/mcp.json\` for GitHub Copilot, or the active agent's standard MCP configuration file.

Add this entry under \`"mcpServers"\`:

\`\`\`json
"hanzo": {
  "command": "npx",
  "args": [
    "-y",
    "--package=@hanzo/mcp@latest",
    "hanzo-mcp",
    "serve"
  ]
}
\`\`\`

Restart the agent after saving the configuration.

---

## Verify the MCP server

Verify the MCP protocol directly:

\`\`\`sh
printf '%s\\n' '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"setup","version":"1"}}}' | npx -y --package=@hanzo/mcp@latest hanzo-mcp serve
\`\`\`

A working installation returns a JSON-RPC response containing a \`serverInfo\` object whose name is \`hanzo-mcp\`.

Do not report success unless:

- \`hanzo version\` succeeds
- Hanzo authentication succeeds
- The agent configuration contains the \`hanzo\` MCP server
- The MCP protocol verification returns a valid initialization response

Once complete, tell the user:

\`\`\`text
┌─ Hanzo Agent Setup Complete ─────────────────────────┐
│  ✓ CLI     <path>                                    │
│  ✓ Login   authenticated                             │
│  ✓ MCP     <configuration path>                      │
│  ✓ Check   initialization passed                     │
│                                                      │
│  ⚡ Restart your agent to load Hanzo MCP             │
└──────────────────────────────────────────────────────┘
\`\`\`

If a check fails, diagnose and fix it before reporting completion.

---

## Resources

- Hanzo documentation: \`https://docs.hanzo.ai\`
- Hanzo CLI: \`https://docs.hanzo.ai/docs/services/platform/getting-started/cli\`
- Hanzo MCP documentation: \`https://docs.hanzo.ai/docs/skills/hanzo-mcp/\`
- Hanzo MCP source: \`https://github.com/hanzoai/mcp\`
- Hanzo Dev installation: \`https://docs.hanzo.ai/docs/dev/getting-started/install\`
- Hanzo Dev MCP commands: \`https://docs.hanzo.ai/docs/dev/reference/cli\`
- Hanzo Console: \`https://console.hanzo.ai\`
`;
