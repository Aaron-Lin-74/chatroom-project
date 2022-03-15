import WeatherInfo from './WeatherInfo';
import { screen, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

const server = setupServer(
  rest.get('https://fcc-weather-api.glitch.me/api/current', (req, res, ctx) => {
    return res(
      ctx.json({
        name: 'City',
        weather: [{ icon: 'url for icon', description: 'weather description' }],
        main: { temp_min: 10, temp_max: 30 },
      })
    );
  })
);

// beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockNavigatorGeolocation = () => {
  const clearWatchMock = jest.fn();
  const getCurrentPositionMock = jest.fn();
  const watchPositionMock = jest.fn();

  const geolocation = {
    clearWatch: clearWatchMock,
    getCurrentPosition: getCurrentPositionMock,
    watchPosition: watchPositionMock,
  };

  Object.defineProperty(global.navigator, 'geolocation', {
    value: geolocation,
    configurable: true,
  });

  return { clearWatchMock, getCurrentPositionMock, watchPositionMock };
};

describe('Test suites for WeatherInfo component', () => {
  test('should match the snapshot', () => {
    const { asFragment } = render(<WeatherInfo />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the component with h1 by default when Geolocation is not on', () => {
    const errorObject = console.log; //store the state of the object
    console.log = jest.fn(); // mock the object
    render(<WeatherInfo />);
    expect(screen.queryByText(/Chat Room/)).toBeInTheDocument();
    console.log = errorObject; // assign it back
  });

  test('should render the weather data when Geolocation is enabled', async () => {
    const { getCurrentPositionMock } = mockNavigatorGeolocation();
    getCurrentPositionMock.mockImplementation((success, rejected) =>
      success({
        coords: {
          latitude: 51.1,
          longitude: 45.3,
        },
      })
    );
    render(<WeatherInfo />);

    expect(await screen.findByRole('img')).toBeInTheDocument();
    expect(await screen.findByText('City')).toBeInTheDocument();
    expect(await screen.findByText('10°C - 30 °C')).toBeInTheDocument();
  });
});
