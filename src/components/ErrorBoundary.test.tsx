import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

describe('Test suites for ErrorBoundary component', () => {
  const errorObject = console.error;
  const logObject = console.log;
  beforeEach(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });

  afterEach(() => {
    console.error = errorObject;
    console.log = logObject;
  });
  const mockChildren = <h1>Mock children</h1>;
  function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
      throw new Error('An error I made');
    } else {
      return null;
    }
  }
  test('should match the snapshot', () => {
    const { asFragment } = render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the children component', () => {
    render(<ErrorBoundary children={mockChildren} />);
    screen.getByRole('heading', { name: 'Mock children' });
  });

  test('should render the error page when a component error occurs', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    screen.getByRole('heading', { name: 'Oops! Something went wrong.' });
    screen.getByRole('heading', { name: 'Please try later again.' });
  });

  test('should be able to try again, and remove the error content', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
        {mockChildren}
      </ErrorBoundary>
    );
    // state is prever
    rerender(<ErrorBoundary children={mockChildren} />);
    userEvent.click(screen.getByText(/try again/i));
    expect(
      screen.queryByRole('heading', { name: 'Oops! Something went wrong.' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/try again/i)).not.toBeInTheDocument();
  });
});
