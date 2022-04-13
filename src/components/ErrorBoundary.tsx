import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div className='app-error-container'>
          <h1>Oops! Something went wrong.</h1>
          <h2>Please try later again.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            type='button'
          >
            Try again
          </button>
        </div>
      );
    }
    const { children } = this.props;
    return children;
  }
}
