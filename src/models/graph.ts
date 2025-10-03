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

export interface DaffyNodeBase {
  id: string
  settings: Record<string, any>
  position: XYPosition
}

export type DaffyToolNode = DaffyNodeBase & {
  node: 'ToolNode'
  parallel_tool_calling: boolean
  tools: DaffyTool[]
}

export type DaffyNodeAgent = DaffyNodeBase & {
  node: 'AgentNode'
  settings: DaffyNodeAgentSettings
  parallel_tool_calling: boolean
  tools: DaffyTool[]
}
export type DaffyRagNode = DaffyNodeBase & {
  node: 'RagNode'
}

export type DaffyPostgressIntrospectionNode = DaffyNodeBase & {
  node: 'PostgressIntrospectionNode'
}

export type DaffyMSSQLIntrospectionNode = DaffyNodeBase & {
  node: 'MSSQLIntrospectionNode'
}

export interface DaffyEdge {
  source: string
  target?: string
  label?: string
  condition?: Record<string, string>
  source_handle?: string
  target_handle?: string
}

export interface DaffyGraph {

  nodes: (DaffyNodeAgent | DaffyToolNode | DaffyRagNode | DaffyPostgressIntrospectionNode | DaffyMSSQLIntrospectionNode)[]
  edges: DaffyEdge[]

}
