export const DAFFY_NODES = {
    START: 'start',
    END: 'end',
    AGENT: 'agent',
    RAG: 'rag',
    TOOL: 'tool',
} as const

export const DAFFY_TOOLS = {
    mcp: 'MCPTool',
    excel: 'ExcelGeneratorTool',
    postgres: 'PostgressTool',
} as const

export type FlowNodeType = typeof DAFFY_NODES[keyof typeof DAFFY_NODES]

export type FlowToolType = keyof typeof DAFFY_TOOLS

export type DaffyToolType = typeof DAFFY_TOOLS[FlowToolType]
