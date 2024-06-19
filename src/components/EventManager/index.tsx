import { KeyEventManager } from './KeyEventManager';
import { MouseEventManager } from './MouseEventManager';

export const EventManager = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  return (
    <div>
      <KeyEventManager>
        <MouseEventManager>{children}</MouseEventManager>;
      </KeyEventManager>
    </div>
  );
};
