"use client";

import { useState, useCallback } from "react";
import { searchVenues } from "@/lib/actions/fetchVenues";
import Input from "@/components/common/InputField";

interface VenueAutocompleteProps {
  value: string;
  onChange: (venue: string) => void;
  placeholder?: string;
  name?: string;
  id?: string;
}

interface GeoNamesResult {
  geonameId: number;
  name: string;
  countryCode: string;
  population: number;
  lat: number;
  lng: number;
}

export default function VenueAutocomplete({
  value,
  onChange,
  placeholder = "Város keresése...",
  name = "venue",
  id = "venue-autocomplete",
}: VenueAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoNamesResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery);
      setIsSearchMode(true);

      if (searchQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      const result = await searchVenues(searchQuery);

      if (result.success && result.data) {
        setResults(result.data);
        setIsOpen(true);
      }
      setLoading(false);
    },
    []
  );

  const handleSelect = (venueName: string) => {
    onChange(venueName);
    setQuery("");
    setIsSearchMode(false);    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        id={id}
        name={name}
        value={isSearchMode ? query : (value || "")}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 200);
          if (query === "") {
            setIsSearchMode(false);
          }
        }}
        placeholder={placeholder}
      />

      {loading && (
        <div className="absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded-md p-2 text-sm text-gray-500 z-10">
          Keresés...
        </div>
      )}

      {isOpen && results.length > 0 && (
        <ul className="absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
          {results.map((venue) => (
            <li
              key={venue.geonameId}
              onClick={() => handleSelect(venue.name)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {venue.name}
              {venue.countryCode && (
                <span className="text-gray-500 ml-2">({venue.countryCode})</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded-md p-2 text-sm text-gray-500 z-10">
          Nincs találat
        </div>
      )}
    </div>
  );
}
