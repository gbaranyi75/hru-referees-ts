"use server";

interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface GeoNamesResult {
  geonameId: number;
  name: string;
  countryCode: string;
  population: number;
  lat: number;
  lng: number;
}

export const searchVenues = async (
  query: string
): Promise<Result<GeoNamesResult[]>> => {
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