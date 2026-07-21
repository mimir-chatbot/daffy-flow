import type { DaffyEdge, DaffyNode, DaffyNodeAgentSettings, DaffyTool } from '@daffy'
import type { Edge, Node, XYPosition } from '@vue-flow/core'
import { DAFFY_TO_FLOW_NODES, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS } from '@daffy'

const POSITION: XYPosition = { x: 0, y: 0 }

export function agentSettings(overrides: Partial<DaffyNodeAgentSettings> = {}): DaffyNodeAgentSettings {
  return {
    api_key: '',
    stream: true,
    system_prompt: '',
    temperature: 0.1,
    model: 'openai:gpt-4o',
    ...overrides,
  }
}

// --- Vue Flow side fixtures ---

export function startNode(id = 'start'): Node {
  return { id, type: 'start', position: POSITION }
}

export function endNode(id = 'end'): Node {
  return { id, type: 'end', position: POSITION }
}

export function agentNode(id: string, overrides: Partial<DaffyNodeAgentSettings> = {}): Node {
  return { id, type: DAFFY_TO_FLOW_NODES.AgentNode, position: POSITION, data: { parallel_tool_calling: true, ...agentSettings(overrides) } }
}

export function deepAnalysisNode(id: string, overrides: Partial<DaffyNodeAgentSettings> = {}): Node {
  return { id, type: DAFFY_TO_FLOW_NODES.DeepAnalysisNode, position: POSITION, data: { parallel_tool_calling: true, ...agentSettings(overrides) } }
}

export function supervisorNode(id: string, data: Record<string, any> = {}): Node {
  return { id, type: DAFFY_TO_FLOW_NODES.SupervisorNode, position: POSITION, data }
}

export function conditionalLlmNode(id: string, data: Record<string, any> = {}): Node {
  return { id, type: DAFFY_TO_FLOW_NODES.ConditionalLLMNode, position: POSITION, data }
}

export function ragNode(id: string, data: Record<string, any> = { collection_name: 'test' }): Node {
  return { id, type: DAFFY_TO_FLOW_NODES.RagNode, position: POSITION, data }
}

export function toolNode(id: string, toolType: keyof typeof FLOW_TO_DAFFY_TOOLS, config: Record<string, any> = {}): Node {
  return { id, type: DAFFY_TO_FLOW_NODES.ToolNode, position: POSITION, data: { value: toolType, config } }
}

export function fakeToolNode(id: string, type: 'forms' | 'triggers', data: Record<string, any> = {}): Node {
  return { id, type, position: POSITION, data }
}

export function flowEdge(id: string, source: string, target: string, options: { sourceHandle?: string, targetHandle?: string, data?: Record<string, any> } = {}): Edge {
  return { id, source, target, sourceHandle: options.sourceHandle, targetHandle: options.targetHandle, data: options.data } as Edge
}

// --- Daffy side fixtures ---

export function daffyTool(id: string, toolType: keyof typeof FLOW_TO_DAFFY_TOOLS, settings: Record<string, any> = {}): DaffyTool {
  return { id, position: POSITION, name: FLOW_TO_DAFFY_TOOLS[toolType], settings }
}

export function daffyAgentNode(id: string, tools: DaffyTool[] = [], overrides: Partial<DaffyNodeAgentSettings> = {}): DaffyNode {
  return { id, node: FLOW_TO_DAFFY_NODES.agent, parallel_tool_calling: true, position: POSITION, settings: agentSettings(overrides), tools }
}

export function daffyDeepAnalysisNode(id: string, tools: DaffyTool[] = [], overrides: Partial<DaffyNodeAgentSettings> = {}): DaffyNode {
  return { id, node: FLOW_TO_DAFFY_NODES.deep_analysis, parallel_tool_calling: true, position: POSITION, settings: agentSettings(overrides), tools }
}

export function daffySupervisorNode(id: string, settings: Record<string, any> = {}): DaffyNode {
  return { id, node: FLOW_TO_DAFFY_NODES.supervisor, position: POSITION, settings }
}

export function daffyConditionalLlmNode(id: string, settings: Record<string, any> = {}): DaffyNode {
  return { id, node: FLOW_TO_DAFFY_NODES.conditional_llm, position: POSITION, settings }
}

export function daffyRagNode(id: string, settings: Record<string, any> = { collection_name: 'test' }): DaffyNode {
  return { id, node: FLOW_TO_DAFFY_NODES.rag, position: POSITION, settings }
}

export function daffyEdge(source: string, options: { id?: string, target?: string, sourceHandle?: string, targetHandle?: string, condition?: Record<string, string> } = {}): DaffyEdge {
  return { id: options.id, source, target: options.target, source_handle: options.sourceHandle, target_handle: options.targetHandle, condition: options.condition }
}
