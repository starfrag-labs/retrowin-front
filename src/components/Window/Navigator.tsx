import { windowContainer } from "../../css/styles/window.css";

export const Navigator = ({
  children
}: {children: React.ReactNode}): React.ReactElement => {
  return (
    <div className={windowContainer}>
      {children}
    </div>
  );
}