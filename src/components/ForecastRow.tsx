import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Droplets, Wind, ChevronDown, ChevronUp } from "lucide-react";
import { ProcessedDailyForecast } from "../types";
import { formatTemp, getWeatherDescription } from "../lib/weather";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ForecastRowProps {
  forecast: ProcessedDailyForecast[];
  unit: "C" | "F";
}

export function ForecastRow({ forecast, unit }: ForecastRowProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full mt-10">
      <h3 className="text-xl font-semibold mb-4 text-[var(--text-color)]">7-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {forecast.map((day, index) => {
          const { icon, label } = getWeatherDescription(day.weather_code);
          const date = parseISO(day.date);
          const isExpanded = expandedIndex === index;

          return (
            <button
              key={day.date}
              onClick={() => toggleExpand(index)}
              className={cn(
                "flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer",
                isExpanded
                  ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500/20 shadow-md"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] hover:border-gray-300 hover:shadow-sm"
              )}
            >
              <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">
                {index === 0 ? "Today" : format(date, "EEE")}
              </div>
              <div className="text-xs text-gray-400 mb-3">{format(date, "MMM d")}</div>
              
              <div className="text-3xl mb-3" role="img" aria-label={label} title={label}>
                {icon}
              </div>
              
              <div className="flex items-center gap-3 w-full justify-center">
                <span className="font-semibold text-[var(--text-color)] text-lg">
                  {formatTemp(day.temperature_max, unit)}
                </span>
                <span className="text-gray-400 font-medium">
                  {formatTemp(day.temperature_min, unit)}
                </span>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full mt-4 pt-4 border-t border-blue-100 overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-blue-500" />
                          <span>Precip</span>
                        </div>
                        <span className="font-medium text-gray-900">{day.precipitation_sum}mm</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Wind className="w-3.5 h-3.5 text-gray-400" />
                          <span>Wind</span>
                        </div>
                        <span className="font-medium text-gray-900">{Math.round(day.wind_speed_max)}km/h</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-2 text-gray-300">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
