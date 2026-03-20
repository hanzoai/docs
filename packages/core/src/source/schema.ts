import { z } from 'zod';

/**
 * Access level for gated docs pages.
 *
 * - `public` — visible to everyone (default when unset)
 * - `authenticated` — requires login
 * - `team` — requires login + team membership
 * - `admin` — requires login + admin role
 */
export const accessSchema = z.enum(['public', 'authenticated', 'team', 'admin']);

export type AccessLevel = z.infer<typeof accessSchema>;

/**
 * Zod 4 schema
 */
export const metaSchema = z.object({
  title: z.string().optional(),
  pages: z.array(z.string()).optional(),
  description: z.string().optional(),
  root: z.boolean().optional(),
  defaultOpen: z.boolean().optional(),
  collapsible: z.boolean().optional(),
  icon: z.string().optional(),
});

/**
 * Zod 4 schema
 */
export const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  full: z.boolean().optional(),

  /**
   * Access control level for this page.
   * When set to anything other than 'public', the page requires authentication.
   */
  access: accessSchema.optional(),

  /**
   * Restrict page access to specific organizations.
   * Only meaningful when `access` is not 'public'.
   * Users must belong to at least one of these orgs to view the page.
   */
  accessOrgs: z.array(z.string()).optional(),

  // Hanzo Docs OpenAPI generated
  _openapi: z.looseObject({}).optional(),
});
