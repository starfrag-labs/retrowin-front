import { useWindowStore } from '../../store/window.store';
import { Navigator } from './Navigator';
import { Uploader } from './Uploader';

export const Window = ({ windowKey }: { windowKey: string }) => {
  const window = useWindowStore((state) => state.findWindow(windowKey));
  if (!window) return null;
  switch (window.type) {
    case 'navigator':
      return <Navigator folderKey={window.key} />;
    case 'uploader':
      return <Uploader folderKey={window.key} />;
  }
};
