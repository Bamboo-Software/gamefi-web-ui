import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { I18nProvider } from "./providers/language/I18nProvider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { store } from "./stores/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./providers/theme/ThemeProvider";
import LoadingPage from "./pages/LoadingPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi'

const App = lazy(() => import("./App"));
import "./index.css";
import { wagmiAdapter } from "./configs/reown";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <Provider store={store}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <WagmiProvider config={wagmiAdapter.wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <Suspense fallback={<LoadingPage />}>
                  <App />
                  <Toaster theme="dark" />
                </Suspense>
              </QueryClientProvider>
            </WagmiProvider>
          </ThemeProvider>
        </Provider>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>
);
