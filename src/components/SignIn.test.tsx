import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '../firebase';
import SignIn from './SignIn';

describe('Test suite for SignIn component', () => {
  beforeEach(async () => {
    await enableNetwork(db);
  });

  afterEach(async () => {
    await disableNetwork(db);
  });

  const setup = () => {
    jest.useFakeTimers();
    const mockToggleSignIn = jest.fn();
    const mockSignInWithEmailAndPassword = jest
      .fn()
      .mockRejectedValue(new Error('Mock Error Message'));
    const mockSignInWithGoogle = jest.fn();
    const utils = render(
      <SignIn
        toggleSignIn={mockToggleSignIn}
        signInWithEmailAndPassword={mockSignInWithEmailAndPassword}
        signInWithGoogle={mockSignInWithGoogle}
      />
    );
    const inputEmail = utils.getByLabelText('Email') as HTMLInputElement;
    const inputPassword = utils.getByLabelText('Password') as HTMLInputElement;
    const spanToggle = utils.getByText('sign up');
    const buttons = utils.getAllByRole('button');
    const signInButton = utils.getByRole('button', { name: /Sign In/ });
    const signInWithGoogleButton = utils.getByRole('button', {
      name: /Sign in with Google/,
    });
    return {
      inputEmail,
      inputPassword,
      spanToggle,
      buttons,
      signInButton,
      signInWithGoogleButton,
      mockSignInWithEmailAndPassword,
      ...utils,
    };
  };

  test('should match the snapshot', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the component', () => {
    const {
      inputEmail,
      inputPassword,
      spanToggle,
      buttons,
      signInButton,
      signInWithGoogleButton,
    } = setup();
    expect(screen.getByText(/Do not have an account?/)).toBeInTheDocument();
    expect(buttons).toHaveLength(3);
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveTextContent('Sign In');
    expect(signInWithGoogleButton).toBeInTheDocument();
    // // expect(signInWithGoogleButton.textContent).toBe('Sign in with Google');
    expect(signInWithGoogleButton).toHaveTextContent('Sign in with Google');
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe('');
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.value).toBe('');
    expect(spanToggle).toBeInTheDocument();
  });

  test('should inputs have required attribute', () => {
    const { inputEmail, inputPassword } = setup();
    expect(inputEmail).toBeRequired();
    expect(inputPassword).toBeRequired();
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
});
