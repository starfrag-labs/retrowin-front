import { setupPageContainer, logoContainer } from '../styles/loading.css';
import { Logo } from './Logo';

export const SetupPage = (): React.ReactElement => {
  return (
    <div className={setupPageContainer}>
      <div className={logoContainer}>
        <Logo text={false} setup />
      </div>
    </div>
  );
};
