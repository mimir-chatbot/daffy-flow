import { DAFFY_NODES, DAFFY_TOOLS, toDaffyDuck } from '@daffy'
import { expect, it } from 'vitest'

it('toDaffyDuckEmpty', () => {
  expect(toDaffyDuck([], [])).toStrictEqual({ nodes: [], edges: [] })
})

it('toDaffyDuckOnlyAgent', () => {
  // TODO: add more tests with nodes and edges

  expect(toDaffyDuck([
    {
      id: 'START',
      type: DAFFY_NODES.START,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'END',
      type: DAFFY_NODES.END,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'agent_test',
      type: DAFFY_NODES.AGENT,
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
      source: DAFFY_NODES.START,
      target: 'agent_test',
      sourceHandle: DAFFY_NODES.START,
      targetHandle: 'agent',
    },
    {
      id: 'agent_end',
      source: 'agent_test',
      target: DAFFY_NODES.END,
      sourceHandle: DAFFY_NODES.END,
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
        source: DAFFY_NODES.START,
        target: 'agent_test',
        source_handle: DAFFY_NODES.START,
        target_handle: 'agent',
      },
      {
        source: 'agent_test',
        target: DAFFY_NODES.END,
        source_handle: DAFFY_NODES.END,
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
      type: DAFFY_NODES.START,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'END',
      type: DAFFY_NODES.END,
      position: {
        x: 1,
        y: 1,
      },
      data: {},
    },
    {
      id: 'agent_test',
      type: DAFFY_NODES.AGENT,
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
      type: DAFFY_NODES.RAG,
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
      type: DAFFY_NODES.TOOL,
      data: {
        value: 'mcp',
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
      source: DAFFY_NODES.START,
      sourceHandle: DAFFY_NODES.START,
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
      sourceHandle: DAFFY_NODES.END,
      target: DAFFY_NODES.END,
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
            name: DAFFY_TOOLS.mcp,
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
            name: DAFFY_TOOLS.mcp,
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
        source: DAFFY_NODES.START,
        target: DAFFY_NODES.RAG,
        source_handle: DAFFY_NODES.START,
        target_handle: 'rag',
      },
      {
        source: DAFFY_NODES.RAG,
        target: 'agent_test',
        source_handle: 'rag',
        target_handle: 'agent',
      },

      {
        source: 'agent_test',
        target: DAFFY_NODES.END,
        source_handle: DAFFY_NODES.END,
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
