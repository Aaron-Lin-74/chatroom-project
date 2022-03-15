import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatMessage from './ChatMessage';

const fakeTextMessage = {
  id: '1234abcd',
  text: 'Hello World',
  uid: 'abc123',
  photoURL: 'http://www.fakePhotoURL',
  createdAt: '2020-10-10',
};

const fakePhotoMessage = {
  id: '1234abcd',
  uid: 'abc123',
  photoURL: 'http://www.fakePhotoURL',
  imageURL: 'http://www.fakeImageURL',
  createdAt: '2020-10-10',
};
const fakeScrollDown = jest.fn();

describe('ChatMessage component', () => {
  test('should match the snapshot', () => {
    const { asFragment } = render(
      <ChatMessage message={fakeTextMessage} scrollDown={fakeScrollDown} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the component with text message', () => {
    render(
      <ChatMessage message={fakeTextMessage} scrollDown={fakeScrollDown} />
    );
    screen.getByText(fakeTextMessage.createdAt);
    screen.getByText(fakeTextMessage.text);
    screen.getByAltText('profile');
    screen.getByAltText('profile-modal');
  });

  test('should render the component with image message', () => {
    render(
      <ChatMessage message={fakePhotoMessage} scrollDown={fakeScrollDown} />
    );
    screen.getByText(fakePhotoMessage.createdAt);
    screen.getByAltText('profile');
    screen.getByAltText('profile-modal');
    screen.getByAltText('photoMessage');
    screen.getByAltText('photoMessage-modal');
  });

  test('should open image message modal when click the image message', () => {
    render(
      <ChatMessage message={fakePhotoMessage} scrollDown={fakeScrollDown} />
    );
    userEvent.click(screen.getByAltText('photoMessage'));
    expect(screen.getByTestId('photoMessage-modal')).toHaveStyle(
      'display: block'
    );
  });

  test('should close image message modal when click the × button', () => {
    render(
      <ChatMessage message={fakePhotoMessage} scrollDown={fakeScrollDown} />
    );
    userEvent.click(screen.getByAltText('photoMessage'));
    expect(screen.getByTestId('photoMessage-modal')).toHaveStyle(
      'display: block'
    );
    // The close button for photo message modal, the second x in this component
    userEvent.click(screen.getAllByText('×')[1]);
    expect(screen.getByTestId('photoMessage-modal')).toHaveStyle(
      'display: none'
    );
  });

  test('should open profile modal when click the profile image', () => {
    render(
      <ChatMessage message={fakePhotoMessage} scrollDown={fakeScrollDown} />
    );
    userEvent.click(screen.getByAltText('profile'));
    expect(screen.getByTestId('profile-modal')).toHaveStyle('display: block');
  });

  test('should close profile modal when click the × button', () => {
    render(
      <ChatMessage message={fakePhotoMessage} scrollDown={fakeScrollDown} />
    );
    userEvent.click(screen.getByAltText('profile'));
    expect(screen.getByTestId('profile-modal')).toHaveStyle('display: block');
    // The close button for photo message modal, the first x in this component
    userEvent.click(screen.getAllByText('×')[0]);
    expect(screen.getByTestId('profile-modal')).toHaveStyle('display: none');
  });

  test('should call the scrollDown function when the photo message loaded', () => {
    render(
      <ChatMessage message={fakePhotoMessage} scrollDown={fakeScrollDown} />
    );
    fireEvent.load(screen.getByAltText('photoMessage'));
    expect(fakeScrollDown).toBeCalledTimes(1);
  });
});
