import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocationStore } from "@/store/locationStore";
import StoreApi from "@/api/StoreApi";

export function useClosestStores() {
  const {
    latitude,
    longitude,
    status: locationStatus,
    requestLocation,
    error: locationError,
  } = useLocationStore();

  useEffect(() => {
    if (locationStatus === "idle") requestLocation();
  }, [locationStatus, requestLocation]);

  const query = useQuery({
    queryKey: ["closestStores", latitude, longitude],
    queryFn: async () => {
      try {
        const data = await StoreApi.getNearestStores(latitude!, longitude!);
        // console.log(latitude, longitude);
        return Array.isArray(data) ? data : data.results || [];
      } catch (err: any) {
        console.log("Error fetching stores:", err.response || err.message);
        throw err;
      }
    },
    enabled: locationStatus === "success" && !!latitude && !!longitude,
    staleTime: 1000 * 60 * 5,
  });

  return { ...query, locationStatus, locationError };
}
