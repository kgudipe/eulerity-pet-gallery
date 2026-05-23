import { useCallback, useEffect, useState } from 'react';
import type { Pet } from '../types';

type DataStatus = 'loading' | 'success' | 'empty' | 'error';

interface UsePetsDataResult {
  pets: Pet[];
  status: DataStatus;
  error: string | null;
  refetch: () => void;
}

const toStringValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  return '';
};

const toIsoDate = (value: unknown): string | null => {
  if (typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  return null;
};

const normalizePet = (raw: Record<string, unknown>, index: number): Pet | null => {
  const imageUrl =
    toStringValue(raw.image_url) ||
    toStringValue(raw.imageUrl) ||
    toStringValue(raw.url) ||
    toStringValue(raw.image) ||
    toStringValue(raw.photo_url);

  if (!imageUrl) {
    return null;
  }

  const idSource =
    toStringValue(raw.id) ||
    toStringValue(raw._id) ||
    toStringValue(raw.uuid) ||
    toStringValue(raw.pet_id) ||
    `${imageUrl}-${index}`;

  const title = toStringValue(raw.title) || toStringValue(raw.name) || `Pet ${index + 1}`;
  const description =
    toStringValue(raw.description) ||
    toStringValue(raw.summary) ||
    toStringValue(raw.caption) ||
    'No description available.';

  const createdAt =
    toIsoDate(raw.created) ??
    toIsoDate(raw.created_at) ??
    toIsoDate(raw.creationDate) ??
    toIsoDate(raw.entity_creation_date) ??
    new Date(0).toISOString();

  return {
    id: idSource,
    imageUrl,
    title,
    description,
    createdAt,
  };
};

export const usePetsData = (): UsePetsDataResult => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [status, setStatus] = useState<DataStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const refetch = useCallback(() => {
    setRefreshToken((previous) => previous + 1);
  }, []);

  useEffect(() => {
    let canceled = false;

    const fetchPets = async () => {
      setStatus('loading');
      setError(null);

      try {
        const response = await fetch('/pets');
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.toLowerCase().includes('application/json')) {
          throw new Error(
            `Expected JSON from /pets but received "${contentType || 'unknown'}". This usually means /pets was not routed to the API.`,
          );
        }

        const payload: unknown = await response.json();

        if (!Array.isArray(payload)) {
          throw new Error('Response payload is not an array.');
        }

        const normalizedPets = payload
          .map((item, index) => {
            if (typeof item !== 'object' || item === null) {
              return null;
            }

            return normalizePet(item as Record<string, unknown>, index);
          })
          .filter((item): item is Pet => item !== null);

        if (canceled) {
          return;
        }

        setPets(normalizedPets);
        setStatus(normalizedPets.length > 0 ? 'success' : 'empty');
      } catch (caughtError) {
        if (canceled) {
          return;
        }

        const message =
          caughtError instanceof Error ? caughtError.message : 'Unknown error occurred while loading pets.';

        setPets([]);
        setError(message);
        setStatus('error');
      }
    };

    void fetchPets();

    return () => {
      canceled = true;
    };
  }, [refreshToken]);

  return {
    pets,
    status,
    error,
    refetch,
  };
};
