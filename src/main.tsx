import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9F9F7] text-center font-sans">
          <span className="text-2xl font-black tracking-tighter text-[#062D27] uppercase mb-4">
            WASH <span className="text-[#F26522]">Mitra</span>
          </span>
          <p className="text-slate-600 mb-6 max-w-md text-sm font-medium">
            Something unexpected occurred while rendering the page.
          </p>
          <button
            onClick={() => { window.location.href = './'; }}
            className="px-6 py-3 bg-[#F26522] hover:bg-[#d95d1f] text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all"
          >
            Reload Website
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
