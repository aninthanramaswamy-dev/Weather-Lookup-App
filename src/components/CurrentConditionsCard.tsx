import { format } from "date-fns";
import { Droplets, Wind, MapPin, Activity } from "lucide-react";
import { CurrentWeather, HourlyWeather, GeocodingResult } from "../types";
import { formatTemp, getWeatherDescription } from "../lib/weather";
import { cn } from "../lib/utils";

interface CurrentConditionsCardProps {
  current: CurrentWeather;
  hourly: HourlyWeather;
  utcOffset: number;
  location: GeocodingResult;
  unit: "C" | "F";
}

export function CurrentConditionsCard({ current, hourly, utcOffset, location, unit }: CurrentConditionsCardProps) {
  const { icon, label } = getWeatherDescription(current.weather_code);

  // Calculate local time for the city
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const localCityTime = new Date(utcTime + utcOffset * 1000);
  const timeString = format(localCityTime, "h:mm a");

  // Get next 4 hours of forecast
  const currentHourPrefix = current.time.slice(0, 13); // e.g., "YYYY-MM-DDTHH"
  let startIndex = hourly.time.findIndex(t => t.startsWith(currentHourPrefix));
  if (startIndex === -1) startIndex = 0;

  const nextHours = [];
  // Skip the current hour and take the next 12
  for (let i = 1; i <= 12; i++) {
    const idx = startIndex + i;
    if (idx < hourly.time.length) {
      nextHours.push({
        time: hourly.time[idx],
        temp: hourly.temperature_2m[idx],
        code: hourly.weather_code[idx]
      });
    }
  }

  return (
    <div className="w-full bg-[var(--card-bg)] rounded-3xl p-8 shadow-sm border border-[var(--card-border)] backdrop-blur-sm transition-all duration-500">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
          <div className="flex items-center text-gray-500 mb-2 gap-1.5">
            <MapPin className="w-4 h-4" />
            <h2 className="text-lg font-medium tracking-wide">
              {location.name}, {location.admin1 ? `${location.admin1}, ` : ""}{location.country}
            </h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Local time: {timeString}
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-12 w-full justify-center lg:justify-between">
            <div className="flex items-center gap-6 shrink-0">
              <span className="text-7xl" role="img" aria-label={label}>
                {icon}
              </span>
              <div>
                <div className="text-6xl font-semibold tracking-tighter text-[var(--text-color)]">
                  {formatTemp(current.temperature_2m, unit)}
                </div>
                <div className="text-xl text-gray-500 font-medium mt-1">
                  {label}
                </div>
              </div>
            </div>

            {nextHours.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-x-3 gap-y-5 md:ml-4 md:pl-8 md:border-l border-gray-200/60 w-full flex-1 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 justify-items-center">
                {nextHours.map((hour, idx) => {
                  const hIcon = getWeatherDescription(hour.code).icon;
                  const hourInt = parseInt(hour.time.substring(11, 13), 10);
                  const ampm = hourInt >= 12 ? 'PM' : 'AM';
                  const displayHour = hourInt % 12 || 12;
                  
                  return (
                    <div key={idx} className="flex flex-col items-center justify-center">
                      <span className="text-xs font-medium text-gray-500 mb-1.5 whitespace-nowrap">{displayHour} {ampm}</span>
                      <span className="text-xl mb-1.5">{hIcon}</span>
                      <span className="text-sm font-semibold text-[var(--text-color)]">{formatTemp(hour.temp, unit)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8 lg:flex-col items-center lg:items-end w-full lg:w-auto mt-6 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8">
          <div className="flex flex-col items-center lg:items-end">
            <span className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Feels Like</span>
            <span className="text-2xl font-semibold text-[var(--text-color)]">
              {formatTemp(current.apparent_temperature, unit)}
            </span>
          </div>
          
          <div className="flex flex-col items-center lg:items-end">
            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">
              <Droplets className="w-4 h-4" />
              Humidity
            </div>
            <span className="text-2xl font-semibold text-[var(--text-color)]">
              {current.relative_humidity_2m}%
            </span>
          </div>
          
          <div className="flex flex-col items-center lg:items-end">
            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">
              <Wind className="w-4 h-4" />
              Wind
            </div>
            <span className="text-2xl font-semibold text-[var(--text-color)]">
              {current.wind_speed_10m} km/h
            </span>
          </div>
          
          <div className="flex flex-col items-center lg:items-end">
            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              AQI
            </div>
            <span className="text-2xl font-semibold text-[var(--text-color)]">
              {current.aqi ?? "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
