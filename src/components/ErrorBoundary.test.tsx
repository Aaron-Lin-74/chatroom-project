import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

describe('Test suites for ErrorBoundary component', () => {
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
    const errorObject = console.error;
    const logObject = console.log;
    console.error = jest.fn();
    console.log = jest.fn();
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    screen.getByRole('heading', { name: 'Oops! Something went wrong.' });
    screen.getByRole('heading', { name: 'Please try later again.' });
    console.error = errorObject;
    console.log = logObject;
  });
});
