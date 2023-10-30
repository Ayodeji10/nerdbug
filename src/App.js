import "./styles/styles.scss";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./scrollToTop";
import Home from "./screens/home";
import SingleCity from "./screens/singleCity";

function App() {
  return (
    <Router>
      {/* scroll page to top on load  */}
      <ScrollToTop />
      <Routes>
        {/* routes  */}
        <Route path="/" element={<Home />} />
        <Route path="/:city/:lat/:lon" element={<SingleCity />} />
      </Routes>
    </Router>
  );
}

export default App;
