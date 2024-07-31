import { loadingPageContainer } from '../styles/loading.css';
import { Logo } from './Logo';

export const LoadingPage = (): React.ReactElement => {
  return (
    <div className={loadingPageContainer}>
      <Logo text={false} />
    </div>
  );
};
