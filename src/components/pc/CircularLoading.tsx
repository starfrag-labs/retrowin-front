import { circularLoadingContainer, circularLoadingSpinner } from "../../styles/common/loading.css";

export const CircularLoading = ({
  size = '100px',
  border = '8px',
}: {
  size?: string;
  border?: string;
}): React.ReactElement => {
  return (
    <div className={circularLoadingContainer}>
      <div
        className={circularLoadingSpinner}
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
