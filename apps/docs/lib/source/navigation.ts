export function getSection(path: string | undefined) {
  if (!path) return 'services';
  const [dir] = path.split('/', 1);
  if (!dir) return 'services';
  return (
    {
      services: 'services',
      commerce: 'commerce',
      sdks: 'sdks',
      openapi: 'openapi',
      chat: 'chat',
      llm: 'llm',
      mcp: 'mcp',
      dev: 'dev',
      zap: 'zap',
    }[dir] ?? 'services'
  );
}
