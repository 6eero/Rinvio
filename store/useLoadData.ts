import { useAppStore } from "@/store/useAppStore";
import { useCallback } from "react";

export function useLoadData() {
  const setLoading = useAppStore((s) => s.setLoading);

  const loadData = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
      setLoading(true);
      try {
        return await fn();
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  return { loadData };
}
