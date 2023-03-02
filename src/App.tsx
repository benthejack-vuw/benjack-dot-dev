import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Btj from "./Btj";
import GLSphere from "./GLSphere";

function App() {
  const [animation, setAnimation] = useState(0);
  const gsapAnim = useRef<gsap.core.Animation>();

  useEffect(() => {
    const anim = {
      animateIn: 0,
    };
    
    if(gsapAnim.current) gsapAnim.current.kill();

    gsapAnim.current = gsap.to(anim, {
      animateIn: 1,
      duration: 10,
      onUpdate: () => setAnimation(anim.animateIn),
    });
    
    const handleScroll = () => {
      if(gsapAnim.current) gsapAnim.current.kill();

      gsap.to(anim, {
        animateIn: 1.0 - window.scrollY / window.innerHeight,
        duration: 0.6,
        onUpdate: () => setAnimation(anim.animateIn),
      });
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header></header>
      <main className="absolute w-full min-h-full p-0 bg-[#BBBBBB] overflow-scroll z-0">
        <GLSphere animateIn={animation}/>
        <Btj className="p-4 md:p-0 w-full h-screen flex items-start md:items-center md:pl-40"/>
        <div className='h-[2000px] w-full text-white'>test test</div>
      </main>
    </>
  );
}

export default App;
