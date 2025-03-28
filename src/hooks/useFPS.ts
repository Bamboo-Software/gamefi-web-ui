import { useState, useEffect } from 'react';

const useFPS = () => {
  const [fps, setFps] = useState(0);
  let frameCount = 0; 
  let startTime = Date.now(); 

  const updateFPS = () => {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) / 1000; 

    if (elapsed >= 1) {
      setFps(Math.round(frameCount / elapsed));
      frameCount = 0;
      startTime = currentTime;
    }

    frameCount++;
    requestAnimationFrame(updateFPS);
  };

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return fps; 
};

export default useFPS;