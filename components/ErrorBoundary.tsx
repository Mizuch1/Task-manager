import React, { Component, ReactNode } from 'react';

interface Props {
 children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
 error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-40 mb-4">Une erreur est survenue</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {this.state.error?.message || 'Une erreur inattendue est survenue'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-primary-700 transition duration-300"
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
