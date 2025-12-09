export const DAFFY_TO_FLOW_NODES = {
  AgentNode: 'agent',
  RagNode: 'rag',
  ToolNode: 'tool',
  ConditionalLLMNode: 'conditional_llm',
  PostgressIntrospectionNode: 'postgres_introspection',
  MSSQLIntrospectionNode: 'mssql_introspection',
  MySQLIntrospectionNode: 'mysql_introspection',
} as const

export const FLOW_TO_DAFFY_NODES = {
  agent: 'AgentNode',
  rag: 'RagNode',
  tool: 'ToolNode',
  conditional_llm: 'ConditionalLLMNode',
  postgres_introspection: 'PostgressIntrospectionNode',
  mssql_introspection: 'MSSQLIntrospectionNode',
  mysql_introspection: 'MySQLIntrospectionNode',
} as const

export const FLOW_TO_DAFFY_TOOLS = {
  mcp: 'MCPTool',
  excel: 'ExcelGeneratorTool',
  postgres: 'PostgressTool',
  metadata: 'SaveMetadataTool',
  whatsapp_send_message: 'WhatsappSendMessageTool',
  odbc: 'AIOOdbcTool',
} as const

export const DAFFY_TO_FLOW_TOOLS = {
  MCPTool: 'mcp',
  ExcelGeneratorTool: 'excel',
  PostgressTool: 'postgres',
  SaveMetadataTool: 'metadata',
  WhatsappSendMessageTool: 'whatsapp_send_message',
  AIOOdbcTool: 'odbc',
} as const

export type FlowNodeType = keyof typeof FLOW_TO_DAFFY_NODES

export type FlowToolType = keyof typeof FLOW_TO_DAFFY_TOOLS

export type DaffyNodeType = keyof typeof DAFFY_TO_FLOW_NODES

export type DaffyToolType = keyof typeof DAFFY_TO_FLOW_TOOLS
