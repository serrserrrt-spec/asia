import { transportMoves } from "../data/transport.js";
import { routeUrl } from "./maps.js";

export function transportCard(move) {
  return `<article class="card transport-card city-${move.city.toLowerCase().replaceAll(" ", "-")}">
    <div class="card-kicker">${move.date} · ${move.city}</div>
    <h3>${move.from} → ${move.to}</h3>
    <div class="split">
      <div><strong>Такси</strong><p>${move.taxiInstruction}</p><span>${move.taxiTime} · ${move.taxiBudget}</span></div>
      <div><strong>Общественный</strong><p>${move.publicInstruction}</p><span>${move.publicTime} · ${move.publicBudget}</span></div>
    </div>
    <p class="risk">Риск: ${move.risk}</p>
    <a class="link-button" href="${routeUrl(move.googleMapsRouteQuery)}" target="_blank" rel="noopener">Маршрут в Maps</a>
  </article>`;
}

export const movesForCity = (city) => city === "all" ? transportMoves : transportMoves.filter((move) => move.city === city);
