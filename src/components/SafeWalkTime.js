import React, { useState } from "react";
import axios from "axios";

function SafeWalkTime() {
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [error, setError] = useState("");
  const [dogSize, setDogSize] = useState("small");

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleDogSizeChange = (event) => {
    setDogSize(event.target.value);
  };

  const isCityLikeResult = (result, userInput) => {
    if (!result) return false;

    const input = userInput.trim().toLowerCase();
    const name = (result.name || "").trim().toLowerCase();
    const admin1 = (result.admin1 || "").trim().toLowerCase();
    const featureCode = result.feature_code || "";

    const allowedFeatureCodes = [
      "PPL",
      "PPLA",
      "PPLA2",
      "PPLA3",
      "PPLA4",
      "PPLC",
      "PPLG",
      "PPLX",
      "PPLL",
      "PPLS"
    ];

    const looksLikeBroadRegion =
      input === admin1 ||
      featureCode.startsWith("ADM") ||
      featureCode === "CONT" ||
      featureCode === "RGN";

    return allowedFeatureCodes.includes(featureCode) && !looksLikeBroadRegion && name.length > 0;
  };

  const getTemperature = async () => {
    if (!city.trim()) {
      setError("Please enter a city.");
      setTemperature(null);
      setLocationLabel("");
      return;
    }

    try {
      setError("Loading weather...");
      setTemperature(null);
      setLocationLabel("");

      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=5&language=en&format=json`;

      const geoResponse = await axios.get(geoUrl);
      const results = geoResponse.data.results || [];

      if (results.length === 0) {
        setError("City not found. Please try a nearby city or town.");
        return;
      }

      const bestCityMatch = results.find((result) =>
        isCityLikeResult(result, city)
      );

      if (!bestCityMatch) {
        setError("Please enter a city or town, not a state, region, or park.");
        return;
      }

      const { latitude, longitude, name, country, admin1 } = bestCityMatch;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=fahrenheit`;

      const weatherResponse = await axios.get(weatherUrl);
      const currentTemp = weatherResponse.data.current.temperature_2m;

      setTemperature(currentTemp);
      setLocationLabel(
        admin1 ? `${name}, ${admin1}, ${country}` : `${name}, ${country}`
      );
      setError("");
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
      return `It is ${roundedTemp}°F. It is too hot to safely walk your dog. Keep it to a quick potty break only.`;
    }

    if (temperature >= 75) {
      return `It is ${roundedTemp}°F. Use caution. Keep the walk short and avoid hot pavement.`;
    }

    if (temperature < 20) {
      return `It is ${roundedTemp}°F. It is too cold for a full walk. Keep it to a quick potty break only.`;
    }

    if (temperature < 32) {
      return `It is ${roundedTemp}°F. Use caution in the cold and watch for signs of discomfort.`;
    }

    if (dogSize === "small" && temperature < 45) {
      return `It is ${roundedTemp}°F. This may feel chilly for a small dog, so use caution and monitor your dog closely.`;
    }

    return `It is ${roundedTemp}°F. This is generally a safe temperature for a walk.`;
  };

  const getImage = () => {
    if (temperature === null) {
      return <img src="./images/ask.gif" alt="Dog waiting for weather check" />;
    }

    if (temperature > 85) {
      return <img src="./images/hot.gif" alt="Dog is too hot" />;
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

    return <img src="./images/walk.gif" alt="Dog is okay for a walk" />;
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getTemperature();
        }}
      >
        <label htmlFor="dogSize">Size:</label>
        <select id="dogSize" value={dogSize} onChange={handleDogSizeChange}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <br />

        <label htmlFor="city">Enter city:</label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="e.g. New York City"
        />

        <button type="submit" className="buttonTemperature">
          Get Temperature
        </button>
      </form>

      <div>
        {getImage()}

        {error && <p>{error}</p>}

        {temperature !== null && (
          <div>
            {locationLabel && <p>{locationLabel}</p>}
            <p>{getWalkAdvice()}</p>
          </div>
        )}

        {temperature === null && !error && (
          <p>Please enter a city and click the button to get the current temperature.</p>
        )}
      </div>
    </div>
  );
}

export default SafeWalkTime;
