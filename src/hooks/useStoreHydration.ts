import { useState, useEffect } from 'react';
// hook que mais me deu dificuldade, na procura de uma forma simples de garantir que o estado do zustand esteja hidratado (ex: carregado do localStorage) antes de usar os dados, evitando erros de undefined
export function useStoreHydration<T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) {
  const result = store(callback) as F;
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  return isHydrated ? result : undefined;
}