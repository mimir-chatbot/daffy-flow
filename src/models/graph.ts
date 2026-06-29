import type { XYPosition } from '@vue-flow/core'
import type { DaffyNodeType, DaffyToolType, FLOW_TO_DAFFY_NODES } from '../constants'

export interface DaffyNodeAgentSettings {
  api_key: string
  stream: boolean
  system_prompt: string
  temperature: number
  model: string
}

export interface DaffyTool {
  id?: string
  name: DaffyToolType
  position?: XYPosition
  settings: Record<string, any>
}

export interface DaffyNodeBase<T extends DaffyNodeType = DaffyNodeType, S extends Record<string, any> = Record<string, any>> {
  id: string
  node: T
  settings: S
  position: XYPosition
}

interface WithTools {
  parallel_tool_calling: boolean
  tools: DaffyTool[]
}

export type DaffyToolNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.tool> & WithTools

export type DaffyAgentNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.agent, DaffyNodeAgentSettings> & WithTools

export type DaffyRagNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.rag>

export type DaffyConditionalLLMNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.conditional_llm>

export type DaffyDeepAnalysisNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.deep_analysis, DaffyNodeAgentSettings> & WithTools

export type DaffySupervisorNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.supervisor>

export interface DaffyEdge {
  id?: string
  source: string
  target?: string
  condition?: Record<string, string>
  source_handle?: string
  target_handle?: string
}

export type DaffyNode = DaffyAgentNode | DaffyRagNode | DaffyDeepAnalysisNode
  | DaffyConditionalLLMNode | DaffySupervisorNode | DaffyToolNode

export interface DaffyGraph {
  nodes: DaffyNode[]
  edges: DaffyEdge[]
}
