import { GeocodingResponse, WeatherResponse } from "../types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCity(query: string): Promise<GeocodingResponse> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.append("name", query);
  url.searchParams.append("count", "5");
  url.searchParams.append("language", "en");
  url.searchParams.append("format", "json");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch geocoding data");
  }
  return response.json();
}

export async function getWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherResponse> {
  const url = new URL(FORECAST_URL);
  url.searchParams.append("latitude", latitude.toString());
  url.searchParams.append("longitude", longitude.toString());
  url.searchParams.append(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m"
  );
  url.searchParams.append(
    "hourly",
    "temperature_2m,weather_code"
  );
  url.searchParams.append(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max"
  );
  url.searchParams.append("timezone", "auto");

  const aqiUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  aqiUrl.searchParams.append("latitude", latitude.toString());
  aqiUrl.searchParams.append("longitude", longitude.toString());
  aqiUrl.searchParams.append("current", "us_aqi");
  aqiUrl.searchParams.append("timezone", "auto");

  const [weatherRes, aqiRes] = await Promise.all([
    fetch(url.toString()),
    fetch(aqiUrl.toString()).catch(() => null)
  ]);

  if (!weatherRes.ok) {
    throw new Error("Failed to fetch weather data");
  }
  
  const weatherData = await weatherRes.json();
  
  if (aqiRes && aqiRes.ok) {
    try {
      const aqiData = await aqiRes.json();
      weatherData.current.aqi = aqiData.current?.us_aqi;
    } catch (e) {
      // Ignore parsing errors for AQI
    }
  }

  return weatherData;
}
