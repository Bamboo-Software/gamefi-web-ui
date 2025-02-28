import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { I18nProvider } from "./providers/language/I18nProvider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { store } from "./stores/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./providers/theme/ThemeProvider";

const App = lazy(() => import("./App"));
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nProvider>
        <Provider store={store}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Suspense fallback={<div>Loading</div>}>
              <App />
              <Toaster />
            </Suspense>
          </ThemeProvider>
        </Provider>
      </I18nProvider>
    </ErrorBoundary>
  </StrictMode>
)
