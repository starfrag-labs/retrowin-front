import { loadingContainer, loadingSpinner } from '../styles/loading.css';

export const Loading = ({
  size = '100px',
  border = '8px',
}: {
  size?: string;
  border?: string;  
}): React.ReactElement => {
  return (
    <div className={loadingContainer}>
      <div
        className={loadingSpinner}
        style={{
          width: size,
          height: size,
          border: `${border} solid rgba(255, 255, 255, 0.3)`,
          borderTop: `${border} solid white`,
        }}
      ></div>
    </div>
  );
};
