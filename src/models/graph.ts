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

export type DaffyAgentNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.agent, DaffyNodeAgentSettings> & WithTools

export type DaffyToolNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.tool> & WithTools

export type DaffyRagNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.rag>

export type DaffyPostgressIntrospectionNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.postgres_introspection>

export type DaffyMSSQLIntrospectionNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.mssql_introspection>

export interface DaffyEdge {
  id?: string
  source: string
  target?: string
  condition?: Record<string, string>
  source_handle?: string
  target_handle?: string
}

export type DaffyNode = DaffyAgentNode | DaffyToolNode | DaffyRagNode | DaffyPostgressIntrospectionNode | DaffyMSSQLIntrospectionNode

export interface DaffyGraph {
  nodes: DaffyNode[]
  edges: DaffyEdge[]
}
