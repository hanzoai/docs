import { createOpenAPI } from '@hanzo/docs-openapi/server';

export const openapi = createOpenAPI({
  input: ['./scalar.yaml'],
});
