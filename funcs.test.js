import { parseUseEffects, isMatched, functionToArgs } from "./funcs";

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

test("checks 'func(arg1, arg2)' parses", () => {
  expect(functionToArgs("func(arg1, arg2)")).toMatchObject(["arg1", "arg2"]);
});

test("checks 'func(arg1, [arg2])' parses", () => {
  expect(functionToArgs("func(arg1, [arg2])")).toMatchObject([
    "arg1",
    "[arg2]",
  ]);
});

test("checks 'func(arg1, [arg2, arg3])' parses", () => {
  expect(functionToArgs("func(arg1, [arg2, arg3])")).toMatchObject([
    "arg1",
    "[arg2, arg3]",
  ]);
});

test("checks 'func(arg1, [arg2,], arg3, {arg4: 4,})' parses", () => {
  expect(
    functionToArgs("func(arg1, [arg2,], arg3, {arg4: 4,})")
  ).toMatchObject(["arg1", "[arg2,]", "arg3", "{arg4: 4,}"]);
});

test("checks 'func(arg1, [)' does not parse", () => {
  expect(() => isMatched(functionToArgs("func(arg1, [)"))).toThrow();
});
