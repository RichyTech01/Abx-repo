// hooks/useLocationAwareFetch.ts
import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '@/store/locationStore';

interface UseLocationAwareFetchOptions {
  onFetch: (hasLocation: boolean) => void | Promise<void>;
  waitTimeout?: number; // milliseconds to wait for location
  enabled?: boolean; // allow disabling the hook
}

/**
 * Custom hook that handles fetching data with optional location.
 * Waits for location to load, but fetches without it after timeout.
 * Auto re-fetches when location becomes available.
 */
export function useLocationAwareFetch({
  onFetch,
  waitTimeout = 2000,
  enabled = true,
}: UseLocationAwareFetchOptions) {
  const { latitude, longitude, isLoading: locationLoading, isInitialized } = useLocationStore();
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [fetchedWithLocation, setFetchedWithLocation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasLocation = latitude !== null && longitude !== null;

  useEffect(() => {
    if (!enabled) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Case 1: Location already available - fetch immediately
    if (hasLocation) {
      console.log('Location available, fetching with location');
      onFetch(true);
      setInitialFetchDone(true);
      setFetchedWithLocation(true);
      return;
    }

    // Case 2: Still loading location - wait for it
    if (locationLoading && !isInitialized) {
      console.log('Location loading, waiting...');
      return;
    }

    // Case 3: Location initialized but not available - fetch without location
    if (isInitialized && !hasLocation && !initialFetchDone) {
      console.log('Location not available, fetching without location');
      onFetch(false);
      setInitialFetchDone(true);
      setFetchedWithLocation(false);
      return;
    }

    // Case 4: Not initialized yet - wait with timeout
    if (!initialFetchDone && !isInitialized) {
      console.log('Waiting for location with timeout');
      timeoutRef.current = setTimeout(() => {
        if (!hasLocation) {
          console.log('Timeout reached, fetching without location');
          onFetch(false);
          setInitialFetchDone(true);
          setFetchedWithLocation(false);
        }
      }, waitTimeout);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasLocation, locationLoading, enabled, initialFetchDone, isInitialized]);

  // Re-fetch when location becomes available after initial fetch without location
  useEffect(() => {
    if (
      enabled &&
      initialFetchDone &&
      hasLocation &&
      !fetchedWithLocation
    ) {
      console.log('Location became available, re-fetching with location');
      onFetch(true);
      setFetchedWithLocation(true);
    }
  }, [hasLocation, initialFetchDone, fetchedWithLocation, enabled]);

  return {
    hasLocation,
    locationLoading,
    refetch: () => onFetch(hasLocation),
  };
}