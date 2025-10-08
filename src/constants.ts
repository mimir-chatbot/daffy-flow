export const DAFFY_TO_FLOW_NODES = {
  StartNode: 'start',
  EndNode: 'end',
  AgentNode: 'agent',
  RagNode: 'rag',
  ToolNode: 'tool',
  PostgressIntrospectionNode: 'postgres_introspection',
  MSSQLIntrospectionNode: 'mssql_introspection',
} as const

export const FLOW_TO_DAFFY_NODES = {
  start: 'StartNode',
  end: 'EndNode',
  agent: 'AgentNode',
  rag: 'RagNode',
  tool: 'ToolNode',
  postgres_introspection: 'PostgressIntrospectionNode',
  mssql_introspection: 'MSSQLIntrospectionNode',
} as const

export const FLOW_TO_DAFFY_TOOLS = {
  mcp: 'MCPTool',
  excel: 'ExcelGeneratorTool',
  postgres: 'PostgressTool',
} as const

export const DAFFY_TO_FLOW_TOOLS = {
  MCPTool: 'mcp',
  ExcelGeneratorTool: 'excel',
  PostgressTool: 'postgres',
} as const

export type FlowNodeType = keyof typeof FLOW_TO_DAFFY_NODES

export type FlowToolType = keyof typeof FLOW_TO_DAFFY_TOOLS

export type DaffyNodeType = keyof typeof DAFFY_TO_FLOW_NODES

export type DaffyToolType = keyof typeof DAFFY_TO_FLOW_TOOLS
