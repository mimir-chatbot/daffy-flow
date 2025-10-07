import { DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS, toDaffyDuck } from '@daffy'
import { expect, it } from 'vitest'

it('toDaffyDuckEmpty', () => {
  expect(toDaffyDuck([], [])).toStrictEqual({ nodes: [], edges: [] })
})

it('toDaffyDuckOnlyAgent', () => {
  // TODO: add more tests with nodes and edges

  expect(toDaffyDuck([
    {
      id: 'START',
      type: DAFFY_TO_FLOW_NODES.StartNode,
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'END',
      type: DAFFY_TO_FLOW_NODES.EndNode,
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'agent_test',
      type: DAFFY_TO_FLOW_NODES.AgentNode,
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
      source: DAFFY_TO_FLOW_NODES.StartNode,
      target: 'agent_test',
      sourceHandle: DAFFY_TO_FLOW_NODES.StartNode,
      targetHandle: 'agent',
    },
    {
      id: 'agent_end',
      source: 'agent_test',
      target: DAFFY_TO_FLOW_NODES.EndNode,
      sourceHandle: DAFFY_TO_FLOW_NODES.EndNode,
      targetHandle: 'agent',
    },
  ])).toStrictEqual({
    nodes: [
      {
        id: 'agent_test',
        node: FLOW_TO_DAFFY_NODES.agent,
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
        id: 'start_agent',
        source: DAFFY_TO_FLOW_NODES.StartNode,
        target: 'agent_test',
        source_handle: DAFFY_TO_FLOW_NODES.StartNode,
        target_handle: 'agent',
      },
      {
        id: 'agent_end',
        source: 'agent_test',
        target: DAFFY_TO_FLOW_NODES.EndNode,
        source_handle: DAFFY_TO_FLOW_NODES.EndNode,
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
      type: DAFFY_TO_FLOW_NODES.StartNode,
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'END',
      type: DAFFY_TO_FLOW_NODES.EndNode,
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'agent_test',
      type: DAFFY_TO_FLOW_NODES.AgentNode,
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
      type: DAFFY_TO_FLOW_NODES.RagNode,
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
      type: DAFFY_TO_FLOW_NODES.ToolNode,
      data: {
        value: DAFFY_TO_FLOW_TOOLS.MCPTool,
        config: {
          servers: {
            websearch: {
              url: 'test',
              transport: 'sse',
            },
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
      source: 'start',
      sourceHandle: 'start',
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
      sourceHandle: 'end',
      target: 'end',
      targetHandle: 'agent',
    },
  ])).toStrictEqual({
    nodes: [
      {
        id: 'agent_test',
        node: FLOW_TO_DAFFY_NODES.agent,
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
            name: FLOW_TO_DAFFY_TOOLS.mcp,
            settings: {
              servers: {
                websearch: {
                  url: 'test',
                  transport: 'sse',
                },
              },
            },
          },
        ],
      },
      {
        id: 'rag',
        node: FLOW_TO_DAFFY_NODES.rag,
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
            name: FLOW_TO_DAFFY_TOOLS.mcp,
            settings: {
              servers: {
                websearch: {
                  url: 'test',
                  transport: 'sse',
                },
              },
            },
          },
        ],
      },
    ],
    edges: [
      {
        id: 'start_agent',
        source: 'start',
        target: 'rag',
        source_handle: 'start',
        target_handle: 'rag',
      },
      {
        id: 'rag_agent',
        source: 'rag',
        target: 'agent_test',
        source_handle: 'rag',
        target_handle: 'agent',
      },
      {
        id: 'agent_end',
        source: 'agent_test',
        target: 'end',
        source_handle: 'end',
        target_handle: 'agent',
      },
      {
        id: 'tool_node_agent_test',
        source: 'agent_test',
        condition: {
          tool_node: 'tools_condition',
        },
      },
      {
        id: 'end_tool_node',
        source: 'tool_node',
        target: 'agent_test',
      },
    ],
  })
})
