import { expect } from 'vitest'
import { AGENT, DAFFY_TOOLS, END, RAG, START, toDaffyDuck, TOOL, TOOL_MCP } from '../src'

it('toDaffyDuckEmpty', () => {
  expect(toDaffyDuck([], [])).toStrictEqual({
    nodes: [],
    edges: [],
  })
})

it('toDaffyDuckOnlyAgent', () => {
  // TODO: add more tests with nodes and edges

  expect(toDaffyDuck([
    {
      id: 'START',
      type: START,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'END',
      type: END,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'agent_test',
      type: AGENT,
      position: {
        x: 1,
        y: 1,
      },
      data: {
        parallel_tool_calling: true,
        config: {
          api_key: '',
          stream: true,
          system_prompt: '',
          temperature: 0.1,
          model: 'openai:gpt-4o',
        },
      },
    },
  ], [
    {
      id: 'start_agent',
      source: START,
      target: 'agent_test',
      sourceHandle: START,
      targetHandle: 'agent',
    },
    {
      id: 'agent_end',
      source: 'agent_test',
      target: END,
      sourceHandle: END,
      targetHandle: 'agent',
    },
  ])).toStrictEqual({
    nodes: [
      {
        id: 'agent_test',
        node: 'AgentNode',
        parallel_tool_calling: true,
        position: {
          x: 1,
          y: 1,
        },
        settings: {
          api_key: '',
          stream: true,
          system_prompt: '',
          temperature: 0.1,
          model: 'openai:gpt-4o',
        },
        tools: [],
      },
    ],
    edges: [
      {
        source: START,
        target: 'agent_test',
        source_handle: START,
        target_handle: 'agent',
      },
      {
        source: 'agent_test',
        target: END,
        source_handle: END,
        target_handle: 'agent',
      },
    ],
  })
})

it('toDaffyDuckRagAgentWithTools', () => {
  // TODO: add more tests with nodes and edges

  expect(toDaffyDuck([
    {
      id: 'START',
      type: START,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'END',
      type: END,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'agent_test',
      type: AGENT,
      position: {
        x: 1,
        y: 1,
      },
      data: {
        parallel_tool_calling: true,
        config: {
          api_key: '',
          stream: true,
          system_prompt: '',
          temperature: 0.1,
          model: 'openai:gpt-4o',
        },
      },
    },
    {
      id: 'rag',
      type: RAG,
      data: {
        config: {
          collection_name: 'test',
        },
      },
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'mcp',
      type: TOOL,
      data: {
        value: TOOL_MCP,
        config: {
          websearch: {
            url: 'test',
            transport: 'sse',
          },
        },
      },
      position: {
        x: 1,
        y: 1,
      },
    },
  ], [
    {
      id: 'start_agent',
      source: START,
      sourceHandle: START,
      target: 'rag',
      targetHandle: 'rag',
    },
    {
      id: 'rag_agent',
      source: 'rag',
      sourceHandle: 'rag',
      target: 'agent_test',
      targetHandle: 'agent',
    },
    {
      id: 'mcp_agent_test',
      source: 'mcp',
      sourceHandle: 'mcp',
      target: 'agent_test',
      targetHandle: 'agent',
    },
    {
      id: 'agent_end',
      source: 'agent_test',
      sourceHandle: END,
      target: END,
      targetHandle: 'agent',
    },
  ])).toStrictEqual({
    nodes: [
      {
        id: 'agent_test',
        node: 'AgentNode',
        parallel_tool_calling: true,
        position: {
          x: 1,
          y: 1,
        },
        settings: {
          api_key: '',
          stream: true,
          system_prompt: '',
          temperature: 0.1,
          model: 'openai:gpt-4o',
        },
        tools: [
          {
            name: DAFFY_TOOLS[TOOL_MCP],
            settings: {
              websearch: {
                url: 'test',
                transport: 'sse',
              },
            },
          },
        ],
      },
      {
        id: 'rag',
        node: 'RagNode',
        position: {
          x: 1,
          y: 1,
        },
        settings: {
          collection_name: 'test',
        },
      },
      {
        id: 'tool_node',
        node: 'ToolNode',
        settings: {},
        parallel_tool_calling: true,
        position: {
          x: 0,
          y: 0,
        },
        tools: [
          {
            name: DAFFY_TOOLS[TOOL_MCP],
            settings: {
              websearch: {
                url: 'test',
                transport: 'sse',
              },
            },
          },
        ],
      },
    ],
    edges: [
      {
        source: START,
        target: RAG,
        source_handle: START,
        target_handle: 'rag',
      },
      {
        source: RAG,
        target: 'agent_test',
        source_handle: 'rag',
        target_handle: 'agent',
      },

      {
        source: 'agent_test',
        target: END,
        source_handle: END,
        target_handle: 'agent',
      },
      {
        condition: {
          tool_node: 'tools_condition',
        },
        source: 'agent_test',
      },
      {
        source: 'tool_node',
        target: 'agent_test',
      },
    ],
  })
})
