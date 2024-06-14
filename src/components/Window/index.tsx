import { useWindowStore } from "../../store/window.store";
import { Navigator } from "./Navigator";

export const Window = ({
  windowKey,
  windowOrder,
  setWindowOrder,
}: {
  windowKey: string;
  windowOrder: string[];
  setWindowOrder: (order: string[]) => void;
}) => {
  const window = useWindowStore((state) => state.getWindow(windowKey));
  if (!window) return null;
  switch (window.type) {
    case 'navigator':
      return (
        <Navigator
          folderKey={window.key}
          windowOrder={windowOrder}
          setWindowOrder={setWindowOrder}
        />
      );
  }
};
