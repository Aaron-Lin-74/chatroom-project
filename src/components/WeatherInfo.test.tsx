import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import WeatherInfo from './WeatherInfo';

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
  const errorObject = console.error;
  const logObject = console.log;
  beforeEach(() => {
    console.error = jest.fn();
    console.log = jest.fn();
  });
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    console.error = errorObject;
    console.log = logObject;
  });
  afterAll(() => server.close());
  test('should match the snapshot', () => {
    const { asFragment } = render(<WeatherInfo />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render the component with h1 by default when Geolocation is not on', () => {
    render(<WeatherInfo />);
    expect(screen.queryByText(/Chat Room/)).toBeInTheDocument();
  });

  test('should render the weather data when Geolocation is enabled', async () => {
    const { getCurrentPositionMock } = mockNavigatorGeolocation();
    getCurrentPositionMock.mockImplementation((success) =>
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
