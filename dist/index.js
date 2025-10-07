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
	for (const daffyNode of graph.nodes) {
		const toolConfig = "tools" in daffyNode && daffyNode.tools.length > 0 ? daffyNode.tools[0] : void 0;
		nodes.push({
			id: daffyNode.id,
			type: DAFFY_TO_FLOW_NODES[daffyNode.node],
			position: daffyNode.position,
			data: {
				config: toolConfig && daffyNode.node === "ToolNode" ? toolConfig.settings : daffyNode.settings,
				..."parallel_tool_calling" in daffyNode ? { parallel_tool_calling: daffyNode.parallel_tool_calling } : {},
				...toolConfig && daffyNode.node === "ToolNode" ? { value: DAFFY_TO_FLOW_TOOLS[toolConfig.name] } : {}
			}
		});
	}
	edges.push(...graph.edges.map((e, index) => ({
		id: e.id || `${e.source}_${e.target}_${index}`,
		source: e.source,
		target: e.target || "",
		sourceHandle: e.source_handle,
		targetHandle: e.target_handle
	})));
	return {
		nodes,
		edges
	};
}

//#endregion
//#region src/toDaffyDuck.ts
function findToolTarget(source, edges) {
	for (const [index, edge] of edges.entries()) if (source === edge.source) return [index, edge.target];
	return [];
}
function toDaffyDuck(nodes, edges) {
	const daffyNodes = [];
	const daffyEdges = [];
	const tools = {};
	for (const node of nodes) {
		if (node.type === DAFFY_TO_FLOW_NODES.StartNode || node.type === DAFFY_TO_FLOW_NODES.EndNode) continue;
		if (node.type === DAFFY_TO_FLOW_NODES.ToolNode) {
			const [index, targetTool] = findToolTarget(node.id, edges);
			const toolType = node.data.value;
			if (!targetTool || !index || !(toolType in FLOW_TO_DAFFY_TOOLS)) continue;
			tools[targetTool] = {
				name: FLOW_TO_DAFFY_TOOLS[toolType],
				settings: node.data.config
			};
			edges.splice(index, 1);
		}
		if (node.type === DAFFY_TO_FLOW_NODES.AgentNode) daffyNodes.push({
			id: node.id,
			node: FLOW_TO_DAFFY_NODES.agent,
			settings: node.data.config,
			position: node.position,
			parallel_tool_calling: node.data.parallel_tool_calling ?? true,
			tools: []
		});
		if (node.type === DAFFY_TO_FLOW_NODES.RagNode) daffyNodes.push({
			id: node.id,
			node: FLOW_TO_DAFFY_NODES.rag,
			settings: node.data.config,
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
		const toolNode = {
			id: "tool_node",
			node: FLOW_TO_DAFFY_NODES.tool,
			parallel_tool_calling: true,
			position: {
				x: 0,
				y: 0
			},
			settings: {},
			tools: []
		};
		for (const target in tools) {
			toolNode.tools.push(tools[target]);
			for (const node of daffyNodes) if (node.id === target && node.node === FLOW_TO_DAFFY_NODES.agent) {
				node.tools.push(tools[target]);
				break;
			}
			daffyNodes.push(toolNode);
			daffyEdges.push({
				id: `${toolNode.id}_${target}`,
				source: target,
				condition: { tool_node: "tools_condition" }
			}, {
				id: `end_${toolNode.id}`,
				source: "tool_node",
				target
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