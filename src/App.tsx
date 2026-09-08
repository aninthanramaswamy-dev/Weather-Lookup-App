/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { CurrentConditionsCard } from "./components/CurrentConditionsCard";
import { ForecastRow } from "./components/ForecastRow";
import { Charts } from "./components/Charts";
import { searchCity, getWeatherData } from "./lib/api";
import { GeocodingResult, ProcessedDailyForecast, WeatherResponse } from "./types";
import { getWeatherDescription } from "./lib/weather";
import { Loader2 } from "lucide-react";

export default function App() {
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [location, setLocation] = useState<GeocodingResult | null>(null);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for last searched city
    const savedLocation = localStorage.getItem("lastLocation");
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        handleLocationSelect(parsed);
      } catch (e) {
        // ignore parse error
      }
    } else {
      // Default to New York
      handleSearch("New York");
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) return;
    
    setIsSearching(true);
    setError(null);
    setSearchResults([]);
    
    try {
      const data = await searchCity(query);
      if (data.results && data.results.length > 0) {
        if (data.results.length === 1) {
          handleLocationSelect(data.results[0]);
        } else {
          setSearchResults(data.results);
        }
      } else {
        setError(`City "${query}" not found. Please try another name.`);
      }
    } catch (err) {
      setError("Failed to search for city. Please check your network and try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = async (loc: GeocodingResult) => {
    setLocation(loc);
    setSearchResults([]);
    setIsFetchingWeather(true);
    setError(null);
    
    try {
      const weather = await getWeatherData(loc.latitude, loc.longitude);
      setWeatherData(weather);
      localStorage.setItem("lastLocation", JSON.stringify(loc));
    } catch (err) {
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  // Process daily forecast
  let processedForecast: ProcessedDailyForecast[] = [];
  if (weatherData && weatherData.daily) {
    const { daily } = weatherData;
    processedForecast = daily.time.map((time, index) => ({
      date: time,
      weather_code: daily.weather_code[index],
      temperature_max: daily.temperature_2m_max[index],
      temperature_min: daily.temperature_2m_min[index],
      precipitation_sum: daily.precipitation_sum[index],
      wind_speed_max: daily.wind_speed_10m_max[index],
    }));
  }

  // Determine current theme class
  const currentTheme = weatherData?.current 
    ? getWeatherDescription(weatherData.current.weather_code).themeClass 
    : "theme-default";

  return (
    <div className={`min-h-screen ${currentTheme} transition-colors duration-700 ease-in-out pb-20`}>
      <div className="max-w-6xl mx-auto px-4 pt-12 md:pt-20">
        
        <header className="flex flex-col items-center mb-12 relative z-20">
          <div className="w-full flex justify-end mb-4">
            <div className="bg-white/80 backdrop-blur-md p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
              <button
                onClick={() => setUnit("C")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  unit === "C" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit("F")}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  unit === "F" ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                °F
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-[var(--text-color)] mb-8">
            Weather Intelligence
          </h1>
          
          <SearchBar 
            onSearch={handleSearch} 
            onSelect={handleLocationSelect}
            results={searchResults}
            isLoading={isSearching}
            error={error}
          />
        </header>

        <main className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {isFetchingWeather ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
              <p className="font-medium animate-pulse">Loading latest weather data...</p>
            </div>
          ) : weatherData && location ? (
            <>
              <CurrentConditionsCard 
                current={weatherData.current}
                hourly={weatherData.hourly}
                utcOffset={weatherData.utc_offset_seconds}
                location={location}
                unit={unit}
              />
              
              <ForecastRow 
                forecast={processedForecast}
                unit={unit}
              />
              
              <Charts 
                forecast={processedForecast}
                unit={unit}
              />
            </>
          ) : !isSearching && !error ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">Search for a city to see the weather forecast.</p>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

