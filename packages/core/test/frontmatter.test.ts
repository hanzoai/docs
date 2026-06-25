import { frontmatter } from '@/content/md/frontmatter';
import { test, expect } from 'vitest';

test('parse frontmatter', () => {
  expect(frontmatter('---\ntitle: hello world\ndescription: I love Hanzo Docs\n---\nwow looks cool.'))
    .toMatchInlineSnapshot(`
      {
        "content": "wow looks cool.",
        "data": {
          "description": "I love Hanzo Docs",
          "title": "hello world",
        },
        "matter": "---
      title: hello world
      description: I love Hanzo Docs
      ---
      ",
      }
    `);

  expect(
    frontmatter(
      '---\r\ntitle: hello world\r\ndescription: I love Hanzo Docs\r\n---\r\nwow looks cool.',
    ),
  ).toMatchInlineSnapshot(`
      {
        "content": "wow looks cool.",
        "data": {
          "description": "I love Hanzo Docs",
          "title": "hello world",
        },
        "matter": "---
      title: hello world
      description: I love Hanzo Docs
      ---
      ",
      }
    `);

  expect(frontmatter('--- \ntitle: hello world\r\n---\r\nwow looks cool.')).toMatchInlineSnapshot(`
      {
        "content": "--- 
      title: hello world
      ---
      wow looks cool.",
        "data": {},
        "matter": "",
      }
    `);
});
