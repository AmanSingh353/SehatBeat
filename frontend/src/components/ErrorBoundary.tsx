import React from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("App ErrorBoundary caught: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground p-6 pt-24">
          <div className="max-w-2xl mx-auto p-6 border rounded-lg bg-muted/30">
            <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The page encountered an error and could not render.
            </p>
            {process.env.NODE_ENV === "development" && (
              <pre className="text-xs whitespace-pre-wrap bg-background p-3 rounded border overflow-auto max-h-64">
                {String(this.state.error)}
              </pre>
            )}
            <button
              className="mt-4 px-3 py-2 border rounded"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
