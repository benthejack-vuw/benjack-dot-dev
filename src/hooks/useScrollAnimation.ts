import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import { smootherstep } from "three/src/math/MathUtils";
import gsap from 'gsap';

const useScrollAnimation = (
    start:number,
    end: number,
    animTimePerScroll = 0.5,
    animationRef?: MutableRefObject<gsap.core.Animation | undefined>
) => {
    const [scrollY, setScrollY] = useState(0);
    const [scrollAnimation, setScrollAnimation] = useState(0);
    const internalAnimationRef = useRef<gsap.core.Animation>();
    const scrollValue = useRef({ animValue: 0 });

    useEffect(() => {
        const listener = () => {
            setScrollY(window.scrollY);

            const ref = animationRef ?? internalAnimationRef;

            if(ref.current) ref.current.kill();

            const animValue = smootherstep(window.scrollY, start, end);

            if(animValue === scrollValue.current.animValue) return;

            ref.current = gsap.to(scrollValue.current, {
                animValue,
                duration: animTimePerScroll,
                onUpdate: () => setScrollAnimation(scrollValue.current.animValue),
            });
        };
        
        window.addEventListener('scroll', listener);
        return () => window.removeEventListener('scroll', listener);
    }, []);

    const setScrollAnimationValue = useCallback((value: number) => {
        scrollValue.current.animValue = value;
        setScrollAnimation(value);
    }, []);

    return {
        scrollY,
        scrollAnimation,
        setScrollAnimationValue,
    }

}

export default useScrollAnimation;