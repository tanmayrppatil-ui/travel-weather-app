import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900" role="alert">
          <p className="font-medium">Something went wrong</p>
          <p className="mt-1 text-sm">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
