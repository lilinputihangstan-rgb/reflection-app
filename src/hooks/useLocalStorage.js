import { useEffect, useState } from "react";
import { safeLocalStorageGet, safeLocalStorageRemove, safeLocalStorageSet, safeJsonParse } from "../lib/safeStorage";

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = safeLocalStorageGet(key);
    if (stored === null) return initialValue;
    return safeJsonParse(stored, initialValue);
  });

  useEffect(() => {
    if (value === undefined || value === null) {
      safeLocalStorageRemove(key);
      return;
    }

    const payload = typeof value === "string" ? value : JSON.stringify(value);
    safeLocalStorageSet(key, payload);
  }, [key, value]);

  return [value, setValue];
}
