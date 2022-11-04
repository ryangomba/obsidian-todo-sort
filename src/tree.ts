interface LineNodeInfo {
	indentation: number;
}

export interface LineNode<T extends LineNodeInfo> {
	lineInfo: T | null;
	children: LineNode<T>[];
}

function findParentForNode<T extends LineNodeInfo>(
	ancestor: LineNode<T>,
	node: LineNode<T>
): LineNode<T> | null {
	if (ancestor.children.indexOf(node) >= 0) {
		return ancestor;
	}
	for (let i = 0; i < ancestor.children.length; i++) {
		const child = ancestor.children[i];
		const parent = findParentForNode(child, node);
		if (parent) {
			return parent;
		}
	}
	return null;
}

export function treeFromLineInfos<T extends LineNodeInfo>(
	lineInfos: T[]
): LineNode<T> {
	const root: LineNode<T> = { lineInfo: null, children: [] };
	let currentParent: LineNode<T> = root;
	function currentIndentation(): number {
		return currentParent.lineInfo
			? currentParent.lineInfo.indentation + 1
			: 0;
	}
	for (let i = 0; i < lineInfos.length; i++) {
		const lineInfo = lineInfos[i];
		const lineNode: LineNode<T> = { lineInfo, children: [] };
		if (lineInfo.indentation > currentIndentation()) {
			// This line is a child of the previous line
			currentParent.children.push(lineNode);
		} else if (lineInfo.indentation < currentIndentation()) {
			// This line is a sibling of the previous line's parent
			// Find the parent of the previous line
			while (lineInfo.indentation < currentIndentation()) {
				const parent = findParentForNode(root, currentParent);
				if (parent) {
					currentParent = parent;
				} else {
					throw new Error("Could not fund parent for node");
				}
			}
			currentParent.children.push(lineNode);
		} else {
			// This line is a sibling of the previous line
			// console.log("sibling prev line");
			currentParent.children.push(lineNode);
		}
		currentParent = lineNode;
	}
	return root;
}

export function lineInfosFromTree<T extends LineNodeInfo>(
	root: LineNode<T>
): T[] {
	const lineInfos: T[] = [];
	function walk(node: LineNode<T>) {
		if (node.lineInfo) {
			lineInfos.push(node.lineInfo);
		}
		for (let i = 0; i < node.children.length; i++) {
			walk(node.children[i]);
		}
	}
	walk(root);
	return lineInfos;
}
