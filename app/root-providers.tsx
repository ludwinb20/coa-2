"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface RootProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export const RootProviders = ({ children }: RootProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
