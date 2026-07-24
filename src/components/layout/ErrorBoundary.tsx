import { Component } from 'preact';
import type { ComponentChildren } from 'preact';
import '../content/PlaceholderPage.css';

interface ErrorBoundaryProps {
  children: ComponentChildren;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    console.error('Unhandled application error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container placeholder-page">
          <h1>Something went wrong</h1>
          <p>
            This part of the page couldn&apos;t be displayed. Try reloading the page — if
            the problem continues, please try again later.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
