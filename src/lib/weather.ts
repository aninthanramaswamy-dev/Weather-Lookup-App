export function getWeatherDescription(code: number): {
  label: string;
  icon: string;
  themeClass: string;
} {
  switch (code) {
    case 0:
      return { label: "Clear sky", icon: "☀️", themeClass: "theme-clear" };
    case 1:
      return { label: "Mainly clear", icon: "🌤️", themeClass: "theme-clear" };
    case 2:
      return { label: "Partly cloudy", icon: "⛅", themeClass: "theme-cloudy" };
    case 3:
      return { label: "Overcast", icon: "☁️", themeClass: "theme-cloudy" };
    case 45:
    case 48:
      return { label: "Fog", icon: "🌫️", themeClass: "theme-fog" };
    case 51:
    case 53:
    case 55:
      return { label: "Drizzle", icon: "🌦️", themeClass: "theme-rain" };
    case 56:
    case 57:
      return { label: "Freezing Drizzle", icon: "🌧️", themeClass: "theme-rain" };
    case 61:
    case 63:
    case 65:
      return { label: "Rain", icon: "🌧️", themeClass: "theme-rain" };
    case 66:
    case 67:
      return { label: "Freezing Rain", icon: "🌧️", themeClass: "theme-rain" };
    case 71:
    case 73:
    case 75:
      return { label: "Snow fall", icon: "❄️", themeClass: "theme-snow" };
    case 77:
      return { label: "Snow grains", icon: "❄️", themeClass: "theme-snow" };
    case 80:
    case 81:
    case 82:
      return { label: "Rain showers", icon: "🌦️", themeClass: "theme-rain" };
    case 85:
    case 86:
      return { label: "Snow showers", icon: "❄️", themeClass: "theme-snow" };
    case 95:
      return { label: "Thunderstorm", icon: "⛈️", themeClass: "theme-thunder" };
    case 96:
    case 99:
      return { label: "Thunderstorm with hail", icon: "⛈️", themeClass: "theme-thunder" };
    default:
      return { label: "Unknown", icon: "❓", themeClass: "theme-default" };
  }
}

export function convertCelsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(temp: number, unit: "C" | "F"): string {
  const t = unit === "C" ? temp : convertCelsiusToFahrenheit(temp);
  return `${Math.round(t)}°${unit}`;
}
