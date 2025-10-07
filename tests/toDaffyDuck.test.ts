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
      type: 'start',
      position: {
        x: -500,
        y: 0,
      },
    },
    {
      id: 'END',
      type: 'end',
      position: {
        x: 500,
        y: 0,
      },
    },
    {
      id: 'rag_node',
      type: 'rag',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        embedder_api_key: '',
        host: 'qdrant',
        port: 6333,
        collection_name: 'agente_amministrativo',
        score_threshold: 0.4,
        limit: 10,
      },
    },
    {
      id: 'node_agent',
      type: 'agent',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        api_key: '',
        stream: true,
        system_prompt: '',
        temperature: 0.1,
        model: 'openai:gpt-4.1',
        parallel_tool_calling: true,
      },
    },
    {
      id: 'tool_node_excel_0',
      type: 'tool',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        value: 'excel',
        config: {
          s3_access_key_id: '',
          s3_secret_access_key: '',
          s3_bucket_name: '',
          s3_endpoint_url: '',
        },
      },
    },
  ], [
    {
      id: 'end_tool_node_node_agent',
      source: 'node_agent',
      target: 'tool_node_excel_0',
      sourceHandle: 'tools',
    },
    {
      id: 'START_rag_node_0',
      source: 'START',
      target: 'rag_node',
    },
    {
      id: 'rag_node_node_agent_1',
      source: 'rag_node',
      target: 'node_agent',
    },
    {
      id: 'node_agent_END_2',
      source: 'node_agent',
      target: 'END',
    },
    {
      id: 'start_tool_node_node_agent',
      source: 'tool_node_excel_0',
      target: 'node_agent',
      targetHandle: 'tools',
    },
  ])).toStrictEqual({
    nodes: [
      {
        id: 'rag_node',
        node: 'RagNode',
        settings: {
          embedder_api_key: '',
          host: 'qdrant',
          port: 6333,
          collection_name: 'agente_amministrativo',
          score_threshold: 0.4,
          limit: 10,
        },
        position: {
          x: 0,
          y: 0,
        },
      },
      {
        id: 'node_agent',
        node: 'AgentNode',
        settings: {
          api_key: '',
          stream: true,
          system_prompt: '',
          temperature: 0.1,
          model: 'openai:gpt-4.1',
        },
        position: {
          x: 0,
          y: 0,
        },
        parallel_tool_calling: true,
        tools: [
          {
            name: 'ExcelGeneratorTool',
            settings: {
              s3_access_key_id: '',
              s3_secret_access_key: '',
              s3_bucket_name: '',
              s3_endpoint_url: '',
            },
          },
        ],
      },
      {
        id: 'tool_node',
        node: 'ToolNode',
        settings: {},
        position: {
          x: 0,
          y: 0,
        },
        parallel_tool_calling: true,
        tools: [
          {
            name: 'ExcelGeneratorTool',
            settings: {
              s3_access_key_id: '',
              s3_secret_access_key: '',
              s3_bucket_name: '',
              s3_endpoint_url: '',
            },
          },
        ],
      },
    ],
    edges: [
      {
        id: 'start_tool_node_node_agent',
        source: 'node_agent',
        target: 'tool_node_excel_0',
        source_handle: 'tools',
        target_handle: undefined,
      },
      {
        id: 'START_rag_node_0',
        source: 'START',
        target: 'rag_node',
        source_handle: undefined,
        target_handle: undefined,
      },
      {
        id: 'rag_node_node_agent_1',
        source: 'rag_node',
        target: 'node_agent',
        source_handle: undefined,
        target_handle: undefined,
      },
      {
        id: 'node_agent_END_2',
        source: 'node_agent',
        target: 'END',
        source_handle: undefined,
        target_handle: undefined,
      },
      {
        id: 'start_tool_node_node_agent',
        source: 'node_agent',
        condition: {
          tool_node: 'tools_condition',
        },
        source_handle: 'tools',
        target_handle: undefined,
      },
      {
        id: 'end_tool_node_node_agent',
        source: 'tool_node_excel_0',
        target: 'node_agent',
        source_handle: undefined,
        target_handle: 'tools',
      },
    ],
  })
})
