import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ground, meteor, meteorContainer, meteorTail, sky, stars } from '../css/styles/background.css';

export const Background = ({ children }: { children: React.ReactNode }) => {
  const [isDay, setIsDay] = useState(
    new Date().getHours() > 6 && new Date().getHours() < 18
  );
  const skyRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const meteorContainerRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  const preloadImages = useCallback((imageArray: string[]) => {
    imageArray.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  const groundImage = useMemo(() => ['/src/assets/ground.png'], []);

  useEffect(() => {
    preloadImages(groundImage);
  }, [groundImage, preloadImages]);

  useEffect(() => {
    console.log('render');
  });

  useEffect(() => {
    if (groundRef.current) {
      groundRef.current.style.backgroundImage = `url(${groundImage[0]})`;
    }
  }, [groundImage]);

  const drawStars = useCallback(() => {
    let startCount = 600;
    const stars = starsRef.current;
    const maxPosition = Math.max(window.innerWidth, window.innerHeight);
    if (!stars) {
      return;
    }
    while (startCount > 0) {
      const star = document.createElement('div');
      const startSize = Math.random() * 2;
      const starLeft = Math.random() * maxPosition;
      const starTop = Math.random() * maxPosition;
      star.style.position = 'absolute';
      star.style.width = `${startSize}px`;
      star.style.height = `${startSize}px`;
      star.style.borderRadius = '50%';
      star.style.backgroundColor = 'white';
      star.style.boxShadow = `0 0 10px ${startSize * (1 - starTop / maxPosition)}px #fff2cc`;
      star.style.opacity = `${1 - (starTop / maxPosition) * 2}`;
      star.style.left = `${starLeft}px`;
      star.style.top = `${starTop}px`;
      stars.appendChild(star);
      startCount--;
    }
  }, []);

  const removeStars = useCallback(() => {
    const stars = starsRef.current;
    if (!stars) {
      return;
    }
    while (stars.firstChild) {
      stars.removeChild(stars.firstChild);
    }
  }, []);

  const setSky = useCallback(() => {
    const sky = skyRef.current;
    if (!sky) {
      return;
    }
    const month = new Date().getMonth();
    const day = new Date().getDate();
    const hour = new Date().getHours();
    const skyColorScheme = {
      sunrise: {
        bottom: [255, 106, 0],
        top: [39, 120, 235],
        start: 50,
        end: 30,
      },
      day: {
        bottom: [187, 217, 245],
        top: [76, 140, 238],
        start: 40,
        end: 0,
      },
      sunset: {
        bottom: [255, 69, 0],
        top: [255, 165, 0],
      },
      night: {
        bottom: [20, 0, 42],
        top: [0, 0, 0],
      },
    }
    const generateRGB = (scheme: number[]) => {
      return `rgb(${scheme[0]}, ${scheme[1]}, ${scheme[2]})`;
    }
    const color = 'rgb(21, 0, 42)'
    const colorBottom = generateRGB(skyColorScheme.night.bottom);
    const colorTop = generateRGB(skyColorScheme.night.top);
    const background = `linear-gradient(180deg, ${colorTop} 30%, ${colorBottom} 100%)`;
    sky.style.background = background;
  }, []);

  const setGround = useCallback(() => {
    const ground = groundRef.current;
    if (!ground) {
      return;
    }
    ground.style.filter = 'brightness(0.1) saturate(0.8)';
  }, []);

  useEffect(() => {
    setSky();
  }, [setSky]);

  // useEffect(() => {
  //   setGround();
  // }, [setGround]);

  useEffect(() => {
    removeStars();
    drawStars();
  }, [drawStars, removeStars]);

  const generateMeteor = useCallback(() => {
    const meteor = meteorContainerRef.current;
    if (!meteor) {
      return;
    }
    const meteorSize = Math.random() * 4 + 2;
    const meteorLeft =
      Math.random() * window.innerWidth + window.innerWidth / 3;
    const meteorTop =
      (Math.random() * window.innerHeight) / 6 + window.innerHeight / 8;
    const meteorRotation = -(Math.random() * 20 + 20);
    const meteorOpacity = Math.random() * 0.5 + 0.5;
    const translateXValue = -(Math.random() * 600 + 600);
    const translateYValue =
      translateXValue * Math.tan((meteorRotation / 180) * Math.PI);
    const meteorSpeed = (Math.random() * meteorSize) / 3 + 1;
    setTimeout(() => {
      meteor.style.opacity = '0';
    }, meteorSpeed * 1000);
    meteor.style.width = `${meteorSize}px`;
    meteor.style.height = `${meteorSize}px`;
    meteor.style.left = `${meteorLeft}px`;
    meteor.style.top = `${meteorTop}px`;
    meteor.style.opacity = `${meteorOpacity}`;
    meteor.style.display = 'block';
    meteor.animate(
      [
        {
          transform: `translate(0, 0) rotate(${meteorRotation}deg)`,
          opacity: 0,
        },
        {
          opacity: 1,
        },
        {
          transform: `translate(${translateXValue}px, ${translateYValue}px) rotate(${meteorRotation}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: meteorSpeed * 1000,
        easing: 'ease-in-out',
      }
    );
    setTimeout(() => {
      meteor.style.display = 'none';
    }, meteorSpeed * 1000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDay) {
        return;
      }
      generateMeteor();
    }, 5000);
    return () => clearInterval(interval);
  }, [generateMeteor, isDay]);

  return (
    <div>
      <div ref={skyRef} className={sky}>
        {isDay ? null : <div ref={starsRef} className={stars} />}
        {!isDay && (
          <div ref={meteorContainerRef} className={meteorContainer}>
            <div className={meteorTail} />
            <div className={meteor} />
          </div>
        )}
      </div>
      <div ref={groundRef} className={ground} />
      {children}
    </div>
  );
};
