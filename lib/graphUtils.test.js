import { getPaths } from "./graphUtils";

test("checks getPaths gets simple case", () => {
  const tested = getPaths("a", "b", [
    { source: "a", target: "b" },
    { source: "a", target: "c" },
    { source: "b", target: "c" },
  ]);
  expect(tested).toEqual(expect.arrayContaining([["a", "b"]]));
  expect(tested.length).toEqual(1);
});

const moreComplexGraph = [
  { source: "a", target: "b" },
  { source: "a", target: "c" },
  { source: "a", target: "e" },
  { source: "b", target: "d" },
  { source: "b", target: "e" },
  { source: "c", target: "e" },
  { source: "d", target: "c" },
];

const moreComplexPathsAToE = [
  ["a", "b", "e"],
  ["a", "e"],
  ["a", "c", "e"],
  ["a", "b", "d", "c", "e"],
];
const moreComplexPathsAToC = [
  ["a", "c"],
  ["a", "b", "d", "c"],
];

const secondComplexGraph = [
  { source: "a", target: "c" },
  { source: "b", target: "c" },
  { source: "c", target: "d" },
  { source: "c", target: "e" },
  { source: "c", target: "f" },
  { source: "d", target: "e" },
  { source: "d", target: "f" },
];

const secondComplexPathsAToB = [];
const secondComplexPathsAToF = [
  ["a", "c", "f"],
  ["a", "c", "d", "f"],
];
const secondComplexPathsBToE = [
  ["b", "c", "e"],
  ["b", "c", "d", "e"],
];

test("checks getPaths gets more complex case a to c", () => {
  const tested = getPaths("a", "c", moreComplexGraph);
  expect(tested).toEqual(expect.arrayContaining(moreComplexPathsAToC));
  expect(tested.length).toEqual(moreComplexPathsAToC.length);
});

test("checks getPaths gets more complex case a to e", () => {
  const tested = getPaths("a", "e", moreComplexGraph);
  expect(tested).toEqual(expect.arrayContaining(moreComplexPathsAToE));
  expect(tested.length).toEqual(moreComplexPathsAToE.length);
});

test("checks getPaths gets second complex case a to b", () => {
  const tested = getPaths("a", "b", secondComplexGraph);
  expect(tested).toEqual(expect.arrayContaining(secondComplexPathsAToB));
  expect(tested.length).toEqual(secondComplexPathsAToB.length);
});

test("checks getPaths gets second complex case a to f", () => {
  const tested = getPaths("a", "f", secondComplexGraph);
  expect(tested).toEqual(expect.arrayContaining(secondComplexPathsAToF));
  expect(tested.length).toEqual(secondComplexPathsAToF.length);
});

test("checks getPaths gets second complex case b to e", () => {
  const tested = getPaths("b", "e", secondComplexGraph);
  expect(tested).toEqual(expect.arrayContaining(secondComplexPathsBToE));
  expect(tested.length).toEqual(secondComplexPathsBToE.length);
});
