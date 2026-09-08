import { Search, MapPin } from "lucide-react";
import { useState, FormEvent } from "react";
import { GeocodingResult } from "../types";
import { cn } from "../lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelect: (result: GeocodingResult) => void;
  results: GeocodingResult[];
  isLoading: boolean;
  error: string | null;
}

export function SearchBar({ onSearch, onSelect, results, isLoading, error }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative z-50">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden text-gray-900">
          <ul className="divide-y divide-gray-100">
            {results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    onSelect(result);
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 flex items-start space-x-3 transition-colors focus:bg-gray-50 focus:outline-none"
                >
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-500">
                      {[result.admin1, result.country].filter(Boolean).join(", ")}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
