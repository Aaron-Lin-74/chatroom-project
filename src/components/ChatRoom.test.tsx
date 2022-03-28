import { screen, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatRoom from './ChatRoom';
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '../firebase';

describe('ChatRoom component', () => {
  beforeEach(async () => {
    await enableNetwork(db);
  });

  afterEach(async () => {
    await disableNetwork(db);
  });

  test('should match the snapshot', () => {
    const { asFragment } = render(<ChatRoom />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the component', () => {
    render(<ChatRoom />);
    screen.getByText(/show more/i);
  });

  test('should hide the span of show more when click it', () => {
    render(<ChatRoom />);
    fireEvent.scroll(screen.getByRole('main'), { target: { scrollY: 0 } });
    const spanElement = screen.getByText(/show more/i);
    fireEvent.click(spanElement);
    expect(spanElement).toHaveStyle('display: none');
  });

  test('should show the span of show more when scroll top', () => {
    render(<ChatRoom />);
    const spanElement = screen.getByText(/show more/i);
    fireEvent.click(spanElement);
    expect(spanElement).toHaveStyle('display: none');
    fireEvent.scroll(screen.getByRole('main'), {
      target: { scrollY: 0 },
    });
    expect(spanElement).toHaveStyle('display: block');
  });
});
