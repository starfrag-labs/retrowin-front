import { loadingContainer, loadingSpinner } from '../styles/loading.css';

export const Loading = (): React.ReactElement => {
  return (
    <div className={loadingContainer}>
      <div className={loadingSpinner}></div>
    </div>
  );
};
