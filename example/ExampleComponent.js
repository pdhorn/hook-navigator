// pretend this is a react component

const [a, setA] = useState("");
const [b, setB] = useState("");
const [c, setC] = useState("");

const handleSetAEvent = (e) => {
  setA(e.target.value);
};

const handleSetBEvent = (e) => {
  setB(e.target.value);
};

useEffect(() => {
  setB(a + a);
}, [a]);

useEffect(() => {
  setC(something);
}, [a, b]);

// render 3 components
// each component's value is tied to a, b, or c
// components for a and b have event handlers
