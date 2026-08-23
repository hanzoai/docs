import { describe, expect, it } from 'vitest';
import { camelId, pascalId, pascalTag, snakeId, toolOperations, toolOps } from './openapi-surfaces';

// The SDK surface printed in the docs must be the surface openapi-generator
// actually emits. These cases are lifted verbatim from the checked-in generated
// clients, so if the naming rule drifts the docs fail the build rather than
// teaching a method that does not exist.
//
//   js-sdk/src/api/chat-api.ts:140            export class ChatApi
//   js-sdk/src/api/chat-api.ts:149            gatewayCreateChatCompletion
//   js-sdk/src/api/open-aicompatible-apiapi.ts:136  OpenAICompatibleAPIApi
//   js-sdk/src/api/agents-apiapi.ts:89        cloudAgentsControllerCreate
//   python-sdk/.../api/chat_api.py:28,42      ChatApi.gateway_create_chat_completion
//   python-sdk/.../api/agents_api_api.py:299  cloud_agents_controller_create
//   go-sdk/cloud/api_chat.go:47               ChatAPIService.GatewayCreateChatCompletion
//   go-sdk/cloud/api_agents_api.go:126        ApiCloudAgentsControllerCreateRequest
//   java-sdk/.../api/ChatApi.java:99          gatewayCreateChatCompletion
//   rust-sdk/.../apis/chat_api.rs:32          gateway_create_chat_completion

describe('tag -> client class', () => {
  it.each([
    ['Chat', 'Chat'],
    ['OpenAI Compatible API', 'OpenAICompatibleAPI'],
    ['Roles & Permissions', 'RolesPermissions'],
    ['Key-Value', 'KeyValue'],
    ['Agents API', 'AgentsAPI'],
  ])('%s -> %s', (tag, expected) => {
    expect(pascalTag(tag)).toBe(expected);
  });
});

// The MCP server names a tool for the operationId minus its OWN first segment.
// Verified against the live server: `POST https://api.hanzo.ai/v1/mcp` answers
// tools/list with 730 tools, 729 of which this rule reproduces exactly (the
// odd one out is `get_v1_pricing_policy`). The cases below are taken from that
// answer, including the pair that proves the rule is NOT product-relative:
// `cloud_get_v1_tools` is grouped under the `tools` product by path, but its
// tool name strips `cloud_`, not `tools_`.
describe('operationId -> MCP tool name', () => {
  const toolName = (id: string) => (id.includes('_') ? id.slice(id.indexOf('_') + 1) : id);
  it.each([
    ['ai_createChatCompletion', 'createChatCompletion'],
    ['admin_adminAIMetrics', 'adminAIMetrics'],
    ['cloud_get_v1_tools', 'get_v1_tools'],
    ['cloud_get_v1_kv_name', 'get_v1_kv_name'],
    ['bot_authMe', 'authMe'],
  ])('%s -> %s', (id, expected) => {
    expect(toolName(id)).toBe(expected);
  });
});

describe('operationId -> method name', () => {
  const cases: Array<[string, string, string, string]> = [
    // operationId, TS/Java camel, Go pascal, Python/Rust snake
    [
      'gateway_createChatCompletion',
      'gatewayCreateChatCompletion',
      'GatewayCreateChatCompletion',
      'gateway_create_chat_completion',
    ],
    [
      'cloud_AgentsController.Create',
      'cloudAgentsControllerCreate',
      'CloudAgentsControllerCreate',
      'cloud_agents_controller_create',
    ],
    ['ai_listModels', 'aiListModels', 'AiListModels', 'ai_list_models'],
  ];
  it.each(cases)('%s', (id, camel, pascal, snake) => {
    expect(camelId(id)).toBe(camel);
    expect(pascalId(id)).toBe(pascal);
    expect(snakeId(id)).toBe(snake);
  });
});

// A GROUPED TOOL NAMES A SUBSYSTEM, NOT AN OPERATION.
//
// The server re-projected: it used to publish one tool per operation, so the tool
// name WAS the operationId and the join was a name lookup. It now publishes one
// tool per subsystem carrying its operations in an `op` enum — `account` is not
// an operationId, so a name lookup answers nothing and every tool page would
// read "the document does not describe this".
//
// The enum is therefore the join, tried first. The name path stays for a server
// that still serves the flat shape, and this pins BOTH so neither can be
// dropped as dead code while the fleet is mid-projection.
describe('the tool -> operation join reads the shape the server serves', () => {
  const opWith = (id: string, method: any, p: string): any => ({
    product: 'x', id, name: id, tag: 'x', method, path: p,
    summary: '', description: '', parameters: [], deprecated: false,
  });
  const doc: any = { operations: [opWith('get_keys', 'get', '/v1/keys'), opWith('post_keys', 'post', '/v1/keys')] };

  it('resolves a grouped tool through its op enum', () => {
    const grouped = { name: 'account', inputSchema: { properties: { op: { enum: ['get_keys', 'post_keys'] } } } };
    const m = toolOperations(doc, [grouped]);
    expect(m.get('account')?.map((o: any) => o.id).sort()).toEqual(['get_keys', 'post_keys']);
  });

  it('still resolves a flat tool by its own name', () => {
    const m = toolOperations(doc, [{ name: 'get_keys' }]);
    expect(m.get('get_keys')?.map((o: any) => o.id)).toEqual(['get_keys']);
  });

  it('names no operation for a tool whose enum the document does not carry', () => {
    // The reference joins a LIVE server to a PINNED document, so a server ahead of
    // the pin legitimately names ids the document lacks. That must read as
    // unmapped, never as a wrong operation.
    const m = toolOperations(doc, [{ name: 'admission', inputSchema: { properties: { op: { enum: ['get_flag_waitlist'] } } } }]);
    expect(m.has('admission')).toBe(false);
  });

  it('reads the enum off the tool rather than guessing from its name', () => {
    expect(toolOps({ name: 'account', inputSchema: { properties: { op: { enum: ['get_keys'] } } } })).toEqual(['get_keys']);
    expect(toolOps({ name: 'describe' })).toEqual([]);
  });
});
