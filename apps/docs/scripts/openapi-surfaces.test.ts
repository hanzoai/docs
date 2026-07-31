import { describe, expect, it } from 'vitest';
import { camelId, pascalId, pascalTag, snakeId } from './openapi-surfaces';

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
