import { FaRegSquareFull } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { FiMinimize } from "react-icons/fi";
import { FaMinus } from "react-icons/fa6";

export default function WindowHeaderIcon({
  icon,
  onClick,
  className,
  style,
}: {
  icon: "fullscreen" | "exit_fullscreen" | "close" | "minimize";
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  switch (icon) {
    case "fullscreen":
      return (
        <FaRegSquareFull
          className={className}
          onClick={onClick}
          style={{
            ...style,
            padding: "0.675rem",
          }}
        />
      );
    case "exit_fullscreen":
      return (
        <FiMinimize className={className} onClick={onClick} style={style} />
      );
    case "minimize":
      return <FaMinus className={className} onClick={onClick} style={style} />;
    case "close":
      return (
        <IoMdClose className={className} onClick={onClick} style={style} />
      );
    default:
      return null;
  }
}
