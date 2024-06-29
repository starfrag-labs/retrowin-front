import { useEffect } from 'react';
import { useProgressStore } from '../store/progress.store';
import {
  progressBar,
  progressContainer,
  progressName,
  progressWindow,
} from '../styles/progress.css';
import { MdFileUpload, MdFileDownload } from 'react-icons/md';

export const Progress = (): React.ReactElement => {
  // store states
  const progresses = useProgressStore((state) => state.progresses);

  // store functions
  const removeProgress = useProgressStore((state) => state.removeProgress);

  useEffect(() => {
    progresses.map((progress) => {
      if (progress.loaded === progress.total) {
        removeProgress(progress.name);
      }
    });
  }, [progresses, removeProgress]);

  if (progresses.length === 0) return <></>;

  return (
    <div className={progressWindow}>
      {progresses.map((progress) => (
        <div key={progress.key} className={progressContainer}>
          {progress.type === 'upload' ? <MdFileUpload /> : <MdFileDownload />}
          <div className={progressName}>{progress.name}</div>
          <progress
            value={progress.loaded}
            max={progress.total}
            className={progressBar}
          ></progress>
          <div>{Math.round((progress.loaded / progress.total) * 100)}%</div>
        </div>
      ))}
    </div>
  );
};
