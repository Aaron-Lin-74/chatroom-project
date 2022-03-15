import SignUp from './SignUp';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('Test suite for SignUp component', () => {
  const setup = () => {
    jest.useFakeTimers();
    const toggleSignIn = jest.fn();
    const utils = render(<SignUp toggleSignIn={toggleSignIn} />);
    const inputEmail = utils.getByLabelText('Email') as HTMLInputElement;
    const inputPassword = utils.getByLabelText(
      'Password (at least 6 characters)'
    ) as HTMLInputElement;
    const inputPassword2 = utils.getByLabelText(
      'Confirm Password'
    ) as HTMLInputElement;
    const spanToggle = utils.getByText('sign in');
    const buttons = utils.getAllByRole('button');
    const signUpButton = buttons[0];
    const signUpWithGoogleButton = buttons[1];
    return {
      inputEmail,
      inputPassword,
      inputPassword2,
      spanToggle,
      buttons,
      signUpButton,
      signUpWithGoogleButton,
      ...utils,
    };
  };

  test('should match the snapshot', () => {
    const { container } = setup();
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render the component', () => {
    const {
      inputEmail,
      inputPassword,
      inputPassword2,
      spanToggle,
      buttons,
      signUpButton,
      signUpWithGoogleButton,
    } = setup();
    expect(screen.getByText(/Already have an account?/)).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
    expect(signUpButton).toHaveTextContent('Sign Up');
    expect(signUpWithGoogleButton).toHaveTextContent('Sign up with Google');
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe('');
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.value).toBe('');
    expect(inputPassword2).toBeInTheDocument();
    expect(inputPassword2.value).toBe('');
    expect(spanToggle).toBeInTheDocument();
  });

  test('should inputs have required attribute', () => {
    const { inputEmail, inputPassword, inputPassword2 } = setup();
    expect(inputEmail).toBeRequired();
    expect(inputPassword).toBeRequired();
    expect(inputPassword2).toBeRequired();
  });

  test('should allow email address to be inputted', () => {
    const { inputEmail } = setup();
    expect(inputEmail.value).toBe('');
    // fireEvent.change(inputEmail, { target: { value: 'test@test.com' } });
    const text = 'test@test.com';
    userEvent.type(inputEmail, text);
    expect(inputEmail.value).toBe('test@test.com');
  });

  test('should allow email address to be deleted', () => {
    const { inputEmail } = setup();
    // fireEvent.change(inputEmail, { target: { value: 'test@test.com' } });
    userEvent.type(inputEmail, 'test@test.com');
    expect(inputEmail.value).toBe('test@test.com');
    // fireEvent.change(inputEmail, { target: { value: '' } });
    userEvent.clear(inputEmail);
    expect(inputEmail.value).toBe('');
  });

  test('should allow password to be inputted', () => {
    const { inputPassword } = setup();
    expect(inputPassword.value).toBe('');
    // fireEvent.change(inputPassword, { target: { value: '1234567' } });
    // screen.debug(inputPassword);
    userEvent.type(inputPassword, '1234567');
    expect(inputPassword.value).toBe('1234567');
  });

  test('should allow password to be deleted', () => {
    const { inputPassword } = setup();
    // fireEvent.change(inputPassword, { target: { value: '1234567' } });
    userEvent.type(inputPassword, '1234567');
    expect(inputPassword.value).toBe('1234567');
    // fireEvent.change(inputPassword, { target: { value: '' } });
    userEvent.clear(inputPassword);
    expect(inputPassword.value).toBe('');
  });

  test('should allow confirm password to be inputted', () => {
    const { inputPassword2 } = setup();
    expect(inputPassword2.value).toBe('');
    // fireEvent.change(inputPassword2, { target: { value: '1234567' } });
    // screen.debug(inputPassword2);
    userEvent.type(inputPassword2, '1234567');
    expect(inputPassword2.value).toBe('1234567');
  });

  test('should allow confirm password to be deleted', () => {
    const { inputPassword2 } = setup();
    // fireEvent.change(inputPassword2, { target: { value: '1234567' } });
    userEvent.type(inputPassword2, '1234567');
    expect(inputPassword2.value).toBe('1234567');
    // fireEvent.change(inputPassword2, { target: { value: '' } });
    userEvent.clear(inputPassword2);
    expect(inputPassword2.value).toBe('');
  });

  test('should validate form fields when click sign in button', async () => {
    const { signUpButton } = setup();
    userEvent.click(signUpButton);
    // screen.debug(await screen.findByRole('alert'));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  test('should error alert disappear after timeout', async () => {
    const { signUpButton } = setup();
    userEvent.click(signUpButton);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    jest.runAllTimers();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});