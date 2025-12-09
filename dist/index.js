//#region src/constants.ts
const DAFFY_TO_FLOW_NODES = {
	AgentNode: "agent",
	RagNode: "rag",
	ToolNode: "tool",
	ConditionalLLMNode: "conditional_llm",
	PostgressIntrospectionNode: "postgres_introspection",
	MSSQLIntrospectionNode: "mssql_introspection",
	MySQLIntrospectionNode: "mysql_introspection"
};
const FLOW_TO_DAFFY_NODES = {
	agent: "AgentNode",
	rag: "RagNode",
	tool: "ToolNode",
	conditional_llm: "ConditionalLLMNode",
	postgres_introspection: "PostgressIntrospectionNode",
	mssql_introspection: "MSSQLIntrospectionNode",
	mysql_introspection: "MySQLIntrospectionNode"
};
const FLOW_TO_DAFFY_TOOLS = {
	mcp: "MCPTool",
	excel: "ExcelGeneratorTool",
	postgres: "PostgressTool",
	metadata: "SaveMetadataTool",
	whatsapp_send_message: "WhatsappSendMessageTool",
	odbc: "AIOOdbcTool"
};
const DAFFY_TO_FLOW_TOOLS = {
	MCPTool: "mcp",
	ExcelGeneratorTool: "excel",
	PostgressTool: "postgres",
	SaveMetadataTool: "metadata",
	WhatsappSendMessageTool: "whatsapp_send_message",
	AIOOdbcTool: "odbc"
};

//#endregion
//#region src/fromDaffyDuck.ts
function fromDaffyDuck(graph) {
	const nodes = [{
		id: "START",
		type: "start",
		position: {
			x: -500,
			y: 0
		},
		deletable: false
	}, {
		id: "END",
		type: "end",
		position: {
			x: 500,
			y: 0
		},
		deletable: false
	}];
	const edges = [];
	for (const daffyNode of graph.nodes.filter((n) => n.node !== "ToolNode")) nodes.push({
		id: daffyNode.id,
		type: DAFFY_TO_FLOW_NODES[daffyNode.node],
		position: daffyNode.position,
		data: {
			...daffyNode.settings,
			..."parallel_tool_calling" in daffyNode ? { parallel_tool_calling: daffyNode.parallel_tool_calling } : {}
		}
	});
	graph.nodes.filter((n) => n.node === "AgentNode").forEach((node) => {
		node.tools.forEach((tool) => {
			const toolType = DAFFY_TO_FLOW_TOOLS[tool.name];
			nodes.push({
				id: tool.id || `tool_node_${toolType}_${node.id}`,
				type: DAFFY_TO_FLOW_NODES.ToolNode,
				position: tool.position || {
					x: 0,
					y: 0
				},
				data: {
					value: toolType,
					config: tool.settings
				}
			});
		});
		edges.push(...node.tools.map((tool, index) => {
			const toolType = DAFFY_TO_FLOW_TOOLS[tool.name];
			return {
				id: `tool_node_${toolType}_${index}`,
				source: node.id,
				target: tool.id || `tool_node_${toolType}_${node.id}`,
				sourceHandle: "source-agents-tools"
			};
		}));
	});
	edges.push(...graph.edges.filter((e) => !e.source.startsWith("tool_node") && !Object.keys(e.condition || {}).includes("tool_node")).map((e, index) => ({
		id: e.id || `${e.source}_${e.target}_${index}`,
		source: e.source,
		target: e.target || Object.keys(e.condition || {})[0] || "tool_node",
		sourceHandle: e.source_handle,
		targetHandle: e.target_handle
	})));
	return {
		nodes,
		edges
	};
}

//#endregion
//#region src/helpers.ts
function findToolSource(source, edges) {
	for (const [index, edge] of edges.entries()) {
		if (source === edge.target) return [index, edge.source];
		if (source === edge.source) return [index, edge.target];
	}
	return [];
}

//#endregion
//#region src/toDaffyDuck.ts
function toDaffyDuck(nodes, edges) {
	const daffyNodes = [];
	const daffyEdges = [];
	const tools = {};
	for (const node of nodes) {
		if (node.type === "start" || node.type === "end") continue;
		const nodeType = FLOW_TO_DAFFY_NODES[node.type];
		if (nodeType === "ToolNode") {
			const [index, toolSource] = findToolSource(node.id, edges);
			const toolType = node.data.value;
			if (!toolSource || index === void 0 || !(toolType in FLOW_TO_DAFFY_TOOLS)) continue;
			const daffyToolName = FLOW_TO_DAFFY_TOOLS[toolType];
			if (!Object.keys(tools).includes(toolSource)) tools[toolSource] = [];
			tools[toolSource].push({
				id: node.id,
				position: node.position,
				name: daffyToolName,
				settings: node.data.config
			});
			edges.splice(index, 1);
			continue;
		}
		if (nodeType === "AgentNode") {
			const { parallel_tool_calling = true,...settings } = node.data ?? {};
			daffyNodes.push({
				id: node.id,
				node: FLOW_TO_DAFFY_NODES.agent,
				position: node.position,
				settings,
				parallel_tool_calling,
				tools: []
			});
			continue;
		}
		daffyNodes.push({
			id: node.id,
			node: nodeType,
			settings: node.data,
			position: node.position
		});
	}
	daffyEdges.push(...edges.map((e) => ({
		id: e.id,
		source: e.source,
		target: e.target,
		source_handle: e.sourceHandle || void 0,
		target_handle: e.targetHandle || void 0
	})));
	if (Object.keys(tools).length > 0) {
		const toolId = "tool_node";
		const toolNode = {
			id: toolId,
			node: FLOW_TO_DAFFY_NODES.tool,
			parallel_tool_calling: true,
			position: {
				x: 0,
				y: 0
			},
			settings: {},
			tools: []
		};
		for (const source in tools) {
			toolNode.tools.push(...tools[source]);
			for (const node of daffyNodes) if (node.id === source && node.node === FLOW_TO_DAFFY_NODES.agent) {
				node.tools.push(...tools[source]);
				break;
			}
			daffyNodes.push(toolNode);
			daffyEdges.push({
				id: `start_${toolId}_${source}`,
				source,
				source_handle: "tools",
				condition: { [toolId]: "tools_condition" }
			}, {
				id: `end_${toolId}_${source}`,
				source: toolId,
				target: source,
				target_handle: "tools"
			});
		}
	}
	return {
		nodes: daffyNodes,
		edges: daffyEdges
	};
}

//#endregion
export { DAFFY_TO_FLOW_NODES, DAFFY_TO_FLOW_TOOLS, FLOW_TO_DAFFY_NODES, FLOW_TO_DAFFY_TOOLS, fromDaffyDuck, toDaffyDuck };
//# sourceMappingURL=index.js.map