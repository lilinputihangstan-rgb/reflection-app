import { useEffect, useState } from "react";
import { safeLocalStorageGet, safeLocalStorageSet } from "../lib/safeStorage";

export default function useAppearanceStorage(defaultAppearance = {}) {
  const [appearance, setAppearance] = useState(() => {
    const raw = safeLocalStorageGet("reflection-appearance");
    if (!raw) return defaultAppearance;

    try {
      return { ...defaultAppearance, ...JSON.parse(raw) };
    } catch (error) {
      return defaultAppearance;
    }
  });

  useEffect(() => {
    safeLocalStorageSet("reflection-appearance", JSON.stringify(appearance));
  }, [appearance]);

  return [appearance, setAppearance];
}
