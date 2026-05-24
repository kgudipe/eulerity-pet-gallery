import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectionProvider, useSelection } from './SelectionContext';

const usePetsMock = vi.fn();

vi.mock('./PetsContext', () => ({
  usePets: () => usePetsMock(),
}));

const wrapper = ({ children }: PropsWithChildren) => {
  return <SelectionProvider>{children}</SelectionProvider>;
};

describe('SelectionContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();

    usePetsMock.mockReturnValue({
      petsById: {
        'pet-1': {
          id: 'pet-1',
          imageUrl: 'https://images.test/pet-1.jpg',
          title: 'Pet One',
          description: 'First pet',
          createdAt: '2026-05-23T22:51:35.000Z',
        },
        'pet-2': {
          id: 'pet-2',
          imageUrl: 'https://images.test/pet-2.jpg',
          title: 'Pet Two',
          description: 'Second pet',
          createdAt: '2026-05-23T22:51:35.000Z',
        },
      },
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('toggles selection and estimates file size from HEAD content-length', async () => {
    const fetchMock = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();
      const size = url.includes('pet-1') ? '1024' : '2048';

      if (init?.method === 'HEAD') {
        return new Response(null, {
          status: 200,
          headers: {
            'content-length': size,
          },
        });
      }

      return new Response(new Blob(['x'.repeat(Number(size))]), {
        status: 200,
        headers: {
          'content-type': 'image/jpeg',
        },
      });
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const { result } = renderHook(() => useSelection(), { wrapper });

    act(() => {
      result.current.toggleSelection('pet-1');
    });

    expect(result.current.selectedCount).toBe(1);
    expect(result.current.isSelected('pet-1')).toBe(true);

    await waitFor(() => {
      expect(result.current.estimatedTotalBytes).toBe(1024);
      expect(result.current.unknownSizeCount).toBe(0);
    });

    act(() => {
      result.current.toggleSelection('pet-1');
    });

    expect(result.current.selectedCount).toBe(0);
    expect(result.current.isSelected('pet-1')).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith('https://images.test/pet-1.jpg', { method: 'HEAD' });
  });

  it('supports selectAll + clearSelection and deduplicates ids', async () => {
    const fetchMock = vi.fn(async (_input: URL | RequestInfo, init?: RequestInit) => {
      if (init?.method === 'HEAD') {
        return new Response(null, {
          status: 200,
          headers: {
            'content-length': '512',
          },
        });
      }

      return new Response(new Blob(['x'.repeat(512)]), {
        status: 200,
      });
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const { result } = renderHook(() => useSelection(), { wrapper });

    act(() => {
      result.current.selectAll(['pet-1', 'pet-1', 'pet-2']);
    });

    expect(result.current.selectedCount).toBe(2);
    expect(result.current.isSelected('pet-1')).toBe(true);
    expect(result.current.isSelected('pet-2')).toBe(true);

    await waitFor(() => {
      expect(result.current.estimatedTotalBytes).toBe(1024);
      expect(result.current.unknownSizeCount).toBe(0);
    });

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedCount).toBe(0);
    expect(result.current.selectedIds).toEqual([]);
  });
});
