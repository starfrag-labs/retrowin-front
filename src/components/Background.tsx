import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  backgroundContainer,
  sky,
  meteorContainer,
  meteorTail,
  meteor,
  clouds,
  ground,
  moon,
  starContainer,
} from '../styles/background.css';
import groundImg from '../assets/ground.png';
import cloudImg from '../assets/clouds.png';
import moonImg from '../assets/moon.png';
import { useElementStore } from '../store/element.store';
import { useWindowStore } from '../store/window.store';

export const Background = (): React.ReactElement => {
  // const variables
  const oneDay = 1000 * 60 * 60 * 24;
  const dayStart = 6 * 60 * 60 * 1000;
  const dayEnd = 18 * 60 * 60 * 1000;
  const changeDayTime = 2 * 60 * 60 * 1000;
  const timeRefreshInterval = 60000;
  const initStarCount = 300;
  const meteorInterval = 5000;

  // states
  const [time, setTime] = useState<number>(new Date().getTime() % oneDay);
  const [isDay, setIsDay] = useState(false);
  const [weight, setWeight] = useState(0);

  // refs
  const skyRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<HTMLDivElement>(null);
  const starContainerRef = useRef<HTMLDivElement>(null);
  const meteorContainerRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);

  const setCurrentElement = useElementStore((state) => state.setCurrentElement);
  const setCurrentWindow = useWindowStore((state) => state.setCurrentWindow);

  // preload images
  const preloadImages = useCallback(() => {
    const img = new Image();
    img.src = groundImg;
    img.src = cloudImg;
    img.src = moonImg;
  }, []);

  useLayoutEffect(() => {
    preloadImages();
  }, [preloadImages]);

  //setup time
  const setUpTime = useCallback(() => {
    const now = new Date();
    const newTime =
      (now.getHours() * 60 * 60 * 1000 +
        now.getMinutes() * 60 * 1000 +
        now.getSeconds() * 1000) %
      oneDay;
    setTime(newTime);
    if (newTime > dayStart && newTime < dayEnd) {
      setIsDay(true);
    } else {
      setIsDay(false);
    }
  }, [dayEnd, dayStart, oneDay]);

  useEffect(() => {
    setUpTime();
    const interval = setInterval(() => {
      setUpTime();
    }, timeRefreshInterval);
    return () => clearInterval(interval);
  }, [setUpTime]);

  // set weight by time
  useEffect(() => {
    // 1 from day start to day end - 2hours
    if (time > dayStart && time < dayEnd - changeDayTime) {
      setWeight(1);
    } else if (time <= dayStart && dayStart - time <= changeDayTime) {
      // increase linearly on the first 2 hours from day start - 2 hours
      setWeight(1 - (dayStart - time) / changeDayTime);
    } else if (time >= dayEnd - changeDayTime && time < dayEnd) {
      // decrease linearly on the last 2 hours from day end - 2 hours
      setWeight((dayEnd - time) / changeDayTime);
    } else {
      // set 0 for the rest of the time
      setWeight(0);
    }
  }, [changeDayTime, dayEnd, dayStart, oneDay, time]);

  // draw stars
  const drawStars = useCallback(() => {
    let starCount = initStarCount;
    const stars = starContainerRef.current;
    if (!stars) {
      return;
    }
    while (starCount > 0) {
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
      starCount--;
    }
  }, []);

  // handle stars opacity
  const handleStarsOpacity = useCallback(() => {
    const stars = starContainerRef.current;
    if (!stars) {
      return;
    }
    if (time > dayStart && time < dayEnd - changeDayTime) {
      stars.style.display = 'none';
    } else {
      const opacityWeight = Math.min(Math.pow(1 - weight, 6), 1);
      stars.style.opacity = `${opacityWeight}`;
      stars.style.display = 'block';
    }
  }, [changeDayTime, dayEnd, dayStart, time, weight]);

  useEffect(() => {
    handleStarsOpacity();
  }, [handleStarsOpacity]);

  // remove stars
  const removeStars = useCallback(() => {
    const stars = starContainerRef.current;
    if (!stars) {
      return;
    }
    while (stars.firstChild) {
      stars.removeChild(stars.firstChild);
    }
  }, []);

  // set sky
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

    const skyColorWeight = 1 - Math.pow(weight, 3);

    const skyStartColor = pickColor(
      nightSkyHex.start,
      daySkyHex.start,
      skyColorWeight
    );
    const skyEndColor = pickColor(
      nightSkyHex.end,
      daySkyHex.end,
      skyColorWeight
    );

    sky.style.background = `linear-gradient(to bottom, rgb(${skyStartColor[0]}, ${skyStartColor[1]}, ${skyStartColor[2]}), rgb(${skyEndColor[0]}, ${skyEndColor[1]}, ${skyEndColor[2]}))`;
  }, [weight]);

  // set ground
  const setGround = useCallback(() => {
    const ground = groundRef.current;
    if (!ground) {
      return;
    }
    const groundWeight = Math.pow(weight, 3) * 0.75 + 0.25;

    ground.style.filter = `brightness(${groundWeight})`;
  }, [weight]);

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

  // generate meteor
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
      if (time > dayStart - changeDayTime && time < dayEnd) {
        return;
      }
      generateMeteor();
    }, meteorInterval);
    return () => clearInterval(interval);
  }, [changeDayTime, dayEnd, dayStart, generateMeteor, time]);

  // setup clouds
  const setupClouds = useCallback(() => {
    const clouds = cloudsRef.current;
    if (!clouds) {
      return;
    }
    if (time < dayStart - changeDayTime || time >= dayEnd) {
      clouds.style.display = 'none';
    } else {
      const opacityWeight = Math.pow(weight, 3);
      clouds.style.display = 'block';
      clouds.style.opacity = `${opacityWeight}`;
    }
  }, [changeDayTime, dayEnd, dayStart, time, weight]);

  useEffect(() => {
    setupClouds();
  }, [setupClouds]);

  const setupMoon = useCallback(() => {
    const moon = moonRef.current;
    if (!moon) {
      return;
    }
    if (time > dayStart - changeDayTime && time <= dayEnd) {
      moon.style.display = 'none';
      return;
    } else {
      // setup moon position
      const nightDuration = dayStart + oneDay - dayEnd;
      const moonX =
        (time >= dayEnd ? time - dayEnd : time + oneDay - dayEnd) /
        nightDuration;
      const moonY = 1.2 - (Math.sin(moonX * (Math.PI / 2)) * 0.7 + 0.6);
      moon.style.display = 'block';
      moon.style.left = `${moonX * 100}vw`;
      moon.style.top = `${moonY * 100}vh`;
      // setup moon opacity
      const opacityWeight = Math.pow(1 - weight, 6);
      moon.style.opacity = `${opacityWeight}`;
    }
  }, [changeDayTime, dayEnd, dayStart, oneDay, time, weight]);

  useEffect(() => {
    setupMoon();
  }, [setupMoon]);

  return (
    <div className={backgroundContainer} onMouseEnter={() => {
      setCurrentElement(null);
      setCurrentWindow(null);
    }}>
      <div ref={skyRef} className={sky} />
      {isDay ? null : <div ref={starContainerRef} className={starContainer} />}
      {!isDay && (
        <div ref={meteorContainerRef} className={meteorContainer}>
          <div className={meteorTail} />
          <div className={meteor} />
        </div>
      )}
      <div ref={moonRef} className={moon} />
      <div ref={cloudsRef} className={clouds} />
      <div ref={groundRef} className={ground} />
    </div>
  );
};
