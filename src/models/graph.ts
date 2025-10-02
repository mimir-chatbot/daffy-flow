import type {XYPosition} from "@vue-flow/core";

export type DaffyNodeAgentSettings = {
    api_key: string
    stream: boolean
    system_prompt: string
    temperature: number
    model: string
}

export type DaffyTool = {
    name: string
    settings: Record<string, any>
}


export type DaffyNodeBase = {
    id: string
    settings: Record<string, any>
    position: XYPosition
}

export type DaffyToolNode = DaffyNodeBase & {
    node: "ToolNode"
    parallel_tool_calling: boolean
    tools: DaffyTool[]
}

export type DaffyNodeAgent = DaffyNodeBase & {
    node: "AgentNode"
    settings: DaffyNodeAgentSettings
    parallel_tool_calling: boolean
    tools: DaffyTool[]
}
export type DaffyRagNode = {
    node: "RagNode"
}

export type DaffyPostgressIntrospectionNode = {
    node: "PostgressIntrospectionNode"
}

export type DaffyMSSQLIntrospectionNode = {
    node: "MSSQLIntrospectionNode"
}


export type DaffyEdge = {
    source: string
    target?: string
    label?: string
    condition?: string
    source_handle?: string
    target_handle?: string
}

export type DaffyGraph = {

    nodes: (DaffyNodeAgent|DaffyToolNode|DaffyRagNode|DaffyPostgressIntrospectionNode|DaffyMSSQLIntrospectionNode)[]
    edges: DaffyEdge[]

}

