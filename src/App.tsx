import React from 'react';

import Btj from "./Btj";
import GLSphere from "./GLSphere";

function App() {
  return (
    <>
      <header></header>
      <main className="absolute w-full h-full p-2 bg-gray-100">
        <GLSphere/>
        <Btj/>
      </main>
    </>
  );
}

export default App;
