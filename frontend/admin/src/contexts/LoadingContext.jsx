import { createContext, useContext, useState, useCallback } from "react";
import { PageLoading } from "../components/Loading";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  const setLoading = useCallback((loading) => {
    setLoadingCount((prev) => {
      const newCount = loading ? prev + 1 : Math.max(0, prev - 1);
      setIsLoading(newCount > 0);
      return newCount;
    });
  }, []);

  const value = {
    isLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && <PageLoading />}
    </LoadingContext.Provider>
  );
};
