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
