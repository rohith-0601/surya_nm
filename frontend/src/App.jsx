import { BrowserRouter, Routes, Route } from "react-router-dom";
import Q1 from "./pages/Q1";
import Q2 from "./pages/Q2";
import Q3 from "./pages/Q3";
import Q4 from "./pages/Q4";
import Q5 from "./pages/Q5";
import Q6 from "./pages/Q6";
import Q7 from "./pages/Q7";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Q1 />} />
        <Route path="/q2" element={<Q2 />} />
        <Route path="/q3" element={<Q3 />} />
        <Route path="/q4" element={<Q4 />} />
        <Route path="/q5" element={<Q5 />} />
        <Route path="/q6" element={<Q6 />} />
        <Route path="/q7" element={<Q7 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
