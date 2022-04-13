import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '../firebase';
import SignUp from './SignUp';

describe('Test suite for SignUp component', () => {
  const errorObject = console.error;
  const logObject = console.log;
  beforeEach(async () => {
    console.error = jest.fn();
    console.log = jest.fn();
    await enableNetwork(db);
  });

  afterEach(async () => {
    console.error = errorObject;
    console.log = logObject;
    await disableNetwork(db);
  });
  const setup = () => {
    jest.useFakeTimers();
    const toggleSignIn = jest.fn();
    const mockSignInWithGoogle = jest.fn();
    const mockCreateUserWithEmailAndPassword = jest
      .fn()
      .mockRejectedValue(new Error('Mock Error Message'));
    const utils = render(
      <SignUp
        toggleSignIn={toggleSignIn}
        signInWithGoogle={mockSignInWithGoogle}
        createUserWithEmailAndPassword={mockCreateUserWithEmailAndPassword}
      />
    );
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
    expect(buttons).toHaveLength(3);
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
    const text = 'test@test.com';
    userEvent.type(inputEmail, text);
    expect(inputEmail.value).toBe('test@test.com');
  });

  test('should allow email address to be deleted', () => {
    const { inputEmail } = setup();
    userEvent.type(inputEmail, 'test@test.com');
    expect(inputEmail.value).toBe('test@test.com');
    userEvent.clear(inputEmail);
    expect(inputEmail.value).toBe('');
  });

  test('should allow password to be inputted', () => {
    const { inputPassword } = setup();
    expect(inputPassword.value).toBe('');
    userEvent.type(inputPassword, '1234567');
    expect(inputPassword.value).toBe('1234567');
  });

  test('should allow password to be deleted', () => {
    const { inputPassword } = setup();
    userEvent.type(inputPassword, '1234567');
    expect(inputPassword.value).toBe('1234567');
    userEvent.clear(inputPassword);
    expect(inputPassword.value).toBe('');
  });

  test('should allow confirm password to be inputted', () => {
    const { inputPassword2 } = setup();
    expect(inputPassword2.value).toBe('');
    userEvent.type(inputPassword2, '1234567');
    expect(inputPassword2.value).toBe('1234567');
  });

  test('should allow confirm password to be deleted', () => {
    const { inputPassword2 } = setup();
    userEvent.type(inputPassword2, '1234567');
    expect(inputPassword2.value).toBe('1234567');
    userEvent.clear(inputPassword2);
    expect(inputPassword2.value).toBe('');
  });
});
