import { createContext, useContext, useMemo } from 'react';
import { usePetsData } from '../hooks/usePetsData';
import type { Pet } from '../types';

interface PetsContextValue {
  pets: Pet[];
  petsById: Record<string, Pet>;
  status: 'loading' | 'success' | 'empty' | 'error';
  error: string | null;
  refetch: () => void;
}

const PetsContext = createContext<PetsContextValue | null>(null);

interface PetsProviderProps {
  children: React.ReactNode;
}

export const PetsProvider = ({ children }: PetsProviderProps) => {
  const { pets, status, error, refetch } = usePetsData();

  const petsById = useMemo(() => {
    return pets.reduce<Record<string, Pet>>((accumulator, pet) => {
      accumulator[pet.id] = pet;
      return accumulator;
    }, {});
  }, [pets]);

  const value = useMemo(
    () => ({
      pets,
      petsById,
      status,
      error,
      refetch,
    }),
    [pets, petsById, status, error, refetch],
  );

  return <PetsContext.Provider value={value}>{children}</PetsContext.Provider>;
};

export const usePets = (): PetsContextValue => {
  const context = useContext(PetsContext);
  if (!context) {
    throw new Error('usePets must be used within a PetsProvider.');
  }

  return context;
};
