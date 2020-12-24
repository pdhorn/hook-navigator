import {
  parseUseEffects,
  isMatched,
  functionToArgs,
  getVarsFromSecondArgOfFunction,
  identifyStateVariablesAndSetters,
} from "./funcs";

const fs = require("fs");
const exampleComponent = fs.readFileSync(
  "./example/ExampleComponent.js",
  "utf8"
);

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

test("checks getVarsFromSecondArgOfFunction throws error if not all args are strings", () => {
  expect(() => getVarsFromSecondArgOfFunction([1, "b"])).toThrow();
});

test("checks getVarsFromSecondArgOfFunction throws error if second arg is not an array", () => {
  expect(() => getVarsFromSecondArgOfFunction(["a", "b"])).toThrow();
});

test("checks getVarsFromSecondArgOfFunction throws error if more than 2 args passed", () => {
  expect(() => getVarsFromSecondArgOfFunction(["a", "b", "c"])).toThrow();
});

test("checks getVarsFromSecondArgOfFunction gets one arg", () => {
  expect(getVarsFromSecondArgOfFunction(["a", "[blarg]"])).toMatchObject([
    "blarg",
  ]);
});

test("checks getVarsFromSecondArgOfFunction gets two args", () => {
  expect(
    getVarsFromSecondArgOfFunction(["a", "[blarg, deblarg]"])
  ).toMatchObject(["blarg", "deblarg"]);
});

test("checks getVarsFromSecondArgOfFunction gets two args, with extra comma", () => {
  expect(
    getVarsFromSecondArgOfFunction(["a", "[blarg, deblarg,]"])
  ).toMatchObject(["blarg", "deblarg"]);
});

test("checks identifyStateVariablesAndSetters gets one liner", () => {
  expect(
    identifyStateVariablesAndSetters("const [a, setA] = useState();")
  ).toMatchObject([{ variable: "a", setter: "setA" }]);
});

test("checks identifyStateVariablesAndSetters gets ExampleComponent", () => {
  expect(identifyStateVariablesAndSetters(exampleComponent)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        variable: "a",
        setter: "setA",
      }),
      expect.objectContaining({
        variable: "b",
        setter: "setB",
      }),
      expect.objectContaining({
        variable: "c",
        setter: "setC",
      }),
    ])
  );
});
