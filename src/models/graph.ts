import type { XYPosition } from '@vue-flow/core'

export interface DaffyNodeAgentSettings {
  api_key: string
  stream: boolean
  system_prompt: string
  temperature: number
  model: string
}

export interface DaffyTool {
  name: string
  settings: Record<string, any>
}

export interface DaffyNodeBase<T extends string = string, S extends Record<string, any> = Record<string, any>> {
  id: string
  node: T
  settings: S
  position: XYPosition
}

interface WithTools {
  parallel_tool_calling: boolean
  tools: DaffyTool[]
}

export type DaffyAgentNode = DaffyNodeBase<'AgentNode', DaffyNodeAgentSettings> & WithTools

export type DaffyToolNode = DaffyNodeBase<'ToolNode'> & WithTools

export type DaffyRagNode = DaffyNodeBase<'RagNode'>

export type DaffyPostgresIntrospectionNode = DaffyNodeBase<'PostgresIntrospectionNode'>

export type DaffyMSSQLIntrospectionNode = DaffyNodeBase<'MSSQLIntrospectionNode'>

export interface DaffyEdge {
  source: string
  target?: string
  label?: string
  condition?: Record<string, string>
  source_handle?: string
  target_handle?: string
}

export type DaffyNode = DaffyAgentNode | DaffyToolNode | DaffyRagNode | DaffyPostgresIntrospectionNode | DaffyMSSQLIntrospectionNode

export interface DaffyGraph {
  nodes: DaffyNode[]
  edges: DaffyEdge[]
}
