import React, { useState, useEffect } from 'react';
import { WeatherType } from '../types/weather';

function WeatherInfo() {
  const [weatherData, setWeatherData] = useState<WeatherType>();
  useEffect(() => {
    function getLocation(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeather, showError);
      } else {
        console.log('Geolocation is not supported by this browser.');
      }
    }

    getLocation();
  }, []);

  /** Fetch weather data from third-party API, and update the state */
  function fetchWeather(position: GeolocationPosition): void {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetch(`https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((err) => console.log(err));
  }

  function showError(error: GeolocationPositionError): void {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        console.log('The request to get user location timed out.');
        break;
      default:
        console.log('An unknown error occurred.');
        return;
    }
  }

  if (weatherData) {
    return (
      <div className='weather-container'>
        <h2>{weatherData.name}</h2>
        <div className='weather-info'>
          <div className='weather-img-wrapper'>
            <img
              src={weatherData.weather[0].icon}
              alt={weatherData.weather[0].description}
            />
          </div>
          <span>{`${weatherData.main.temp_min.toFixed()}\u00B0C - ${weatherData.main.temp_max.toFixed()} \u00B0C`}</span>
        </div>
      </div>
    );
  } else {
    return <h1>💬Chat Room</h1>;
  }
}

export default WeatherInfo;
