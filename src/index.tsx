import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { StrictMode } from "react";
import App from "./App";

import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
