import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { I18nProvider } from "./providers/language/I18nProvider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { store } from "./stores/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./providers/theme/ThemeProvider";
import LoadingPage from "./pages/LoadingPage";

const App = lazy(() => import("./App"));
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <Suspense fallback={<LoadingPage/>}>
      <I18nProvider>
        <Provider store={store}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <App />
              <Toaster theme="dark" />
          </ThemeProvider>
        </Provider>
      </I18nProvider>
      </Suspense>
    </ErrorBoundary>
   </StrictMode>
)
