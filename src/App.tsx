import React from "react";
import { ConcelloEmailProvider } from "./Context/ConcelloEmailContext";
import Navigation from "./Components/Navigation";
import "./estilo.css";

const App = () => {
  return (
    <ConcelloEmailProvider>
      <Navigation />
    </ConcelloEmailProvider>
  );
};

export default App;
