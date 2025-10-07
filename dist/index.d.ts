import { Edge, Node, XYPosition } from "@vue-flow/core";

//#region src/constants.d.ts
declare const DAFFY_TO_FLOW_NODES: {
  readonly StartNode: "start";
  readonly EndNode: "end";
  readonly AgentNode: "agent";
  readonly RagNode: "rag";
  readonly ToolNode: "tool";
  readonly PostgresIntrospectionNode: "postgres_introspection";
  readonly MSSQLIntrospectionNode: "mssql_introspection";
};
declare const FLOW_TO_DAFFY_NODES: {
  readonly start: "StartNode";
  readonly end: "EndNode";
  readonly agent: "AgentNode";
  readonly rag: "RagNode";
  readonly tool: "ToolNode";
  readonly postgres_introspection: "PostgresIntrospectionNode";
  readonly mssql_introspection: "MSSQLIntrospectionNode";
};
declare const FLOW_TO_DAFFY_TOOLS: {
  readonly mcp: "MCPTool";
  readonly excel: "ExcelGeneratorTool";
  readonly postgres: "PostgressTool";
};
declare const DAFFY_TO_FLOW_TOOLS: {
  readonly MCPTool: "mcp";
  readonly ExcelGeneratorTool: "excel";
  readonly PostgressTool: "postgres";
};
type FlowNodeType = keyof typeof FLOW_TO_DAFFY_NODES;
type FlowToolType = keyof typeof FLOW_TO_DAFFY_TOOLS;
type DaffyNodeType = keyof typeof DAFFY_TO_FLOW_NODES;
type DaffyToolType = keyof typeof DAFFY_TO_FLOW_TOOLS;
//#endregion
//#region src/models/graph.d.ts
interface DaffyNodeAgentSettings {
  api_key: string;
  stream: boolean;
  system_prompt: string;
  temperature: number;
  model: string;
}
interface DaffyTool {
  name: DaffyToolType;
  settings: Record<string, any>;
}
interface DaffyNodeBase<T extends DaffyNodeType = DaffyNodeType, S extends Record<string, any> = Record<string, any>> {
  id: string;
  node: T;
  settings: S;
  position: XYPosition;
}
interface WithTools {
  parallel_tool_calling: boolean;
  tools: DaffyTool[];
}
type DaffyAgentNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.agent, DaffyNodeAgentSettings> & WithTools;
type DaffyToolNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.tool> & WithTools;
type DaffyRagNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.rag>;
type DaffyPostgresIntrospectionNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.postgres_introspection>;
type DaffyMSSQLIntrospectionNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.mssql_introspection>;
interface DaffyEdge {
  id: string;
  source: string;
  target?: string;
  condition?: Record<string, string>;
  source_handle?: string;
  target_handle?: string;
}
type DaffyNode = DaffyAgentNode | DaffyToolNode | DaffyRagNode | DaffyPostgresIntrospectionNode | DaffyMSSQLIntrospectionNode;
interface DaffyGraph {
  nodes: DaffyNode[];
  edges: DaffyEdge[];
}
//#endregion
//#region src/fromDaffyDuck.d.ts
declare function fromDaffyDuck(graph: DaffyGraph): {
  nodes: Node[];
  edges: Edge[];
};
//#endregion
//#region src/toDaffyDuck.d.ts
declare function toDaffyDuck(nodes: Node[], edges: Edge[]): DaffyGraph;
//#endregion
export { DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS, DaffyAgentNode, DaffyEdge, DaffyGraph, DaffyMSSQLIntrospectionNode, DaffyNode, DaffyNodeAgentSettings, DaffyNodeBase, DaffyNodeType, DaffyPostgresIntrospectionNode, DaffyRagNode, DaffyTool, DaffyToolNode, DaffyToolType, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS, FlowNodeType, FlowToolType, fromDaffyDuck, toDaffyDuck };
//# sourceMappingURL=index.d.ts.map