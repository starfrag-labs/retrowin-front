import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import groundImg from '../../assets/ground.png';
import cloudImg from '../../assets/clouds.png';
import moonImg from '../../assets/moon.png';
import { useElementStore } from '../../store/element.store';
import { useWindowStore } from '../../store/window.store';
import {
  backgroundContainer,
  nightSky,
  starContainer,
  meteorContainer,
  meteorTail,
  meteor,
  moon,
  clouds,
  ground,
} from '../../styles/pc/background.css';
import { useThemeStore } from '../../store/theme.store';
import { defaultContainer } from '../../styles/common/container.css';

export const Background = (): React.ReactElement => {
  // const variables
  const initStarCount = window.innerWidth / 3;

  const meteorInterval = 5000;

  const themeKey = useThemeStore((state) => state.getCurrentThemeKey());

  // refs
  const starContainerRef = useRef<HTMLDivElement>(null);
  const meteorContainerRef = useRef<HTMLDivElement>(null);
  const groundRef = useRef<HTMLDivElement>(null);

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

  // draw stars
  const drawStars = useCallback(() => {
    let starCount = initStarCount;
    const stars = starContainerRef.current;
    if (!stars || themeKey === 'light') {
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
  }, [initStarCount, themeKey]);

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

  // set ground
  const setGround = useCallback(() => {
    const ground = groundRef.current;
    if (!ground) {
      return;
    }

    if (themeKey === 'dark') {
      ground.style.filter = 'brightness(0.3)';
      return;
    } else if (themeKey === 'light') {
      ground.style.filter = 'brightness(1)';
      return;
    }
  }, [themeKey]);

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
    if (themeKey === 'dark') {
      const interval = setInterval(() => {
        generateMeteor();
      }, meteorInterval);
      return () => clearInterval(interval);
    }
  }, [generateMeteor, meteorInterval, themeKey]);

  return (
    <div
      className={backgroundContainer}
      onMouseEnter={() => {
        setCurrentElement(null);
        setCurrentWindow(null);
      }}
    >
      {themeKey === 'dark' && (
        <div className={defaultContainer}>
          <div className={nightSky} />
          <div ref={starContainerRef} className={starContainer} />
          <div ref={meteorContainerRef} className={meteorContainer}>
            <div className={meteorTail} />
            <div className={meteor} />
          </div>
          <div className={moon} />
        </div>
      )}
      {themeKey === 'light' && <div className={clouds} />}
      <div ref={groundRef} className={ground} />
    </div>
  );
};
