import React, { useState } from "react";
import axios from "axios";

function SafeWalkTime() {
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [error, setError] = useState("");

  const getTemperature = async () => {
    if (!city.trim()) {
      setError("Please enter a city.");
      setTemperature(null);
      return;
    }

    try {
      setError("");

      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
      const geoResponse = await axios.get(geoUrl);

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setError("City not found.");
        setTemperature(null);
        return;
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=fahrenheit`;
      const weatherResponse = await axios.get(weatherUrl);

      setTemperature(weatherResponse.data.current.temperature_2m);
      setError(`${name}, ${country}`);
    } catch (err) {
      setError("Unable to get weather data right now.");
      setTemperature(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={getTemperature}>Get Temperature</button>

      {error && <p>{error}</p>}
      {temperature !== null && <p>Current temperature: {Math.round(temperature)}°F</p>}
    </div>
  );
}

export default SafeWalkTime;
