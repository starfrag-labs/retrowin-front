import { useWindowStore } from "../../store/window.store";
import { Navigator } from "./Navigator";

export const Window = ({ windowKey }: { windowKey: string }) => {
  const window = useWindowStore((state) => state.getWindow(windowKey));
  if (!window) return null;
  switch (window.type) {
    case 'navigator':
      return <Navigator folderKey={window.key} />;
  }
};
