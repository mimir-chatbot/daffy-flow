import { Edge, Node, XYPosition } from "@vue-flow/core";

//#region src/constants.d.ts
declare const DAFFY_TO_FLOW_NODES: {
  readonly AgentNode: "agent";
  readonly RagNode: "rag";
  readonly ToolNode: "tool";
  readonly ConditionalLLMNode: "conditional_llm";
  readonly SupervisorNode: "supervisor";
  readonly DeepAnalysisNode: "deep_analysis";
};
declare const DAFFY_START = "START";
declare const DAFFY_END = "END";
declare const FLOW_TO_DAFFY_NODES: {
  readonly agent: "AgentNode";
  readonly rag: "RagNode";
  readonly tool: "ToolNode";
  readonly conditional_llm: "ConditionalLLMNode";
  readonly supervisor: "SupervisorNode";
  readonly deep_analysis: "DeepAnalysisNode";
};
declare const FLOW_TO_DAFFY_TOOLS: {
  readonly mcp: "MCPTool";
  readonly excel: "ExcelGeneratorTool";
  readonly sql_database: "SQLDatabaseTool";
  readonly metadata: "SaveMetadataTool";
  readonly whatsapp_send_message: "WhatsappSendMessageTool";
  readonly file_reader: "FileReaderTool";
  readonly rag_retriever: "RagRetrieverTool";
  readonly chart: "ChartTool";
  readonly forms: "FormTool";
};
declare const DAFFY_TO_FLOW_TOOLS: {
  readonly MCPTool: "mcp";
  readonly ExcelGeneratorTool: "excel";
  readonly SQLDatabaseTool: "sql_database";
  readonly SaveMetadataTool: "metadata";
  readonly WhatsappSendMessageTool: "whatsapp_send_message";
  readonly FileReaderTool: "file_reader";
  readonly RagRetrieverTool: "rag_retriever";
  readonly ChartTool: "chart";
  readonly FormTool: "forms";
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
  id?: string;
  name: DaffyToolType;
  position?: XYPosition;
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
type DaffyToolNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.tool> & WithTools;
type DaffyAgentNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.agent, DaffyNodeAgentSettings> & WithTools;
type DaffyRagNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.rag>;
type DaffyConditionalLLMNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.conditional_llm>;
type DaffyDeepAnalysisNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.deep_analysis, DaffyNodeAgentSettings> & WithTools;
type DaffySupervisorNode = DaffyNodeBase<typeof FLOW_TO_DAFFY_NODES.supervisor>;
interface DaffyEdge {
  id?: string;
  source: string;
  target?: string;
  condition?: Record<string, string>;
  source_handle?: string;
  target_handle?: string;
}
type DaffyNode = DaffyAgentNode | DaffyRagNode | DaffyDeepAnalysisNode | DaffyConditionalLLMNode | DaffySupervisorNode | DaffyToolNode;
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
export { DAFFY_END, DAFFY_START, DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS, DaffyAgentNode, DaffyConditionalLLMNode, DaffyDeepAnalysisNode, DaffyEdge, DaffyGraph, DaffyNode, DaffyNodeAgentSettings, DaffyNodeBase, DaffyNodeType, DaffyRagNode, DaffySupervisorNode, DaffyTool, DaffyToolNode, DaffyToolType, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS, FlowNodeType, FlowToolType, fromDaffyDuck, toDaffyDuck };
//# sourceMappingURL=index.d.ts.map