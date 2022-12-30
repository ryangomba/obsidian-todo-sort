import { SortOrder, sortTodos } from "./sort";

test("sort incomplete", () => {
  const input = `
- [ ] a
- [ ] b
- [ ] c
`;
  const expectedOutput = `
- [ ] a
- [ ] b
- [ ] c
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
  });
});

test("sort mixed, already sorted", () => {
  const input = `
- [x] a
- [ ] b
- [ ] c
`;
  const expectedOutput = `
- [x] a
- [ ] b
- [ ] c
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
  });
});

test("sort mixed, not sorted", () => {
  const input = `
- [ ] a
- [x] b
- [ ] c
`;
  const expectedOutput = `
- [x] b
- [ ] a
- [ ] c
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 2,
    2: 1,
    3: 3,
    4: 4,
  });
});

test("sort todos with different inner chars",  () => {
  const input = `
- [ ] a
- [-] b
- [!] c
`;
  const expectedOutput = `
- [-] b
- [!] c
- [ ] a
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 3,
    2: 1,
    3: 2,
    4: 4,
  });
});

test("sort mixed, not sorted, completed at bottom", () => {
  const input = `
- [ ] a
- [x] b
- [ ] c
`;
  const expectedOutput = `
- [ ] a
- [ ] c
- [x] b
`;
  const result = sortTodos(input, SortOrder.COMPLETED_BOTTOM);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 1,
    2: 3,
    3: 2,
    4: 4,
  });
});

test("sort double list, not sorted", () => {
  const input = `
- [ ] a
- [ ] b
- [x] c
Hi
\t- [ ] d
\t- [x] e
\t- [ ] f
`;
  const expectedOutput = `
- [x] c
- [ ] a
- [ ] b
Hi
\t- [x] e
\t- [ ] d
\t- [ ] f
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 2,
    2: 3,
    3: 1,
    4: 4,
    5: 6,
    6: 5,
    7: 7,
    8: 8,
  });
});

test("sort very nested (tabs)", () => {
  const input = `
- Today
\t- [ ] a
\t- [ ] b
\t\t- This is a child note
\t- [x] c
\t\t- And so is this
- Tomorrow
\t- [ ] d
\t\t- [ ] d1
\t\t- [x] d2
\t- [x] e
\t- [ ] f
`;
  const expectedOutput = `
- Today
\t- [x] c
\t\t- And so is this
\t- [ ] a
\t- [ ] b
\t\t- This is a child note
- Tomorrow
\t- [x] e
\t- [ ] d
\t\t- [x] d2
\t\t- [ ] d1
\t- [ ] f
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 1,
    2: 4,
    3: 5,
    4: 6,
    5: 2,
    6: 3,
    7: 7,
    8: 9,
    9: 11,
    10: 10,
    11: 8,
    12: 12,
    13: 13,
  });
});

test("sort very nested (variable spaces)", () => {
  const input = `
- Today
	- [ ] a
	- [ ] b
	 - This is a child note
	- [x] c
		- And so is this
- Tomorrow
	- [ ] d
						- [ ] d1
						- [x] d2
	- [x] e
	- [ ] f
`;
  const expectedOutput = `
- Today
	- [x] c
		- And so is this
	- [ ] a
	- [ ] b
	 - This is a child note
- Tomorrow
	- [x] e
	- [ ] d
						- [x] d2
						- [ ] d1
	- [ ] f
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(expectedOutput);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 1,
    2: 4,
    3: 5,
    4: 6,
    5: 2,
    6: 3,
    7: 7,
    8: 9,
    9: 11,
    10: 10,
    11: 8,
    12: 12,
    13: 13,
  });
});

test("sort non-todos that look like todos", () => {
  const input = `
Not a todo: - [ ] a
-- [ ] b
or this - [x] c
`;
  const result = sortTodos(input, SortOrder.COMPLETED_TOP);
  expect(result.output).toBe(input);
  expect(result.lineMap).toStrictEqual({
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
  });
});