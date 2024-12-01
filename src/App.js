import "./wdyr";

import React, { useState } from "react";
import UnOptimizedProductList from "./components/productList";
import OptimizedProductList from "./components/optimizedProductList";

import "./App.css";

function App() {
  const [showOptimized, setShowOptimized] = useState(false);

  return (
    <div className="container mx-auto px-4">
      <div className="my-4">
        <button
          onClick={() => setShowOptimized(!showOptimized)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Switch to {showOptimized ? "UnOptimized" : "Optimized"} Version
        </button>
      </div>

      {showOptimized ? <OptimizedProductList /> : <UnOptimizedProductList />}
    </div>
  );
}

export default App;
