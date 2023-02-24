import React, { useState, useEffect } from 'react';
import axios from "axios";

function SafeWalkTime() {
    const [city, setCity] = useState('');
    const [temperature, setTemperature] = useState(null);
  
    const handleCityChange = (event) => {
      setCity(event.target.value);
    }; 
  
    const handleTemperatureResponse = (response) => {
      setTemperature(response.data.main.temp);
    };
  
    const handleTemperatureError = (error) => {
      console.log(error);
    };
  
    const getTemperature = () => {
      const apiKey = '09e17948a820fd836c62a5a99739be66';
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
      axios.get(apiUrl)
        .then(handleTemperatureResponse)
        .catch(handleTemperatureError);
    };
    
    const temperatureInCelsius = 20;
    const temperatureInFahrenheit = Math.round((temperature * 9/5) + 32);

    const getSafeWalkTime = (dogSize) => {
      let safeTime = null;
  
      if (temperature > 26.6) {
        // Too hot
        safeTime = `It is ${temperatureInFahrenheit}°F degrees. It\'s too hot to walk your dog!`;
      } else if (temperature < 0) {
        // Too cold
        safeTime = `It is ${temperatureInFahrenheit}°F degrees. It\'s too cold to walk your dog!`;
      } else {
        // Safe temperature
        if (dogSize === 'small') {
          safeTime = temperature <= 0 ? 15 : (temperature <= 4.4 ? 20 : 30);
        } else if (dogSize === 'medium' || dogSize === 'large') {
          safeTime = 30;
        }
        safeTime = `It is ${temperatureInFahrenheit}°F degrees. Your dog can safely go for a walk for up to ${safeTime} minutes.`;
      }
  
      return safeTime;
    };
  
    let image = <img src="./images/ask.gif" alt="dog with question marks around it"/>;
  
    if (temperature > 26.6) {
      // Too hot
      image = <img src="./images/hot.gif" alt="dog is too hot"/>;
    } else if (temperature < 0) {
      // Too cold
      image = <img src="./images/cold.gif" alt="dog is too cold" weight="350px" height="350px" />;
    } else if (temperature !== null){
      // Safe temperature
      image = <img src="./images/walk.gif" alt="dog is okay" />;
    }
  
    return (
      <div>
        <form onSubmit={e => {
  e.preventDefault();
  getTemperature();}}>
          <label>
            Enter city:
            <input type="text" value={city} onChange={handleCityChange} />
          </label>
          <button type="button" className='buttonTemperature' onClick={getTemperature}>Get Temperature</button>
        </form>
        {temperature ? (
          <div>
            {image}
            <p>{getSafeWalkTime('medium')}</p>
          </div>
        ) : (
          <div>
          {image}
          <p>Please enter a city and click the button to get the current temperature.</p>
          </div>
        )}
      </div>
    );
  }

export default SafeWalkTime;