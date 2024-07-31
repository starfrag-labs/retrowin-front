import { useEffect, useState } from 'react';
import { loadingPageContainer, logoContainer } from '../styles/loading.css';
import { Logo } from './Logo';

export const LoadingPage = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 2000);
  }, []);

  return (
    <div className={loadingPageContainer}>
      <div className={logoContainer}>
        <Logo text={false} isLoading={isLoading} />
      </div>
    </div>
  );
};
