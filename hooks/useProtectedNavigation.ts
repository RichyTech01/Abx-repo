import { useState } from "react";
import { useRouter } from "expo-router";
import Storage from "@/utils/Storage";

export function useProtectedNavigation() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleProtectedNavigation = async (path: string) => {
    const token = await Storage.get("accessToken");
    const guest = await Storage.get("isGuest");

    if (!token && guest) {
      setShowModal(true);
      return;
    }

    router.push(path as any);
  };

  return { showModal, setShowModal, handleProtectedNavigation };
}
