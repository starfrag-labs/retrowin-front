import { setupPageContainer, logoContainer } from '../styles/common/loading.css';
import { Logo } from './Logo';

export const SetupPage = ({
  theme,
}: {
  theme?: string;
}): React.ReactElement => {
  return (
    <div className={`${setupPageContainer} ${theme}`}>
      <div className={logoContainer}>
        <Logo text={false} setup />
      </div>
    </div>
  );
};
