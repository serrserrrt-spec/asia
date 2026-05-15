export const mapsUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
export const routeUrl = (query) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

export const mapLink = (query, label = "Google Maps") =>
  `<a class="link-button" href="${mapsUrl(query)}" target="_blank" rel="noopener">${label}</a>`;
