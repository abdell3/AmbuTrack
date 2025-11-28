import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store } from './store/store'
import { queryClient } from './lib/api/queryClient'
import { ErrorBoundary } from './components/ErrorBoundary'
import { NotificationProvider } from './contexts/NotificationContext'
import { Toaster } from './components/ui/toaster'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <App />
            <Toaster />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </NotificationProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
