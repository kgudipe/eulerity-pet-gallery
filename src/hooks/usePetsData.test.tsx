import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePetsData } from './usePetsData';

const jsonResponse = (payload: unknown, init?: ResponseInit): Response => {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    ...init,
  });
};

describe('usePetsData', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('loads and normalizes pets from /pets', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          title: 'Barky Spears',
          description: 'Woof! I did it again',
          url: 'https://example.test/barky.jpg',
          created: 'Sat May 23 22:51:35 UTC 2026',
        },
      ]),
    );

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const { result } = renderHook(() => usePetsData());

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(fetchMock).toHaveBeenCalledWith('/pets');
    expect(result.current.pets).toHaveLength(1);
    expect(result.current.pets[0]).toMatchObject({
      title: 'Barky Spears',
      description: 'Woof! I did it again',
      imageUrl: 'https://example.test/barky.jpg',
    });
    expect(result.current.pets[0].createdAt).toContain('2026-05-23');
  });

  it('reports empty state when API returns no pets', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const { result } = renderHook(() => usePetsData());

    await waitFor(() => {
      expect(result.current.status).toBe('empty');
    });

    expect(result.current.pets).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('reports error when /pets does not return JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('<!doctype html><html></html>', {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
        },
      }),
    );

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const { result } = renderHook(() => usePetsData());

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toContain('Expected JSON from /pets');
  });

  it('supports refetch after initial load', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([]))
      .mockResolvedValueOnce(
        jsonResponse([
          {
            name: 'Retry Pet',
            photo_url: 'https://example.test/retry.jpg',
            creationDate: '2026-05-23T22:51:35.000Z',
          },
        ]),
      );

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const { result } = renderHook(() => usePetsData());

    await waitFor(() => {
      expect(result.current.status).toBe('empty');
    });

    await act(async () => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.pets[0].title).toBe('Retry Pet');
  });
});
