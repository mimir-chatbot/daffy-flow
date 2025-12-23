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
      type: 'start',
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'END',
      type: 'end',
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
        api_key: '',
        stream: true,
        system_prompt: '',
        temperature: 0.1,
        model: 'openai:gpt-4o',
      },
    },
  ], [
    {
      id: 'start_agent',
      source: 'start',
      target: 'agent_test',
      sourceHandle: 'start',
      targetHandle: 'agent',
    },
    {
      id: 'agent_end',
      source: 'agent_test',
      target: 'end',
      sourceHandle: 'end',
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
        source: 'start',
        target: 'agent_test',
        source_handle: 'start',
        target_handle: 'agent',
      },
      {
        id: 'agent_end',
        source: 'agent_test',
        target: 'end',
        source_handle: 'end',
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
      type: 'start',
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'node_end_0',
      type: 'end',
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      id: 'node_end_1',
      type: 'end',
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
        api_key: '',
        stream: true,
        system_prompt: '',
        temperature: 0.1,
        model: 'openai:gpt-4o',
      },
    },
    {
      id: 'rag',
      type: DAFFY_TO_FLOW_NODES.RagNode,
      data: {
        collection_name: 'test',
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
    {
      id: 'excel',
      type: DAFFY_TO_FLOW_NODES.ToolNode,
      data: {
        value: DAFFY_TO_FLOW_TOOLS.ExcelGeneratorTool,
        config: {
          url_expiration_seconds: 6000,
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
      source: 'agent_test',
      sourceHandle: 'source_agent_tools',
      target: 'mcp',
    },
    {
      id: 'excel_agent_test',
      source: 'agent_test',
      sourceHandle: 'source_agent_tools',
      target: 'excel',
    },
    {
      id: 'agent_end',
      source: 'agent_test',
      sourceHandle: 'end',
      target: 'node_end_0',
      targetHandle: 'agent',
    },
    {
      id: 'agent_end_1',
      source: 'agent_test',
      sourceHandle: 'end',
      target: 'node_end_1',
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
            id: 'mcp',
            position: { x: 1, y: 1 },
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
          {
            id: 'excel',
            position: { x: 1, y: 1 },
            name: FLOW_TO_DAFFY_TOOLS.excel,
            settings: {
              url_expiration_seconds: 6000,
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
        source_handle: 'end',
        target_handle: 'agent',
        target: 'END',
      },
    ],
  })
})
