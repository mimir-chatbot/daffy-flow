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
