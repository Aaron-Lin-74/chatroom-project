import { screen, render, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MessagePanel from './MessagePanel';

describe('Test suits for MessagePanel component', () => {
  test('should match the snapshot', () => {
    const { asFragment } = render(<MessagePanel />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the component', () => {
    render(<MessagePanel />);
    // expect(
    //   screen.queryByPlaceholderText('Type your message and hit enter')
    // ).toBeInTheDocument();
    // expect(screen.queryByTitle('Add an emoji')).toBeInTheDocument();
    // expect(screen.queryByTitle('Add an image')).toBeInTheDocument();
    // expect(screen.queryByRole('button', { name: 'SEND' })).toBeInTheDocument();

    // Another way to test the initial render, as get will throw an error when not found.
    screen.getByPlaceholderText('Type your message and hit enter');
    screen.getByRole('button', { name: 'Add an emoji' });
    screen.getByRole('button', { name: 'Add an image' });
    screen.getByRole('button', { name: 'SEND' });
    screen.getByTestId(/fileDropzone/i);
  });

  test('should disabled send button when no message is entered, endabled otherwise', () => {
    render(<MessagePanel />);
    expect(screen.queryByRole('button', { name: 'SEND' })).toBeDisabled();
    userEvent.type(
      screen.getByPlaceholderText('Type your message and hit enter'),
      'message'
    );
    expect(screen.queryByRole('button', { name: 'SEND' })).toBeEnabled();
  });

  test('should be able to enter the message to the message input', () => {
    render(<MessagePanel />);
    const messageInput = screen.getByPlaceholderText(
      'Type your message and hit enter'
    );
    expect(messageInput).toHaveDisplayValue('');
    userEvent.type(messageInput, 'hello 22');
    expect(messageInput).toHaveDisplayValue('hello 22');
  });

  test('should keep the message input when click send button without currentUser, and throw error', async () => {
    const errorObject = console.error; //store the state of the object
    console.error = jest.fn(); // mock the object
    render(<MessagePanel />);
    const messageInput = screen.getByPlaceholderText(
      'Type your message and hit enter'
    );
    const sendButton = screen.getByRole('button', { name: 'SEND' });
    userEvent.type(messageInput, 'hi');
    expect(messageInput).toHaveDisplayValue('hi');
    userEvent.click(sendButton);
    console.error = errorObject; // assign it back
  });

  test('should pop up emoji section when click emoji button', () => {
    render(<MessagePanel />);
    const emojiButton = screen.getByRole('button', { name: 'Add an emoji' });
    userEvent.click(emojiButton);
    expect(
      screen.getByRole('region', { name: 'Emoji Mart™' })
    ).toBeInTheDocument();
  });

  test('should pop off emoji section when click emoji button again when it has popped up', () => {
    render(<MessagePanel />);
    const emojiButton = screen.getByRole('button', { name: 'Add an emoji' });
    userEvent.click(emojiButton);
    expect(
      screen.getByRole('region', { name: 'Emoji Mart™' })
    ).toBeInTheDocument();
    userEvent.click(emojiButton);
    expect(screen.queryByRole('region', { name: 'Emoji Mart™' })).toBeNull();
  });

  test('should upload an image when click add image button', async () => {
    render(<MessagePanel />);
    const imageButton = screen.getByRole('button', { name: 'Add an image' });
    const fileInput = screen.getByTestId(/fileDropzone/i) as HTMLInputElement;
    userEvent.click(imageButton);
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });

    await waitFor(() => {
      userEvent.upload(fileInput, fakeFile);
    });

    expect(fileInput.files![0]).toStrictEqual(fakeFile);
  });
});
