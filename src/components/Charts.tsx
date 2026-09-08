import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ProcessedDailyForecast } from "../types";
import { convertCelsiusToFahrenheit } from "../lib/weather";

interface ChartsProps {
  forecast: ProcessedDailyForecast[];
  unit: "C" | "F";
}

export function Charts({ forecast, unit }: ChartsProps) {
  const chartData = forecast.map((day) => ({
    name: format(parseISO(day.date), "EEE"),
    max: unit === "C" ? day.temperature_max : Math.round(convertCelsiusToFahrenheit(day.temperature_max)),
    min: unit === "C" ? day.temperature_min : Math.round(convertCelsiusToFahrenheit(day.temperature_min)),
    precipitation: day.precipitation_sum,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm" style={{ color: entry.color }}>
              <span className="font-medium capitalize">{entry.name}:</span>
              <span>{entry.value}{entry.name === 'precipitation' ? 'mm' : `°${unit}`}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--card-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-[var(--text-color)]">Temperature Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `${value}°`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="max"
                name="High"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="min"
                name="Low"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] p-6 rounded-3xl border border-[var(--card-border)] shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-[var(--text-color)]">Precipitation</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `${value}mm`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="precipitation" 
                name="Precipitation" 
                fill="#60a5fa" 
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
