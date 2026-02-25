"use server";

import { ActionResult } from "@/types/result";

interface GeoNamesResult {
  geonameId: number;
  name: string;
  countryCode: string;
  population: number;
  lat: number;
  lng: number;
}

/**
 * Searches for venues (populated places) using the GeoNames API.
 *
 * This server action queries the GeoNames `searchJSON` endpoint for places whose
 * names start with the provided query string. Results are limited to populated
 * places (`featureClass=P`) and capped at 10 entries.
 *
 * If the query is shorter than 2 characters, the function returns a successful
 * empty result without calling the external API.
 *
 * @param query - The search term used to look up venues by name. Must be at
 *   least 2 characters long to trigger an API request.
 *
 * @returns A promise that resolves to a {@link Result} containing:
 * - `success: true` and `data` as an array of {@link GeoNamesResult} when the
 *   request succeeds (an empty array if no matches are found or the query is
 *   too short), or
 * - `success: false` and an `error` message when the request fails.
 *
 * The GeoNames username is read from the `NEXT_PUBLIC_GEONAMES_USERNAME`
 * environment variable.
 *
 * @example
 * ```ts
 * import { searchVenues } from "@/lib/actions/fetchVenues";
 *
 * const result = await searchVenues("Lon");
 *
 * if (result.success && result.data) {
 *   result.data.forEach((venue) => {
 *     console.log(venue.name, venue.countryCode, venue.population);
 *   });
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export const searchVenues = async (
  query: string
): Promise<ActionResult<GeoNamesResult[]>> => {
  if (!query || query.length < 2) {
    return { success: true, data: [] };
  }

  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?name_startsWith=${encodeURIComponent(query)}&featureClass=P&maxRows=10&username=${process.env.NEXT_PUBLIC_GEONAMES_USERNAME}`
    );

    if (!response.ok) {
      throw new Error("GeoNames API error");
    }

    const data = await response.json();
    return { success: true, data: data.geonames || [] };
  } catch (error) {
    console.error("Error searching venues:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to search venues",
    };
  }
};