import React, { useState } from "react";
import axios from "axios";

function SafeWalkTime() {
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [error, setError] = useState("");

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const getTemperature = async () => {
    if (!city.trim()) {
      setError("Please enter a city.");
      setTemperature(null);
      setLocationLabel("");
      return;
    }

    try {
      setError("");
      setLocationLabel("");

      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`;

      const geoResponse = await axios.get(geoUrl);

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setError("City not found. Please try again.");
        setTemperature(null);
        setLocationLabel("");
        return;
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=fahrenheit`;

      const weatherResponse = await axios.get(weatherUrl);

      setTemperature(weatherResponse.data.current.temperature_2m);
      setLocationLabel(`${name}, ${country}`);
    } catch (err) {
      setError("Unable to get weather data right now. Please try again.");
      setTemperature(null);
      setLocationLabel("");
    }
  };

  const getWalkAdvice = () => {
    if (temperature === null) return "";

    const roundedTemp = Math.round(temperature);

    if (temperature > 85) {
      return `It is ${roundedTemp}°F. It is too hot to walk your dog safely. Keep it to a quick potty break only.`;
    } else if (temperature >= 75) {
      return `It is ${roundedTemp}°F. Use caution. Keep the walk short and avoid hot pavement.`;
    } else if (temperature < 20) {
      return `It is ${roundedTemp}°F. It is too cold for a full walk. Keep it to a quick potty break only.`;
    } else if (temperature < 32) {
      return `It is ${roundedTemp}°F. Use caution in the cold and watch for signs of discomfort.`;
    } else {
      return `It is ${roundedTemp}°F. This is generally a safe temperature for a walk.`;
    }
  };

  const getImage = () => {
    if (temperature === null) {
      return (
        <img
          src="./images/ask.gif"
          alt="Dog waiting for weather check"
        />
      );
    }

    if (temperature > 85) {
      return (
        <img
          src="./images/hot.gif"
          alt="Dog is too hot"
        />
      );
    }

    if (temperature < 20) {
      return (
        <img
          src="./images/cold.gif"
          alt="Dog is too cold"
          width="350"
          height="350"
        />
      );
    }

    return (
      <img
        src="./images/walk.gif"
        alt="Dog is okay for a walk"
      />
    );
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getTemperature();
        }}
      >
        <label htmlFor="city">Enter city:</label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={handleCityChange}
        />
        <button type="submit" className="buttonTemperature">
          Get Temperature
        </button>
      </form>

      {error && <p>{error}</p>}

      <div>
        {getImage()}

        {temperature !== null ? (
          <div>
            {locationLabel && <p>{locationLabel}</p>}
            <p>{getWalkAdvice()}</p>
          </div>
        ) : (
          <p>Please enter a city and click the button to get the current temperature.</p>
        )}
      </div>
    </div>
  );
}

export default SafeWalkTime;
