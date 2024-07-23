import { useEffect, useRef, useState } from 'react';
import { useProgressStore } from '../../store/progress.store';
import {
  spinner,
  spinnerContainer,
} from '../../styles/mobile/progressSpinner.css';

export const ProgressSpinner = (): React.ReactElement => {
  const [totalProgress, setTotalProgress] = useState<number>(0);

  // Refs
  const spinnerRef = useRef<HTMLDivElement>(null);

  // Store
  const progresses = useProgressStore((state) => state.progresses);

  useEffect(() => {
    if (progresses.length === 0) {
      setTotalProgress(0);
    } else {
      setTotalProgress(
        progresses.reduce((acc, progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          const percentByFile = percent / progresses.length;
          return acc + Math.round(percentByFile);
        }, 0)
      );
    }
  }, [progresses]);

  useEffect(() => {
    if (spinnerRef.current) {
      spinnerRef.current.style.background = `conic-gradient(gray ${totalProgress * 3.6}deg, white 0deg)`;
    }
  }, [totalProgress]);

  if (progresses.length === 0 || totalProgress === 0) return <></>;

  return (
    <div className={spinnerContainer} ref={spinnerRef}>
      <div className={spinner}>{totalProgress}%</div>
    </div>
  );
};
