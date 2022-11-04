import { lineInfosFromTree, LineNode, treeFromLineInfos } from "./tree";

type LineInfo = {
	originalIndex: number;
	value: string;
	todo: boolean;
	completed: boolean;
	indentation: number;
};

type SortResult = {
	output: string;
	lineMap: { [key: number]: number };
};

export function sortTodos(plainText: string): SortResult {
	const lines = plainText.split("\n");
	const lineInfos = lines.map((value, originalIndex) => {
		const todo = value.indexOf("- [") >= 0;
		const completed = value.indexOf("- [x]") >= 0;
		const indentation = value.length - value.trimStart().length;
		return { originalIndex, value, todo, completed, indentation };
	});
	const sortedLineInfos = sortLineInfos(lineInfos);
	const lineMap: { [key: number]: number } = {};
	for (let i = 0; i < sortedLineInfos.length; i++) {
		const lineInfo = sortedLineInfos[i];
		lineMap[lineInfo.originalIndex] = i;
	}
	const output = sortedLineInfos.map((lineInfo) => lineInfo.value).join("\n");
	return { output, lineMap };
}

export function sortLineInfos(lineInfos: LineInfo[]): LineInfo[] {
	const tree = treeFromLineInfos(lineInfos);
	sortChildTodos(tree);
	return lineInfosFromTree(tree);
}

function sortChildTodos(node: LineNode<LineInfo>) {
	let currentGroup = 0;
	const groupMap: { [key: number]: number } = {};
	for (let i in node.children) {
		const child = node.children[i];
		if (!child.lineInfo?.todo) {
			currentGroup += 1;
		} else {
			groupMap[child.lineInfo.originalIndex] = currentGroup;
		}
	}
	node.children.sort((a, b) => {
		const aGroup = groupMap[a.lineInfo!.originalIndex];
		const bGroup = groupMap[b.lineInfo!.originalIndex];
		if (aGroup !== bGroup) {
			return aGroup - bGroup;
		}
		if (a.lineInfo?.completed && !b.lineInfo?.completed) return -1;
		if (!a.lineInfo?.completed && b.lineInfo?.completed) return 1;
		return 0;
	});
	for (let child of node.children) {
		sortChildTodos(child);
	}
}
