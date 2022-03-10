import SignOut from './SignOut';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Test suites for SignOut component', () => {
  test('should match the snapshot', () => {
    const { asFragment } = render(<SignOut signOutUser={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the component', () => {
    render(<SignOut signOutUser={() => {}} />);
    // screen.debug();
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('SIGN-OUT');
  });

  test('should handle onClick', () => {
    const onClick = jest.fn();
    render(<SignOut signOutUser={onClick} />);
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(onClick).toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
