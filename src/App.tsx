import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Btj from "./Btj";
import GLCanvas from "./GLCanvas";

import useScrollAnimation from "./hooks/useScrollAnimation";

function App() {

  return (
    <>
      <header></header>
      <main className="absolute w-full min-h-full p-0 bg-[#BBBBBB] overflow-scroll z-0">
        <GLCanvas />
        <Btj className="p-4 md:p-0 w-full h-screen flex items-start md:items-center md:pl-40"/>
        <div className='h-[2000px] w-full text-white'>test test</div>
      </main>
    </>
  );
}

export default App;
