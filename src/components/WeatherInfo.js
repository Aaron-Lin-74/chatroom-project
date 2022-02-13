import React, { useState, useEffect } from 'react'

function WeatherInfo() {
  const [weatherData, setWeatherData] = useState()
  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeather, showError)
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    }

    getLocation()
  }, [])

  // Fetch weather data from third-party API after getting the location info
  function fetchWeather(position) {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    fetch(`https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data)
      })
      .catch((err) => console.log(err))
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request for Geolocation.')
        break
      case error.POSITION_UNAVAILABLE:
        console.log('Location information is unavailable.')
        break
      case error.TIMEOUT:
        console.log('The request to get user location timed out.')
        break
      case error.UNKNOWN_ERROR:
        console.log('An unknown error occurred.')
        break
      default:
        return
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
          <span>{`${parseInt(weatherData.main.temp_min)}\u00B0C - ${parseInt(
            weatherData.main.temp_max
          )} \u00B0C`}</span>
        </div>
      </div>
    )
  } else {
    return <h1>💬Chat Room</h1>
  }
}

export default WeatherInfo
