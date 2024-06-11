import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ground, sky } from '../css/styles/background.css';

export const Background = ({ children }: { children: React.ReactNode }) => {
  const skyRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const [isDay, setIsDay] = useState(
    new Date().getHours() > 6 && new Date().getHours() < 18
  )

  const preloadImages = useCallback((imageArray: string[]) => {
    imageArray.forEach((url) => {
      const img = new Image();
      img.src = url;
      console.log('preloading', img);
    });
  }, []);

  const dayImages = useMemo(
    () => [
      '/src/assets/background/day-sky.png',
      '/src/assets/background/day-ground.png',
    ],
    []
  );

  const nightImages = useMemo(
    () => [
      '/src/assets/background/night-sky.png',
      '/src/assets/background/night-ground.png',
    ],
    []
  );

  useEffect(() => {
    preloadImages(dayImages);
    preloadImages(nightImages);
  }, [dayImages, nightImages, preloadImages]);

  useEffect(() => {
    if (skyRef.current && groundRef.current) {
      skyRef.current.style.backgroundImage = `url(${
        isDay ? dayImages[0] : nightImages[0]
      })`;
      groundRef.current.style.backgroundImage = `url(${
        isDay ? dayImages[1] : nightImages[1]
      })`;
    }
  }, [dayImages, isDay, nightImages]);

  const setDayByTime = useCallback(() => {
    const date = new Date();
    const hours = date.getHours();
    setIsDay(hours > 6 && hours < 18);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDayByTime();
    }, 10000);
    return () => clearInterval(interval);
  }, [setDayByTime]);

  useEffect(() => {
    if (isDay) {
      document.body.style.backgroundColor = 'white';
    } else {
      document.body.style.backgroundColor = 'black';
    }
  }, [isDay]);

  return (
    <div>
      <button onClick={() => setIsDay((prev) => !prev)} style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 9999
      }}>Toggle</button>
      <div ref={skyRef} className={sky} />
      <div ref={groundRef} className={ground} />
      {children}
    </div>
  );
};
