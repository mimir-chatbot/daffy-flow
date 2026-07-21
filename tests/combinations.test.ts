import { fromDaffyDuck, toDaffyDuck } from '@daffy'
import { expect, it } from 'vitest'
import {
  agentNode,
  conditionalLlmNode,
  daffyAgentNode,
  daffyConditionalLlmNode,
  daffyDeepAnalysisNode,
  daffyEdge,
  daffyRagNode,
  daffySupervisorNode,
  daffyTool,
  deepAnalysisNode,
  endNode,
  fakeToolNode,
  flowEdge,
  ragNode,
  startNode,
  supervisorNode,
  toolNode,
} from './fixtures'

// Scenario A: Supervisor fan-out
// start -> supervisor -> { agent1 [mcp tool + forms fake-tool], agent2 [rag_retriever tool + triggers fake-tool] } -> end
// plus a standalone RagNode feeding into agent1

it('toDaffyDuckSupervisorFanOut', () => {
  const nodes = [
    startNode('start'),
    endNode('end'),
    supervisorNode('supervisor', { strategy: 'round_robin' }),
    ragNode('rag_source'),
    agentNode('agent1'),
    agentNode('agent2'),
    toolNode('mcp_tool', 'mcp', { servers: { websearch: { url: 'test', transport: 'sse' } } }),
    fakeToolNode('forms_tool', 'forms', { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] }),
    toolNode('rag_retriever_tool', 'rag_retriever', { collection_name: 'kb' }),
    fakeToolNode('triggers_tool', 'triggers', { event: 'on_message' }),
  ]
  const edges = [
    flowEdge('start_supervisor', 'start', 'supervisor', { sourceHandle: 'start', targetHandle: 'supervisor' }),
    flowEdge('supervisor_agent1', 'supervisor', 'agent1', { sourceHandle: 'supervisor', targetHandle: 'agent' }),
    flowEdge('supervisor_agent2', 'supervisor', 'agent2', { sourceHandle: 'supervisor', targetHandle: 'agent' }),
    flowEdge('rag_agent1', 'rag_source', 'agent1', { sourceHandle: 'rag', targetHandle: 'agent' }),
    flowEdge('agent1_end', 'agent1', 'end', { sourceHandle: 'end', targetHandle: 'agent' }),
    flowEdge('agent2_end', 'agent2', 'end', { sourceHandle: 'end', targetHandle: 'agent' }),
    flowEdge('agent1_mcp', 'agent1', 'mcp_tool', { sourceHandle: 'source-agent-tools' }),
    flowEdge('agent1_forms', 'agent1', 'forms_tool', { sourceHandle: 'source-agent-forms' }),
    flowEdge('agent2_rag_retriever', 'agent2', 'rag_retriever_tool', { sourceHandle: 'source-agent-tools' }),
    flowEdge('agent2_triggers', 'agent2', 'triggers_tool', { sourceHandle: 'source-agent-triggers' }),
  ]

  expect(toDaffyDuck(nodes, edges)).toStrictEqual({
    nodes: [
      { id: 'supervisor', node: 'SupervisorNode', settings: { strategy: 'round_robin' }, position: { x: 0, y: 0 } },
      { id: 'rag_source', node: 'RagNode', settings: { collection_name: 'test' }, position: { x: 0, y: 0 } },
      {
        id: 'agent1',
        node: 'AgentNode',
        position: { x: 0, y: 0 },
        settings: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o' },
        parallel_tool_calling: true,
        tools: [
          { id: 'mcp_tool', position: { x: 0, y: 0 }, name: 'MCPTool', settings: { servers: { websearch: { url: 'test', transport: 'sse' } } } },
          { id: 'forms_tool', position: { x: 0, y: 0 }, name: 'FormTool', settings: { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] } },
        ],
      },
      {
        id: 'agent2',
        node: 'AgentNode',
        position: { x: 0, y: 0 },
        settings: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o' },
        parallel_tool_calling: true,
        tools: [
          { id: 'rag_retriever_tool', position: { x: 0, y: 0 }, name: 'RagRetrieverTool', settings: { collection_name: 'kb' } },
          { id: 'triggers_tool', position: { x: 0, y: 0 }, name: 'TriggerTool', settings: { event: 'on_message' } },
        ],
      },
    ],
    edges: [
      { id: 'start_supervisor', source: 'start', target: 'supervisor', source_handle: 'start', target_handle: 'supervisor' },
      { id: 'supervisor_agent1', source: 'supervisor', target: 'agent1', source_handle: 'supervisor', target_handle: 'agent' },
      { id: 'supervisor_agent2', source: 'supervisor', target: 'agent2', source_handle: 'supervisor', target_handle: 'agent' },
      { id: 'rag_agent1', source: 'rag_source', target: 'agent1', source_handle: 'rag', target_handle: 'agent' },
      { id: 'agent1_end', source: 'agent1', target: 'END', source_handle: 'end', target_handle: 'agent' },
      { id: 'agent2_end', source: 'agent2', target: 'END', source_handle: 'end', target_handle: 'agent' },
    ],
  })
})

it('fromDaffyDuckSupervisorFanOut', () => {
  const graph = {
    nodes: [
      daffySupervisorNode('supervisor', { strategy: 'round_robin' }),
      daffyRagNode('rag_source'),
      daffyAgentNode('agent1', [
        daffyTool('mcp_tool', 'mcp', { servers: { websearch: { url: 'test', transport: 'sse' } } }),
        daffyTool('forms_tool', 'forms', { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] }),
      ]),
      daffyAgentNode('agent2', [
        daffyTool('rag_retriever_tool', 'rag_retriever', { collection_name: 'kb' }),
        daffyTool('triggers_tool', 'triggers', { event: 'on_message' }),
      ]),
    ],
    edges: [
      daffyEdge('start', { id: 'start_supervisor', target: 'supervisor', sourceHandle: 'start', targetHandle: 'supervisor' }),
      daffyEdge('supervisor', { id: 'supervisor_agent1', target: 'agent1', sourceHandle: 'supervisor', targetHandle: 'agent' }),
      daffyEdge('supervisor', { id: 'supervisor_agent2', target: 'agent2', sourceHandle: 'supervisor', targetHandle: 'agent' }),
      daffyEdge('rag_source', { id: 'rag_agent1', target: 'agent1', sourceHandle: 'rag', targetHandle: 'agent' }),
      daffyEdge('agent1', { id: 'agent1_end', target: 'END', sourceHandle: 'end', targetHandle: 'agent' }),
      daffyEdge('agent2', { id: 'agent2_end', target: 'END', sourceHandle: 'end', targetHandle: 'agent' }),
    ],
  }

  expect(fromDaffyDuck(graph as any)).toStrictEqual({
    nodes: [
      { id: 'START', type: 'start', position: { x: -500, y: 0 }, deletable: false },
      { id: 'END', type: 'end', position: { x: 500, y: 0 }, deletable: false },
      { id: 'supervisor', type: 'supervisor', position: { x: 0, y: 0 }, data: { strategy: 'round_robin' } },
      { id: 'rag_source', type: 'rag', position: { x: 0, y: 0 }, data: { collection_name: 'test' } },
      {
        id: 'agent1',
        type: 'agent',
        position: { x: 0, y: 0 },
        data: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o', parallel_tool_calling: true },
      },
      {
        id: 'agent2',
        type: 'agent',
        position: { x: 0, y: 0 },
        data: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o', parallel_tool_calling: true },
      },
      { id: 'mcp_tool', type: 'tool', position: { x: 0, y: 0 }, data: { value: 'mcp', config: { servers: { websearch: { url: 'test', transport: 'sse' } } } } },
      { id: 'forms_tool', type: 'forms', position: { x: 0, y: 0 }, data: { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] } },
      { id: 'rag_retriever_tool', type: 'tool', position: { x: 0, y: 0 }, data: { value: 'rag_retriever', config: { collection_name: 'kb' } } },
      { id: 'triggers_tool', type: 'triggers', position: { x: 0, y: 0 }, data: { event: 'on_message' } },
    ],
    edges: [
      { id: 'tool_node_mcp_0', source: 'agent1', target: 'mcp_tool', sourceHandle: 'source-agent-tools' },
      { id: 'tool_node_forms_1', source: 'agent1', target: 'forms_tool', sourceHandle: 'source-agent-forms' },
      { id: 'tool_node_rag_retriever_0', source: 'agent2', target: 'rag_retriever_tool', sourceHandle: 'source-agent-tools' },
      { id: 'tool_node_triggers_1', source: 'agent2', target: 'triggers_tool', sourceHandle: 'source-agent-triggers' },
      { id: 'start_supervisor', source: 'start', target: 'supervisor', sourceHandle: 'start', targetHandle: 'supervisor' },
      { id: 'supervisor_agent1', source: 'supervisor', target: 'agent1', sourceHandle: 'supervisor', targetHandle: 'agent' },
      { id: 'supervisor_agent2', source: 'supervisor', target: 'agent2', sourceHandle: 'supervisor', targetHandle: 'agent' },
      { id: 'rag_agent1', source: 'rag_source', target: 'agent1', sourceHandle: 'rag', targetHandle: 'agent' },
      { id: 'agent1_end', source: 'agent1', target: 'END', sourceHandle: 'end', targetHandle: 'agent' },
      { id: 'agent2_end', source: 'agent2', target: 'END', sourceHandle: 'end', targetHandle: 'agent' },
    ],
  })
})

// Scenario B: Conditional branching to mixed node types
// start -> conditional_llm -> { AgentNode [with tools], DeepAnalysisNode [with tools] } -> end

it('toDaffyDuckConditionalBranchingMixedNodes', () => {
  const nodes = [
    startNode('start'),
    endNode('end'),
    conditionalLlmNode('router', { criteria: 'intent' }),
    agentNode('agent_branch'),
    deepAnalysisNode('deep_branch'),
    toolNode('mcp_tool_b', 'mcp', { servers: { websearch: { url: 'test', transport: 'sse' } } }),
    fakeToolNode('forms_tool_b', 'forms', { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] }),
    toolNode('sql_tool_b', 'sql_database', { connection_string: 'test' }),
  ]
  const edges = [
    flowEdge('start_router', 'start', 'router', { sourceHandle: 'start', targetHandle: 'router' }),
    flowEdge('router_agent', 'router', 'agent_branch', { sourceHandle: 'source-condition-a', targetHandle: 'agent' }),
    flowEdge('router_deep', 'router', 'deep_branch', { sourceHandle: 'source-condition-b', targetHandle: 'agent' }),
    flowEdge('agent_end', 'agent_branch', 'end', { sourceHandle: 'end', targetHandle: 'agent' }),
    flowEdge('deep_end', 'deep_branch', 'end', { sourceHandle: 'end', targetHandle: 'agent' }),
    flowEdge('agent_mcp', 'agent_branch', 'mcp_tool_b', { sourceHandle: 'source-agent-tools' }),
    flowEdge('agent_forms', 'agent_branch', 'forms_tool_b', { sourceHandle: 'source-agent-forms' }),
    flowEdge('deep_sql', 'deep_branch', 'sql_tool_b', { sourceHandle: 'source-agent-tools' }),
  ]

  expect(toDaffyDuck(nodes, edges)).toStrictEqual({
    nodes: [
      { id: 'router', node: 'ConditionalLLMNode', settings: { criteria: 'intent' }, position: { x: 0, y: 0 } },
      {
        id: 'agent_branch',
        node: 'AgentNode',
        position: { x: 0, y: 0 },
        settings: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o' },
        parallel_tool_calling: true,
        tools: [
          { id: 'mcp_tool_b', position: { x: 0, y: 0 }, name: 'MCPTool', settings: { servers: { websearch: { url: 'test', transport: 'sse' } } } },
          { id: 'forms_tool_b', position: { x: 0, y: 0 }, name: 'FormTool', settings: { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] } },
        ],
      },
      {
        id: 'deep_branch',
        node: 'DeepAnalysisNode',
        position: { x: 0, y: 0 },
        settings: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o' },
        parallel_tool_calling: true,
        tools: [
          { id: 'sql_tool_b', position: { x: 0, y: 0 }, name: 'SQLDatabaseTool', settings: { connection_string: 'test' } },
        ],
      },
    ],
    edges: [
      { id: 'start_router', source: 'start', target: 'router', source_handle: 'start', target_handle: 'router' },
      { id: 'router_agent', source: 'router', target: 'agent_branch', source_handle: 'source-condition-a', target_handle: 'agent' },
      { id: 'router_deep', source: 'router', target: 'deep_branch', source_handle: 'source-condition-b', target_handle: 'agent' },
      { id: 'agent_end', source: 'agent_branch', target: 'END', source_handle: 'end', target_handle: 'agent' },
      { id: 'deep_end', source: 'deep_branch', target: 'END', source_handle: 'end', target_handle: 'agent' },
    ],
  })
})

it('fromDaffyDuckConditionalBranchingMixedNodes', () => {
  const graph = {
    nodes: [
      daffyConditionalLlmNode('router', { criteria: 'intent' }),
      daffyAgentNode('agent_branch', [
        daffyTool('mcp_tool_b', 'mcp', { servers: { websearch: { url: 'test', transport: 'sse' } } }),
        daffyTool('forms_tool_b', 'forms', { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] }),
      ]),
      daffyDeepAnalysisNode('deep_branch', [
        daffyTool('sql_tool_b', 'sql_database', { connection_string: 'test' }),
      ]),
    ],
    edges: [
      daffyEdge('start', { id: 'start_router', target: 'router', sourceHandle: 'start', targetHandle: 'router' }),
      daffyEdge('router', { id: 'router_agent', target: 'agent_branch', sourceHandle: 'source-condition-a', targetHandle: 'agent' }),
      daffyEdge('router', { id: 'router_deep', target: 'deep_branch', sourceHandle: 'source-condition-b', targetHandle: 'agent' }),
      daffyEdge('agent_branch', { id: 'agent_end', target: 'END', sourceHandle: 'end', targetHandle: 'agent' }),
      daffyEdge('deep_branch', { id: 'deep_end', target: 'END', sourceHandle: 'end', targetHandle: 'agent' }),
    ],
  }

  expect(fromDaffyDuck(graph as any)).toStrictEqual({
    nodes: [
      { id: 'START', type: 'start', position: { x: -500, y: 0 }, deletable: false },
      { id: 'END', type: 'end', position: { x: 500, y: 0 }, deletable: false },
      { id: 'router', type: 'conditional_llm', position: { x: 0, y: 0 }, data: { criteria: 'intent' } },
      {
        id: 'agent_branch',
        type: 'agent',
        position: { x: 0, y: 0 },
        data: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o', parallel_tool_calling: true },
      },
      {
        id: 'deep_branch',
        type: 'deep_analysis',
        position: { x: 0, y: 0 },
        data: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o', parallel_tool_calling: true },
      },
      { id: 'mcp_tool_b', type: 'tool', position: { x: 0, y: 0 }, data: { value: 'mcp', config: { servers: { websearch: { url: 'test', transport: 'sse' } } } } },
      { id: 'forms_tool_b', type: 'forms', position: { x: 0, y: 0 }, data: { title: 'Lead Form', fields: [{ name: 'email', type: 'text' }] } },
      { id: 'sql_tool_b', type: 'tool', position: { x: 0, y: 0 }, data: { value: 'sql_database', config: { connection_string: 'test' } } },
    ],
    edges: [
      { id: 'tool_node_mcp_0', source: 'agent_branch', target: 'mcp_tool_b', sourceHandle: 'source-agent-tools' },
      { id: 'tool_node_forms_1', source: 'agent_branch', target: 'forms_tool_b', sourceHandle: 'source-agent-forms' },
      { id: 'tool_node_sql_database_0', source: 'deep_branch', target: 'sql_tool_b', sourceHandle: 'source-agent-tools' },
      { id: 'start_router', source: 'start', target: 'router', sourceHandle: 'start', targetHandle: 'router' },
      { id: 'router_agent', source: 'router', target: 'agent_branch', sourceHandle: 'source-condition-a', targetHandle: 'agent' },
      { id: 'router_deep', source: 'router', target: 'deep_branch', sourceHandle: 'source-condition-b', targetHandle: 'agent' },
      { id: 'agent_end', source: 'agent_branch', target: 'END', sourceHandle: 'end', targetHandle: 'agent' },
      { id: 'deep_end', source: 'deep_branch', target: 'END', sourceHandle: 'end', targetHandle: 'agent' },
    ],
  })
})

// edge.data?.excluded flag: an excluded edge is dropped entirely from the output

it('toDaffyDuckExcludedEdge', () => {
  const nodes = [startNode('start'), endNode('end'), agentNode('agent_a'), agentNode('agent_b')]
  const edges = [
    flowEdge('start_a', 'start', 'agent_a', { sourceHandle: 'start', targetHandle: 'agent' }),
    flowEdge('a_b', 'agent_a', 'agent_b', { sourceHandle: 'a-b', targetHandle: 'agent', data: { excluded: true } }),
    flowEdge('b_end', 'agent_b', 'end', { sourceHandle: 'end', targetHandle: 'agent' }),
  ]

  expect(toDaffyDuck(nodes, edges)).toStrictEqual({
    nodes: [
      {
        id: 'agent_a',
        node: 'AgentNode',
        position: { x: 0, y: 0 },
        settings: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o' },
        parallel_tool_calling: true,
        tools: [],
      },
      {
        id: 'agent_b',
        node: 'AgentNode',
        position: { x: 0, y: 0 },
        settings: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o' },
        parallel_tool_calling: true,
        tools: [],
      },
    ],
    edges: [
      { id: 'start_a', source: 'start', target: 'agent_a', source_handle: 'start', target_handle: 'agent' },
      { id: 'b_end', source: 'agent_b', target: 'END', source_handle: 'end', target_handle: 'agent' },
    ],
  })
})

// fromDaffyDuck target fallback: target: e.target || Object.keys(e.condition || {})[0] || 'tool_node'

it('fromDaffyDuckConditionFallbackTarget', () => {
  const graph = {
    nodes: [daffyConditionalLlmNode('router_y'), daffyAgentNode('agent_x')],
    edges: [daffyEdge('router_y', { id: 'router_edge', condition: { agent_x: 'true_branch' } })],
  }

  expect(fromDaffyDuck(graph as any)).toStrictEqual({
    nodes: [
      { id: 'START', type: 'start', position: { x: -500, y: 0 }, deletable: false },
      { id: 'END', type: 'end', position: { x: 500, y: 0 }, deletable: false },
      { id: 'router_y', type: 'conditional_llm', position: { x: 0, y: 0 }, data: {} },
      {
        id: 'agent_x',
        type: 'agent',
        position: { x: 0, y: 0 },
        data: { api_key: '', stream: true, system_prompt: '', temperature: 0.1, model: 'openai:gpt-4o', parallel_tool_calling: true },
      },
    ],
    edges: [
      { id: 'router_edge', source: 'router_y', target: 'agent_x', sourceHandle: undefined, targetHandle: undefined },
    ],
  })
})
