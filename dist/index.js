//#region src/constants.ts
const DAFFY_TO_FLOW_NODES = {
	StartNode: "start",
	EndNode: "end",
	AgentNode: "agent",
	RagNode: "rag",
	ToolNode: "tool",
	PostgresIntrospectionNode: "postgres_introspection",
	MSSQLIntrospectionNode: "mssql_introspection"
};
const FLOW_TO_DAFFY_NODES = {
	start: "StartNode",
	end: "EndNode",
	agent: "AgentNode",
	rag: "RagNode",
	tool: "ToolNode",
	postgres_introspection: "PostgresIntrospectionNode",
	mssql_introspection: "MSSQLIntrospectionNode"
};
const FLOW_TO_DAFFY_TOOLS = {
	mcp: "MCPTool",
	excel: "ExcelGeneratorTool",
	postgres: "PostgressTool"
};
const DAFFY_TO_FLOW_TOOLS = {
	MCPTool: "mcp",
	ExcelGeneratorTool: "excel",
	PostgressTool: "postgres"
};

//#endregion
//#region src/fromDaffyDuck.ts
function fromDaffyDuck(graph) {
	const nodes = [{
		id: "START",
		type: DAFFY_TO_FLOW_NODES.StartNode,
		position: {
			x: -500,
			y: 0
		}
	}, {
		id: "END",
		type: DAFFY_TO_FLOW_NODES.EndNode,
		position: {
			x: 500,
			y: 0
		}
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
				id: tool.id,
				type: DAFFY_TO_FLOW_NODES.ToolNode,
				position: {
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
			return {
				id: `tool_node_${DAFFY_TO_FLOW_TOOLS[tool.name]}_${index}`,
				source: node.id,
				target: tool.id,
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
		if (node.type === DAFFY_TO_FLOW_NODES.StartNode || node.type === DAFFY_TO_FLOW_NODES.EndNode) continue;
		if (node.type === DAFFY_TO_FLOW_NODES.ToolNode) {
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
		}
		if (node.type === DAFFY_TO_FLOW_NODES.AgentNode) {
			const { parallel_tool_calling = true,...settings } = node.data ?? {};
			daffyNodes.push({
				id: node.id,
				node: FLOW_TO_DAFFY_NODES.agent,
				position: node.position,
				settings,
				parallel_tool_calling,
				tools: []
			});
		}
		if (node.type === DAFFY_TO_FLOW_NODES.RagNode) daffyNodes.push({
			id: node.id,
			node: FLOW_TO_DAFFY_NODES.rag,
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