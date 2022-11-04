import { lineInfosFromTree, treeFromLineInfos } from "./tree";

test("simple tree", () => {
	const lineInfos = [
		{ indentation: 0, value: "a" },
		{ indentation: 0, value: "b" },
		{ indentation: 0, value: "c" },
	];
	expect(treeFromLineInfos(lineInfos)).toEqual({
		lineInfo: null,
		children: [
			{
				lineInfo: { indentation: 0, value: "a" },
				children: [],
			},
			{
				lineInfo: { indentation: 0, value: "b" },
				children: [],
			},
			{
				lineInfo: { indentation: 0, value: "c" },
				children: [],
			},
		],
	});
	expect(lineInfosFromTree(treeFromLineInfos(lineInfos))).toEqual(lineInfos);
});

test("nested tree", () => {
	const lineInfos = [
		{ indentation: 0, value: "a" },
		{ indentation: 1, value: "b" },
		{ indentation: 2, value: "c" },
		{ indentation: 1, value: "d" },
		{ indentation: 0, value: "e" },
		{ indentation: 1, value: "f" },
		{ indentation: 2, value: "g" },
		{ indentation: 1, value: "h" },
		{ indentation: 0, value: "i" },
	];
	expect(treeFromLineInfos(lineInfos)).toEqual({
		lineInfo: null,
		children: [
			{
				children: [
					{
						children: [
							{
								children: [],
								lineInfo: { indentation: 2, value: "c" },
							},
						],
						lineInfo: { indentation: 1, value: "b" },
					},
					{
						children: [],
						lineInfo: { indentation: 1, value: "d" },
					},
				],
				lineInfo: { indentation: 0, value: "a" },
			},
			{
				children: [
					{
						children: [
							{
								children: [],
								lineInfo: { indentation: 2, value: "g" },
							},
						],
						lineInfo: { indentation: 1, value: "f" },
					},
					{
						children: [],
						lineInfo: { indentation: 1, value: "h" },
					},
				],
				lineInfo: { indentation: 0, value: "e" },
			},
			{
				children: [],
				lineInfo: { indentation: 0, value: "i" },
			},
		],
	});
	expect(lineInfosFromTree(treeFromLineInfos(lineInfos))).toEqual(lineInfos);
});
