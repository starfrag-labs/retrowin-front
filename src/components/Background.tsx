import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  backgroundContainer,
  sky,
  stars,
  meteorContainer,
  meteorTail,
  meteor,
  clouds,
  ground,
} from '../styles/background.css';
import groundImg from '../assets/ground.png'
import cloudImg from '../assets/clouds.png'

export const Background = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [isDay, setIsDay] = useState(false);
  const oneDay = 1000 * 60 * 60 * 24;
  const [time, setTime] = useState<number>(0);
  const skyRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const meteorContainerRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

  const preloadImages = useCallback(() => {
    const img = new Image();
    img.src = groundImg;
    img.src = cloudImg;
  }, []);

  useLayoutEffect(() => {
    preloadImages();
  }, [preloadImages]);

  const setUpTime = useCallback(() => {
    const now = new Date();
    const newTime =
      now.getHours() * 60 * 60 * 1000 +
      now.getMinutes() * 60 * 1000 +
      now.getSeconds() * 1000;
    setTime(newTime);
    if (newTime > 6 * 60 * 60 * 1000 && newTime < 18 * 60 * 60 * 1000) {
      setIsDay(true);
    } else {
      setIsDay(false);
    }
  }, []);

  useEffect(() => {
    setUpTime();
    const interval = setInterval(() => {
      setUpTime();
    }, 60000);
    return () => clearInterval(interval);
  }, [setUpTime]);

  const drawStars = useCallback(() => {
    let startCount = 1500;
    const stars = starsRef.current;
    if (!stars) {
      return;
    }
    while (startCount > 0) {
      const star = document.createElement('div');
      const starSize = Math.random() * 2;
      const starLeft = Math.random() * 100;
      const starTop = Math.random() * 100;
      star.style.position = 'absolute';
      star.style.width = `${starSize}px`;
      star.style.height = `${starSize}px`;
      star.style.borderRadius = '50%';
      star.style.backgroundColor = 'white';
      star.style.boxShadow = `0 0 10px ${starSize * (1 - starTop / 100)}px #fff2cc`;
      star.style.opacity = `${1 - (starTop / (100 * 2)) * 2}`;
      star.style.left = `${starLeft}%`;
      star.style.top = `${starTop}%`;
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
    const pickColor = (color1: number[], color2: number[], weight: number) => {
      const w1 = weight;
      const w2 = 1 - w1;
      const rgb = [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2),
      ];
      return rgb;
    };
    const nightSkyHex = {
      start: [0, 0, 0],
      end: [0, 0, 20],
    };
    const daySkyHex = {
      start: [135, 206, 235],
      end: [161, 206, 235],
    };

    const weight = Math.min(
      (Math.cos((time / oneDay) * Math.PI * 2) / 2 + 0.5) * 1.2,
      1
    );

    const skyStartColor = pickColor(nightSkyHex.start, daySkyHex.start, weight);
    const skyEndColor = pickColor(nightSkyHex.end, daySkyHex.end, weight);

    sky.style.background = `linear-gradient(to bottom, rgb(${skyStartColor[0]}, ${skyStartColor[1]}, ${skyStartColor[2]}), rgb(${skyEndColor[0]}, ${skyEndColor[1]}, ${skyEndColor[2]}))`;
  }, [oneDay, time]);

  const setGround = useCallback(() => {
    const ground = groundRef.current;
    if (!ground) {
      return;
    }
    const weight =
      1.25 -
      ((Math.cos((time / oneDay) * Math.PI * 2) / 2 + 0.5) * 0.75 + 0.25);

    ground.style.filter = `brightness(${weight})`;
  }, [oneDay, time]);

  useEffect(() => {
    setSky();
  }, [setSky]);

  useEffect(() => {
    setGround();
  }, [setGround]);

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

  const setupClouds = useCallback(() => {
    const clouds = cloudsRef.current;
    if (!clouds) {
      return;
    }
    if (!isDay) {
      clouds.style.display = 'none';
    } else {
      const opacityWeight = Math.max(
        Math.sin((time / oneDay - 0.25) * Math.PI * 2),
        0
      );
      clouds.style.display = 'block';
      clouds.style.opacity = `${opacityWeight}`;
    }
  }, [isDay, oneDay, time]);

  useEffect(() => {
    setupClouds();
  }, [setupClouds]);

  const handleStarsOpacity = useCallback(() => {
    const stars = starsRef.current;
    if (!stars) {
      return;
    }
    if (isDay) {
      stars.style.display = 'none';
    } else {
      const opacityWeight =
        1 - Math.abs(Math.cos((time / oneDay - 0.25) * Math.PI * 2));
      stars.style.opacity = `${opacityWeight}`;
      stars.style.display = 'block';
    }
  }, [isDay, oneDay, time]);

  useEffect(() => {
    handleStarsOpacity();
  }, [handleStarsOpacity]);

  return (
    <div className={backgroundContainer}>
      <div ref={skyRef} className={sky} />
      {isDay ? null : <div ref={starsRef} className={stars} />}
      {!isDay && (
        <div ref={meteorContainerRef} className={meteorContainer}>
          <div className={meteorTail} />
          <div className={meteor} />
        </div>
      )}
      <div ref={cloudsRef} className={clouds} />
      <div ref={groundRef} className={ground} />
      {children}
    </div>
  );
};
