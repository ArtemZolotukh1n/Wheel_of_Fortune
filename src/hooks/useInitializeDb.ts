import { useEffect, useState } from 'react';
import { ensureDbSeed } from '../db';

export const useInitializeDb = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    ensureDbSeed()
      .then(() => {
        if (isMounted) setIsReady(true);
      })
      .catch((error) => {
        console.warn('Ошибка инициализации базы данных:', error);
        if (isMounted) setIsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return isReady;
};
