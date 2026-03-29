import { FaMinus, FaRegSquareFull } from "react-icons/fa6";
import { FiMinimize } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

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
          style={style}
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
