import { DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS, fromDaffyDuck } from '@daffy'
import { expect, it } from 'vitest'

it('fromDaffyDuckEmpty', () => {
  expect(fromDaffyDuck({ nodes: [], edges: [] })).toEqual({
    nodes: [
      { id: 'START', type: 'start', position: { x: -500, y: 0 }, deletable: false },
      { id: 'END', type: 'end', position: { x: 500, y: 0 }, deletable: false },
    ],
    edges: [],
  })
})

it('fromDaffyDuckOnlyAgent', () => {
  // TODO: add more tests with nodes and edges

  expect(fromDaffyDuck({
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
  })).toStrictEqual({
    nodes: [
      {
        id: 'START',
        type: 'start',
        deletable: false,
        position: { x: -500, y: 0 },
      },
      {
        id: 'END',
        type: 'end',
        deletable: false,
        position: { x: 500, y: 0 },
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
    ],
    edges: [
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
    ],
  })
})

it('fromDaffyDuckRagAgentWithTools', () => {
  // TODO: add more tests with nodes and edges

  expect(fromDaffyDuck({
    nodes: [
      {
        id: 'agent_test',
        node: FLOW_TO_DAFFY_NODES.agent,
        parallel_tool_calling: true,
        position: {
          x: 0,
          y: 0,
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
            id: 'mcp_tool',
            position: { x: 0, y: 0 },
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
          x: 0,
          y: 0,
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
            id: 'mcp_tool',
            position: {
              x: 0,
              y: 0,
            },
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
        target: 'tool_node',
        source_handle: 'agent',
        target_handle: 'tools',
        condition: {
          tool_node: 'tools_condition',
        },
      },
      {
        id: 'end_tool_node',
        source: 'tool_node',
        target: 'agent_test',
        source_handle: 'tools',
        target_handle: 'agent',
      },
    ],
  })).toStrictEqual({
    nodes: [
      {
        id: 'START',
        type: 'start',
        deletable: false,
        position: { x: -500, y: 0 },
      },
      {
        id: 'END',
        type: 'end',
        deletable: false,
        position: { x: 500, y: 0 },
      },
      {
        id: 'agent_test',
        type: DAFFY_TO_FLOW_NODES.AgentNode,
        position: {
          x: 0,
          y: 0,
        },
        data: {
          api_key: '',
          stream: true,
          system_prompt: '',
          temperature: 0.1,
          model: 'openai:gpt-4o',
          parallel_tool_calling: true,
        },
      },
      {
        id: 'rag',
        type: DAFFY_TO_FLOW_NODES.RagNode,
        data: {
          collection_name: 'test',
        },
        position: {
          x: 0,
          y: 0,
        },
      },
      {
        id: 'mcp_tool',
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
          x: 0,
          y: 0,
        },
      },
    ],
    edges: [
      {
        id: 'tool_node_mcp_0',
        source: 'agent_test',
        target: 'mcp_tool',
        sourceHandle: 'source-agent-tools',
      }, {
        id: 'start_agent',
        source: 'start',
        target: 'rag',
        sourceHandle: 'start',
        targetHandle: 'rag',
      },
      {
        id: 'rag_agent',
        source: 'rag',
        target: 'agent_test',
        sourceHandle: 'rag',
        targetHandle: 'agent',
      },
      {
        id: 'agent_end',
        source: 'agent_test',
        target: 'end',
        sourceHandle: 'end',
        targetHandle: 'agent',
      },
    ],
  })
})

it('fromDaffyDuckAgentsWithFormsAndTools', () => {
  expect(fromDaffyDuck({
    nodes: [
      {
        id: 'agent_forms_a',
        node: 'AgentNode',
        parallel_tool_calling: true,
        position: {
          x: 10,
          y: 20,
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
            id: 'forms_tool_a',
            position: { x: 30, y: 40 },
            name: FLOW_TO_DAFFY_TOOLS.forms,
            settings: {
              title: 'Lead Form',
              fields: [
                { name: 'email', type: 'text' },
              ],
            },
          },
          {
            id: 'mcp_tool_a',
            position: { x: 50, y: 60 },
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
        id: 'agent_forms_b',
        node: 'AgentNode',
        parallel_tool_calling: true,
        position: {
          x: 110,
          y: 120,
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
            id: 'excel_tool_b',
            position: { x: 130, y: 140 },
            name: FLOW_TO_DAFFY_TOOLS.excel,
            settings: {
              url_expiration_seconds: 6000,
            },
          },
          {
            id: 'forms_tool_b',
            position: { x: 150, y: 160 },
            name: FLOW_TO_DAFFY_TOOLS.forms,
            settings: {
              title: 'Lead Form',
              fields: [
                { name: 'email', type: 'text' },
              ],
            },
          },
        ],
      },
    ],
    edges: [],
  })).toStrictEqual({
    nodes: [
      {
        id: 'START',
        type: 'start',
        deletable: false,
        position: { x: -500, y: 0 },
      },
      {
        id: 'END',
        type: 'end',
        deletable: false,
        position: { x: 500, y: 0 },
      },
      {
        id: 'agent_forms_a',
        type: DAFFY_TO_FLOW_NODES.AgentNode,
        position: {
          x: 10,
          y: 20,
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
        id: 'agent_forms_b',
        type: DAFFY_TO_FLOW_NODES.AgentNode,
        position: {
          x: 110,
          y: 120,
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
        id: 'forms_tool_a',
        type: 'forms',
        position: {
          x: 30,
          y: 40,
        },
        data: {
          title: 'Lead Form',
          fields: [
            { name: 'email', type: 'text' },
          ],
        },
      },
      {
        id: 'mcp_tool_a',
        type: DAFFY_TO_FLOW_NODES.ToolNode,
        position: {
          x: 50,
          y: 60,
        },
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
      },
      {
        id: 'excel_tool_b',
        type: DAFFY_TO_FLOW_NODES.ToolNode,
        position: {
          x: 130,
          y: 140,
        },
        data: {
          value: DAFFY_TO_FLOW_TOOLS.ExcelGeneratorTool,
          config: {
            url_expiration_seconds: 6000,
          },
        },
      },
      {
        id: 'forms_tool_b',
        type: 'forms',
        position: {
          x: 150,
          y: 160,
        },
        data: {
          title: 'Lead Form',
          fields: [
            { name: 'email', type: 'text' },
          ],
        },
      },
    ],
    edges: [
      {
        id: 'tool_node_forms_0',
        source: 'agent_forms_a',
        target: 'forms_tool_a',
        sourceHandle: 'source-agent-forms',
      },
      {
        id: 'tool_node_mcp_1',
        source: 'agent_forms_a',
        target: 'mcp_tool_a',
        sourceHandle: 'source-agent-tools',
      },
      {
        id: 'tool_node_excel_0',
        source: 'agent_forms_b',
        target: 'excel_tool_b',
        sourceHandle: 'source-agent-tools',
      },
      {
        id: 'tool_node_forms_1',
        source: 'agent_forms_b',
        target: 'forms_tool_b',
        sourceHandle: 'source-agent-forms',
      },
    ],
  })
})
