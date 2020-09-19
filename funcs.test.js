import { parseUseEffects, isMatched } from "./funcs";

const someCode = `const handleSetBEvent = (e) => {
  setB(e.target.value);
};

useEffect(() => {
  setB(a + a);
}, [a]);

useEffect(() => {
  setC(something);
}, [a, b]);

// render 3 components`;

test("parsing several lines for useEffect", () => {
  expect(
    parseUseEffects(someCode).map((x) => x.replace(/ /g, ""))
  ).toMatchObject([
    `useEffect(()=>{setB(a+a);},[a])`,
    `useEffect(()=>{setC(something);},[a,b])`,
  ]);
});

test("parsing 'useEffect(...);' simplest case", () => {
  expect(parseUseEffects("useEffect(()=>(),[]);")).toMatchObject([
    "useEffect(()=>(),[])",
  ]);
});

test("parsing 'useEffect(...)' simplest case without ;", () => {
  expect(parseUseEffects("useEffect(()=>(),[])")).toMatchObject([
    "useEffect(()=>(),[])",
  ]);
});

test("parsing 'useEffect(...);useEffect(...);' 2x simplest case", () => {
  expect(
    parseUseEffects("useEffect(()=>(),[]);useEffect(()=>(),[]);")
  ).toMatchObject(["useEffect(()=>(),[])", "useEffect(()=>(),[])"]);
});

test("checks '[hi(there)]' is parenteses-matched", () => {
  expect(isMatched("[hi(there)]")).toBeTruthy();
});

test("checks '[hi(there]' is not parenteses-matched", () => {
  expect(isMatched("[hi(there]")).toBeFalsy();
});

test("checks '[hi(there])' is not parenteses-matched", () => {
  expect(isMatched("[hi(there])")).toBeFalsy();
});

test("checks 'hi(there]' throws error", () => {
  expect(() => isMatched("hi(there]")).toThrow();
});
