import { routeA } from "../data/routes-a.js";
import { routeB } from "../data/routes-b.js";
import { routeC } from "../data/routes-c.js";
import { locations } from "../data/locations.js";
import { restaurants } from "../data/restaurants.js";
import { transportMoves } from "../data/transport.js";

const stateKey = "asiaFamilyTrip2026State";
const allDays = [...routeA, ...routeB, ...routeC];
const byLocationName = new Map(locations.map((item) => [item.name, item]));

function loadStoredState() {
  try {
    return JSON.parse(localStorage.getItem(stateKey)) || {};
  } catch {
    return {};
  }
}

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function getDayFromScreen() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const id = params.get("id");
  if (id) return allDays.find((day) => day.id === id);

  const kicker = document.querySelector(".day-detail .card-kicker")?.textContent || "";
  const date = kicker.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  const route = kicker.match(/\b[A-C]\b/)?.[0];
  if (!date) return null;
  return allDays.find((day) => day.date === date && (!route || day.route === route)) || null;
}

function dayPlan(day) {
  return loadStoredState().dayPlans?.[day.id] || {};
}

function linkedLocationIds(day) {
  return dayPlan(day).locationIds || day.attractions || [];
}

function linkedRestaurantIds(day) {
  const plan = dayPlan(day);
  if (plan.restaurantIds) return plan.restaurantIds;
  return restaurants
    .filter((item) => item.city === day.city && item.routeFit.includes(day.route))
    .slice(0, 4)
    .map((item) => item.id);
}

function linkedTransportIds(day) {
  const plan = dayPlan(day);
  if (plan.transportIds) return plan.transportIds;
  return transportMoves
    .filter((move) => move.city === day.city && (move.date === day.date || move.date === "" || move.from.includes(day.city)))
    .slice(0, 3)
    .map((move) => move.id);
}

function getLocations(day) {
  return linkedLocationIds(day).map((id) => locations.find((item) => item.id === id)).filter(Boolean);
}

function getRestaurants(day) {
  return linkedRestaurantIds(day).map((id) => restaurants.find((item) => item.id === id)).filter(Boolean);
}

function getTransport(day) {
  return linkedTransportIds(day).map((id) => transportMoves.find((item) => item.id === id)).filter(Boolean);
}

function enhanceLocationCards() {
  document.querySelectorAll(".location-card").forEach((card) => {
    const name = card.querySelector("h3")?.textContent?.trim();
    const item = byLocationName.get(name);
    if (!item) return;

    if (item.photoUrl && !card.querySelector(".card-photo")) {
      const img = document.createElement("img");
      img.className = "card-photo";
      img.src = item.photoUrl;
      img.alt = item.name;
      img.loading = "lazy";
      card.prepend(img);
    }

    const grid = card.querySelector(".mini-grid");
    if (grid && !grid.querySelector("[data-extra-location]")) {
      const see = document.createElement("div");
      see.dataset.extraLocation = "see";
      see.innerHTML = `<dt>Что смотрим</dt><dd>${item.whatToSee}</dd>`;
      const plan = document.createElement("div");
      plan.dataset.extraLocation = "plan-b";
      plan.innerHTML = `<dt>План Б</dt><dd>${item.planB}</dd>`;
      grid.append(see, plan);
    }
  });
}

function locationMiniCard(item) {
  return `<article class="mini-card">
    ${item.photoUrl ? `<img class="mini-photo" src="${item.photoUrl}" alt="${item.name}" loading="lazy">` : ""}
    <h4>${item.name}</h4>
    <p><strong>Что смотрим:</strong> ${item.whatToSee}</p>
    <p><strong>Как добираемся:</strong> ${item.transportFromBase}</p>
    <p><strong>Еда рядом:</strong> ${item.foodNearby}</p>
    <div class="button-row"><a class="link-button" href="${mapsUrl(item.googleMapsQuery)}" target="_blank" rel="noopener">Локация</a></div>
  </article>`;
}

function restaurantBlock(item) {
  return `<div class="food-link">
    <p><a href="${mapsUrl(item.googleMapsQuery)}" target="_blank" rel="noopener"><strong>${item.name}</strong></a>: ${item.budgetMin.toLocaleString("ru-RU")} - ${item.budgetMax.toLocaleString("ru-RU")} ${item.currency}</p>
    <p><strong>Взрослым:</strong> ${item.whatToOrderAdults}</p>
    <p><strong>Детям:</strong> ${item.whatToOrderKids}</p>
    ${item.sourceUrl ? `<a class="link-button" href="${item.sourceUrl}" target="_blank" rel="noopener">Меню / сайт</a>` : ""}
  </div>`;
}

function transportBlock(move) {
  return `<div class="food-link">
    <p><strong>${move.from} -> ${move.to}</strong></p>
    <p>Такси: ${move.taxiInstruction}</p>
    <p>${move.taxiTime} · ${move.taxiBudget}</p>
    <p>Общественный: ${move.publicInstruction}</p>
    <a class="link-button" href="${mapsUrl(move.googleMapsRouteQuery)}" target="_blank" rel="noopener">Маршрут</a>
  </div>`;
}

function enhanceDayDetail() {
  const detail = document.querySelector(".day-detail");
  if (!detail) return;
  const day = getDayFromScreen();
  if (!day) return;

  if (!detail.querySelector(".enhanced-day-locations") && !detail.textContent.includes("Что смотрим по месту")) {
    const locSection = document.createElement("section");
    locSection.className = "enhanced-day-locations";
    locSection.innerHTML = `<h3>Что смотрим по месту</h3><div class="grid linked-grid">${getLocations(day).map(locationMiniCard).join("")}</div>`;
    const firstSplit = detail.querySelector(".split");
    if (firstSplit) firstSplit.after(locSection);
  }

  const splits = detail.querySelectorAll(".split");
  const linkedSplit = [...splits].find((split) => split.textContent.includes("Связанные рестораны"));
  if (!linkedSplit || linkedSplit.dataset.enhanced === "true") return;

  const columns = linkedSplit.querySelectorAll(":scope > div");
  if (columns[0]) {
    columns[0].innerHTML = `<h3>Связанные рестораны и меню</h3>${getRestaurants(day).map(restaurantBlock).join("") || "<p>Не выбрано.</p>"}`;
  }
  if (columns[1]) {
    columns[1].innerHTML = `<h3>Связанный транспорт</h3>${getTransport(day).map(transportBlock).join("") || "<p>Не выбрано.</p>"}`;
  }
  linkedSplit.dataset.enhanced = "true";
}

function enhance() {
  enhanceLocationCards();
  enhanceDayDetail();
}

const observer = new MutationObserver(() => {
  window.requestAnimationFrame(enhance);
});

observer.observe(document.querySelector("#app"), { childList: true, subtree: true });
window.addEventListener("hashchange", () => window.requestAnimationFrame(enhance));
window.addEventListener("load", () => window.requestAnimationFrame(enhance));
enhance();
