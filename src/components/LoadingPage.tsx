import { loadingPageContainer, logoContainer } from '../styles/loading.css';
import { Logo } from './Logo';

export const LoadingPage = (): React.ReactElement => {

  return (
    <div className={loadingPageContainer}>
      <div className={logoContainer}>
        <Logo text={false} setup/>
      </div>
    </div>
  );
};
