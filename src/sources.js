import { sources, mapSource } from "../data/sources.js";
import { locations } from "../data/locations.js";

export const allSources = () => [...sources, ...locations.map((location) => mapSource(location.googleMapsQuery))];
export const sourceById = (id) => sources.find((source) => source.id === id);
