import { trip } from "../data/trip.js";
import { routeA } from "../data/routes-a.js";
import { routeB } from "../data/routes-b.js";
import { routeC } from "../data/routes-c.js";
import { locations } from "../data/locations.js";
import { restaurants, dailyFoodLine } from "../data/restaurants.js";
import { transportMoves } from "../data/transport.js";
import { options } from "../data/options.js";
import { currencies } from "../data/currencies.js";
import { checklists } from "../data/checklists.js";
import { planB } from "../data/plan-b.js";
import { addRoute, startRouter, navigate, currentRoute, renderCurrent } from "./router.js";
import { loadState, updateState } from "./state.js";
import { budgetCard, calculateBudget, fmtRub } from "./budget.js";
import { mapLink, mapsUrl } from "./maps.js";
import { toggleChecklist, checklistProgress, isChecked } from "./checklists.js";
import { allSources } from "./sources.js";
import { transportCard } from "./transport.js";

const root = document.querySelector("#app");
const routeSets = { A: routeA, B: routeB, C: routeC };
const cityClass = (city) => `city-${String(city).toLowerCase().replaceAll(" ", "-")}`;
const stateRates = () => loadState().rates || currencies.rates;
const selectedRoute = () => loadState().route || "A";
const activeDays = () => routeSets[selectedRoute()];
const cityNames = { Guangzhou: "Гуанчжоу", Bali: "Бали", "Hong Kong": "Гонконг", all: "Все города" };
const priorityNames = { must: "обязательно", high: "важно", optional: "по желанию", premium: "премиум", avoid: "лучше избегать" };
const typeNames = {
  viewpoint: "смотровая", walk: "прогулка", district: "район", culture: "культура", "old town": "старый город",
  cruise: "круиз", "theme park": "парк", mall: "молл", museum: "музей", restaurant: "ресторан", airport: "аэропорт",
  transport: "транспорт", hotel: "отель", "dining shopping": "еда и покупки", nature: "природа", "water park": "аквапарк",
  temple: "храм", show: "шоу", beach: "пляж", "beach club": "пляжный клуб", "premium restaurant": "премиум-ресторан",
  market: "рынок", grocery: "продукты", "restaurant area": "ресторанная зона", activity: "активность", "day trip": "выезд на день",
  craft: "ремесла", "mall museum": "молл/музей", "transport attraction": "транспорт-аттракцион"
};
const mealNames = { breakfast: "завтрак", lunch: "обед", dinner: "ужин", snack: "перекус", market: "рынок", "park-food": "еда в парке" };
const categoryNames = { premium: "премиум", tickets: "билеты", transport: "транспорт", hidden: "скрытые расходы", food: "питание" };
const statusNames = { "needs recheck": "перепроверить", "needs verification": "нужно подтвердить", live: "живая ссылка" };

function cityLabel(city) {
  return cityNames[city] || city;
}

function currencyForDay(day) {
  if (day.date === "2026-08-03") return "HKD";
  return day.city === "Bali" ? "IDR" : day.city === "Hong Kong" ? "HKD" : "CNY";
}

function localToRub(amount, currency) {
  return Math.round(amount * (stateRates()[`${currency}_RUB`] || 1));
}

function estimateDayCosts(day) {
  const routeMultiplier = day.route === "B" ? 1.18 : day.route === "C" ? 1.28 : 1;
  const currency = currencyForDay(day);
  const localFood = {
    Guangzhou: [450, 1000],
    Bali: [1500000, 3500000],
    "Hong Kong": [1000, 2500]
  }[day.city] || [600, 1200];
  const localHidden = {
    Guangzhou: 150,
    Bali: 350000,
    "Hong Kong": 250
  }[day.city] || 200;
  const localTransportByDate = {
    "2026-07-20": ["CNY", [110, 180]],
    "2026-07-21": ["CNY", [120, 240]],
    "2026-07-22": ["CNY", [160, 280]],
    "2026-07-23": ["IDR", [120000, 250000]],
    "2026-07-24": ["IDR", [0, 150000]],
    "2026-07-25": ["IDR", [500000, 800000]],
    "2026-07-26": ["IDR", [700000, 1200000]],
    "2026-07-27": ["IDR", [250000, 500000]],
    "2026-07-28": ["IDR", [800000, 1300000]],
    "2026-07-29": ["IDR", [120000, 250000]],
    "2026-07-30": ["IDR", [800000, 1500000]],
    "2026-07-31": ["IDR", [0, 150000]],
    "2026-08-01": ["HKD", [230, 350]],
    "2026-08-02": ["HKD", [100, 220]],
    "2026-08-03": ["HKD", [600, 1400]],
    "2026-08-04": ["CNY", [60, 160]],
    "2026-08-05": ["CNY", [60, 160]],
    "2026-08-06": ["CNY", [110, 180]]
  };
  const localTicketMap = {
    "gz-canton-tower": ["CNY", [600, 1000]], "gz-pearl-cruise": ["CNY", [400, 800]], "gz-chimelong": ["CNY", [1000, 1800]],
    "bali-waterbom": ["IDR", [2300000, 3800000]], "bali-devdan": ["IDR", [2000000, 4000000]], "bali-kecak": ["IDR", [600000, 1200000]],
    "bali-safari": ["IDR", [4000000, 7000000]], "bali-tanjung-benoa": ["IDR", [2000000, 4500000]],
    "hk-disneyland": ["HKD", [2500, 3600]], "hk-ocean-park": ["HKD", [1800, 2600]], "hk-peak-tram": ["HKD", [600, 1200]],
    "hk-sky-terrace": ["HKD", [300, 650]], "hk-mplus": ["HKD", [300, 600]], "hk-palace": ["HKD", [300, 600]]
  };
  const tickets = linkedLocationIds(day).reduce((sum, id) => {
    const item = localTicketMap[id];
    if (!item) return sum;
    return [sum[0] + localToRub(item[1][0], item[0]), sum[1] + localToRub(item[1][1], item[0])];
  }, [0, 0]);
  const food = localFood.map((v) => Math.round(localToRub(v, currency) * routeMultiplier));
  const transportLocal = localTransportByDate[day.date] || [currency, [80, 180]];
  const transport = transportLocal[1].map((v) => Math.round(localToRub(v, transportLocal[0]) * routeMultiplier));
  const hidden = Math.round(localToRub(localHidden, currency) * routeMultiplier);
  const custom = loadState().dayPlans?.[day.id]?.costs || {};
  const customFood = Number(custom.foodRub) || 0;
  const customTickets = Number(custom.ticketsRub) || 0;
  const customTransport = Number(custom.transportRub) || 0;
  const customHidden = Number(custom.hiddenRub) || 0;
  const finalFood = customFood ? [customFood, customFood] : food;
  const finalTickets = customTickets ? [customTickets, customTickets] : tickets;
  const finalTransport = customTransport ? [customTransport, customTransport] : transport;
  const finalHidden = customHidden || hidden;
  const subtotalMin = finalFood[0] + finalTransport[0] + finalTickets[0] + finalHidden;
  const subtotalMax = finalFood[1] + finalTransport[1] + finalTickets[1] + finalHidden;
  const reserveRate = day.route === "A" ? 0.12 : 0.15;
  return {
    food: finalFood, transport: finalTransport, tickets: finalTickets, hidden: finalHidden,
    currency,
    transportCurrency: transportLocal[0],
    reserve: [Math.round(subtotalMin * reserveRate), Math.round(subtotalMax * reserveRate)],
    total: [Math.round(subtotalMin * (1 + reserveRate)), Math.round(subtotalMax * (1 + reserveRate))]
  };
}

function dayPlan(day) {
  return loadState().dayPlans?.[day.id] || {};
}

function updateDayPlan(dayId, patch) {
  const s = loadState();
  updateState({ dayPlans: { ...(s.dayPlans || {}), [dayId]: { ...(s.dayPlans?.[dayId] || {}), ...patch } } });
}

function dayField(day, field) {
  const plan = dayPlan(day);
  return plan[field] || day[field] || "";
}

function linkedLocationIds(day) {
  return dayPlan(day).locationIds || day.attractions;
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

function getLinkedLocations(day) {
  return linkedLocationIds(day).map((id) => locations.find((item) => item.id === id)).filter(Boolean);
}

function getLinkedRestaurants(day) {
  return linkedRestaurantIds(day).map((id) => restaurants.find((item) => item.id === id)).filter(Boolean);
}

function getLinkedTransport(day) {
  return linkedTransportIds(day).map((id) => transportMoves.find((item) => item.id === id)).filter(Boolean);
}

function rubToLocal(valueRub, currency) {
  const rate = stateRates()[`${currency}_RUB`] || 1;
  return valueRub / rate;
}

function fmtLocal(valueRub, currency) {
  const value = rubToLocal(valueRub, currency);
  const digits = currency === "IDR" ? 0 : 0;
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: digits }).format(Math.round(value)) + ` ${currency}`;
}

function moneyRange(range, currency) {
  return `${fmtRub(range[0])} - ${fmtRub(range[1])}<br><small>${fmtLocal(range[0], currency)} - ${fmtLocal(range[1], currency)}</small>`;
}

function moneySingle(value, currency) {
  return `${fmtRub(value)}<br><small>${fmtLocal(value, currency)}</small>`;
}

function dayCostsBlock(day) {
  const c = estimateDayCosts(day);
  return `<div class="cost-block">
    <h3>Затраты на день</h3>
    <dl class="mini-grid">
      <div><dt>Еда и вода</dt><dd>${moneyRange(c.food, c.currency)}</dd></div>
      <div><dt>Билеты / активности</dt><dd>${moneyRange(c.tickets, c.currency)}</dd></div>
      <div><dt>Такси / транспорт</dt><dd>${moneyRange(c.transport, c.transportCurrency)}</dd></div>
      <div><dt>Скрытые расходы</dt><dd>${moneySingle(c.hidden, c.currency)}</dd></div>
      <div><dt>Резерв</dt><dd>${moneyRange(c.reserve, c.currency)}</dd></div>
      <div><dt>Итого на день</dt><dd>${moneyRange(c.total, c.currency)}</dd></div>
    </dl>
    <p class="note">Основной расчет в рублях. Ниже каждой суммы указан эквивалент в локальной валюте дня; транспорт может быть в другой валюте на пограничный/трансферный день.</p>
  </div>`;
}

function screen(title, body, actions = "") {
  return `<section class="screen">
    <header class="screen-head">
      <div><p class="eyebrow">${trip.name}</p><h1>${title}</h1></div>
      ${actions}
    </header>
    ${body}
  </section>`;
}

function routeSwitch() {
  const s = loadState();
  return `<div class="segmented" role="tablist">
    ${Object.keys(trip.scenarios).map((id) => `<button data-action="set-route" data-route="${id}" class="${s.route === id ? "active" : ""}">${id}</button>`).join("")}
  </div>`;
}

function nearestDay(days) {
  const s = loadState();
  const now = new Date(s.manualDate || new Date().toISOString().slice(0, 10));
  const start = new Date(trip.dates.start);
  if (now < start) return days[0];
  return days.find((day) => day.date === now.toISOString().slice(0, 10)) || days[days.length - 1];
}

function dayCard(day, nextDay = null) {
  return `<article class="card day-card ${cityClass(day.city)}">
    <div class="card-kicker">${day.date} · ${cityLabel(day.city)}</div>
    <h3>${day.focus}</h3>
    <p>${day.morning} · ${day.afternoon} · ${day.evening}</p>
    <div class="chip-row"><span>Итого: ${fmtRub(estimateDayCosts(day).total[0])} - ${fmtRub(estimateDayCosts(day).total[1])}</span><span>${day.travelTime}</span></div>
    ${nextDay ? `<p class="next-step">Дальше: ${nextDay.date} · ${cityLabel(nextDay.city)} · ${nextDay.focus}</p>` : `<p class="next-step">Финиш поездки и вылет домой.</p>`}
    <p class="risk">Риск: ${day.risk}</p>
    <button class="primary" data-action="open-day" data-id="${day.id}">Открыть день</button>
  </article>`;
}

function locationCard(location) {
  return `<article class="card location-card ${cityClass(location.city)} ${location.priority === "premium" ? "premium-line" : ""}">
    ${location.photoUrl ? `<img class="card-photo" src="${location.photoUrl}" alt="${location.name}" loading="lazy">` : ""}
    <div class="card-kicker">${cityLabel(location.city)} · ${typeNames[location.type] || location.type} · ${priorityNames[location.priority] || location.priority}</div>
    <h3>${location.name}</h3>
    <p>${location.whyGo}</p>
    <dl class="mini-grid">
      <div><dt>Лучшее время</dt><dd>${location.bestTime}</dd></div>
      <div><dt>Дети</dt><dd>${location.kidsFit}</dd></div>
      <div><dt>Еда рядом</dt><dd>${location.foodNearby}</dd></div>
      <div><dt>Транспорт</dt><dd>${location.transportFromBase}</dd></div>
      <div><dt>Что смотрим</dt><dd>${location.whatToSee}</dd></div>
      <div><dt>План Б</dt><dd>${location.planB}</dd></div>
    </dl>
    <p class="risk">Риск: ${location.risk}</p>
    <div class="button-row">${mapLink(location.googleMapsQuery)}${location.officialSourceUrl ? `<a class="link-button" href="${location.officialSourceUrl}" target="_blank" rel="noopener">Источник</a>` : ""}</div>
  </article>`;
}

function restaurantCard(item) {
  return `<article class="card restaurant-card">
    <div class="card-kicker">${cityLabel(item.city)} · ${mealNames[item.mealType] || item.mealType} · ${item.currency}</div>
    <h3>${item.name}</h3>
    <p>${item.whyGo}</p>
    <dl class="mini-grid">
      <div><dt>Взрослым</dt><dd>${item.whatToOrderAdults}</dd></div>
      <div><dt>Детям</dt><dd>${item.whatToOrderKids}</dd></div>
      <div><dt>Бюджет</dt><dd>${item.budgetMin.toLocaleString("ru-RU")} - ${item.budgetMax.toLocaleString("ru-RU")} ${item.currency}</dd></div>
      <div><dt>Бронь</dt><dd>${item.reservationNeeded ? "нужна" : "обычно нет"}</dd></div>
    </dl>
    <p class="risk">${item.risk}</p>
    <div class="button-row">${mapLink(item.googleMapsQuery)}${item.sourceUrl ? `<a class="link-button" href="${item.sourceUrl}" target="_blank" rel="noopener">Источник</a>` : ""}</div>
  </article>`;
}

function dashboard() {
  const s = loadState();
  const days = activeDays();
  const today = nearestDay(days);
  const b = calculateBudget(s.route, s.selectedOptions, stateRates(), s.budgetOverrides?.[s.route]);
  return screen("Главная", `
    <div class="hero-panel">
      <div>${routeSwitch()}<h2>${trip.scenarios[s.route].label}</h2><p>${trip.dates.start} - ${trip.dates.end} · 2 взрослых + девочки 7 и 12 лет</p></div>
      <div class="total">${fmtRub(b.totalMin)} - ${fmtRub(b.totalMax)}</div>
    </div>
    <div class="quick-grid">
      <button data-action="nav" data-to="/today">Сегодня</button>
      <button data-action="nav" data-to="/routes">Маршрут</button>
      <button data-action="nav" data-to="/planner">Планировать</button>
      <button data-action="nav" data-to="/maps">Карта</button>
      <button data-action="nav" data-to="/budget">Бюджет</button>
      <button data-action="nav" data-to="/food">Питание</button>
      <button data-action="nav" data-to="/plan-b">План Б</button>
      <button data-action="nav" data-to="/guide">Гайд</button>
      <button data-action="nav" data-to="/sources">Источники</button>
    </div>
    <div class="grid two">
      ${budgetCard("A", s.selectedOptions, stateRates(), s.budgetOverrides?.A)}
      ${budgetCard("B", s.selectedOptions, stateRates(), s.budgetOverrides?.B)}
      ${budgetCard("C", s.selectedOptions, stateRates(), s.budgetOverrides?.C)}
      <article class="card warning-card"><div class="card-kicker">Ближайший день</div><h3>${today.date} · ${cityLabel(today.city)}</h3><p>${today.focus}</p><p class="risk">Главный риск: ${today.risk}</p>${dayCostsBlock(today)}</article>
    </div>
  `);
}

function todayScreen() {
  const s = loadState();
  const day = nearestDay(activeDays());
  return screen("Сегодня", `
    <div class="toolbar">
      ${routeSwitch()}
      <label class="date-input">Дата <input type="date" value="${s.manualDate}" data-action="manual-date"></label>
      <button data-action="manual-date-clear">Сброс</button>
    </div>
    ${dayDetail(day)}
  `);
}

function routesScreen() {
  const days = activeDays();
  return screen("Маршруты A/B/C", `
    <div class="toolbar">${routeSwitch()}<button data-action="print">Печать / PDF</button></div>
    <div class="route-feed">${days.map((day, index) => dayCard(day, days[index + 1])).join("")}</div>
  `);
}

function dayDetail(day) {
  const locs = getLinkedLocations(day);
  const food = getLinkedRestaurants(day);
  const moves = getLinkedTransport(day);
  const plan = dayPlan(day);
  return `<article class="card day-detail ${cityClass(day.city)}">
    <div class="card-kicker">${day.route} · ${day.date} · ${cityLabel(day.city)}</div>
    <h2>${day.focus}</h2>
    <p><strong>База:</strong> ${day.base}</p>
    <dl class="timeline">
      <div><dt>Утро</dt><dd>${dayField(day, "morning")}</dd></div>
      <div><dt>Обед</dt><dd>${dayField(day, "lunch")}</dd></div>
      <div><dt>День</dt><dd>${dayField(day, "afternoon")}</dd></div>
      <div><dt>Вечер</dt><dd>${dayField(day, "evening")}</dd></div>
    </dl>
    <div class="split">
      <div><h3>Транспорт</h3><p>${day.transport}</p><p>${day.taxi}</p><p>${day.publicTransport}</p></div>
      <div><h3>Бюджет</h3><p>${day.foodBudget}</p><p>${day.ticketBudget}</p><p>${day.hiddenCosts}</p></div>
    </div>
    ${dayCostsBlock(day)}
    <p class="risk">Риск: ${day.risk}</p>
    <p><strong>План Б:</strong> ${day.planB}</p>
    <p><strong>Взять:</strong> ${day.packing}</p>
    ${plan.notes ? `<p><strong>Мои заметки:</strong> ${plan.notes}</p>` : ""}
    <h3>Что смотрим по месту</h3>
    <div class="grid linked-grid">${locs.map((loc) => `<article class="mini-card">
      ${loc.photoUrl ? `<img class="mini-photo" src="${loc.photoUrl}" alt="${loc.name}" loading="lazy">` : ""}
      <h4>${loc.name}</h4>
      <p><strong>Что смотрим:</strong> ${loc.whatToSee}</p>
      <p><strong>Как добираемся:</strong> ${loc.transportFromBase}</p>
      <p><strong>Еда рядом:</strong> ${loc.foodNearby}</p>
      <div class="button-row">${mapLink(loc.googleMapsQuery, "Локация")}</div>
    </article>`).join("")}</div>
    <div class="split">
      <div><h3>Связанные рестораны и меню</h3>${food.map((item) => `<div class="food-link"><p><a href="${mapsUrl(item.googleMapsQuery)}" target="_blank" rel="noopener"><strong>${item.name}</strong></a>: ${item.budgetMin.toLocaleString("ru-RU")} - ${item.budgetMax.toLocaleString("ru-RU")} ${item.currency}</p><p><strong>Взрослым:</strong> ${item.whatToOrderAdults}</p><p><strong>Детям:</strong> ${item.whatToOrderKids}</p>${item.sourceUrl ? `<a class="link-button" href="${item.sourceUrl}" target="_blank" rel="noopener">Меню / сайт</a>` : ""}</div>`).join("") || "<p>Не выбрано.</p>"}</div>
      <div><h3>Связанный транспорт</h3>${moves.map((move) => `<div class="food-link"><p><strong>${move.from} → ${move.to}</strong></p><p>Такси: ${move.taxiInstruction}</p><p>${move.taxiTime} · ${move.taxiBudget}</p><p>Общественный: ${move.publicInstruction}</p><a class="link-button" href="${mapsUrl(move.googleMapsRouteQuery)}" target="_blank" rel="noopener">Маршрут</a></div>`).join("") || "<p>Не выбрано.</p>"}</div>
    </div>
    ${dayPlanner(day)}
    <div class="subcards">${locs.map((l) => `<a href="${mapsUrl(l.googleMapsQuery)}" target="_blank" rel="noopener">${l.name}</a>`).join("")}</div>
  </article>`;
}

function dayPlanner(day) {
  const plan = dayPlan(day);
  const costs = plan.costs || {};
  return `<details class="planner" open>
    <summary>Мой план дня</summary>
    <p class="note">Можно менять сценарий дня и вручную ставить расходы. Изменения сохраняются только на этом устройстве.</p>
    <div class="form-grid">
      <label>Утро<textarea data-action="plan-field" data-day="${day.id}" data-field="morning">${dayField(day, "morning")}</textarea></label>
      <label>Обед<textarea data-action="plan-field" data-day="${day.id}" data-field="lunch">${dayField(day, "lunch")}</textarea></label>
      <label>День<textarea data-action="plan-field" data-day="${day.id}" data-field="afternoon">${dayField(day, "afternoon")}</textarea></label>
      <label>Вечер<textarea data-action="plan-field" data-day="${day.id}" data-field="evening">${dayField(day, "evening")}</textarea></label>
      <label>Мои заметки<textarea data-action="plan-field" data-day="${day.id}" data-field="notes">${plan.notes || ""}</textarea></label>
    </div>
    <h3>Мои затраты, ₽</h3>
    <div class="form-grid cost-inputs">
      <label>Еда и вода<input type="number" min="0" inputmode="numeric" data-action="plan-cost" data-day="${day.id}" data-cost="foodRub" value="${costs.foodRub || ""}" placeholder="оставить пустым = авто"></label>
      <label>Билеты / активности<input type="number" min="0" inputmode="numeric" data-action="plan-cost" data-day="${day.id}" data-cost="ticketsRub" value="${costs.ticketsRub || ""}" placeholder="оставить пустым = авто"></label>
      <label>Такси / транспорт<input type="number" min="0" inputmode="numeric" data-action="plan-cost" data-day="${day.id}" data-cost="transportRub" value="${costs.transportRub || ""}" placeholder="оставить пустым = авто"></label>
      <label>Скрытые расходы<input type="number" min="0" inputmode="numeric" data-action="plan-cost" data-day="${day.id}" data-cost="hiddenRub" value="${costs.hiddenRub || ""}" placeholder="оставить пустым = авто"></label>
    </div>
    <div class="button-row"><button data-action="reset-day-plan" data-day="${day.id}">Сбросить мой план</button></div>
  </details>`;
}

function dayScreen(params) {
  const day = [...routeA, ...routeB, ...routeC].find((item) => item.id === params.id) || nearestDay(activeDays());
  return screen("День маршрута", `${dayDetail(day)}<h2 class="section-title">Локации дня</h2><div class="grid">${day.attractions.map((id) => locations.find((l) => l.id === id)).filter(Boolean).map(locationCard).join("")}</div>`);
}

function locationsScreen() {
  const s = loadState();
  const filtered = locations.filter((l) => l.routeFit.includes(s.route) && (s.cityFilter === "all" || l.city === s.cityFilter));
  return screen("Локации", `
    <div class="toolbar">${routeSwitch()}${cityFilter()}</div>
    <div class="grid">${filtered.map(locationCard).join("")}</div>
  `);
}

function cityFilter() {
  return `<select data-action="city-filter">
    ${["all","Guangzhou","Bali","Hong Kong"].map((city) => `<option value="${city}" ${loadState().cityFilter === city ? "selected" : ""}>${cityLabel(city)}</option>`).join("")}
  </select>`;
}

function foodScreen() {
  const s = loadState();
  const items = restaurants.filter((r) => r.routeFit.includes(s.route) && (s.cityFilter === "all" || r.city === s.cityFilter));
  return screen("Рестораны и питание", `
    <div class="toolbar">${routeSwitch()}${cityFilter()}</div>
    <article class="card premium-line"><h3>Ежедневная строка</h3><p>${dailyFoodLine.label}</p><strong>${fmtRub(dailyFoodLine.rubEstimate)} / день</strong><p>${dailyFoodLine.status}</p></article>
    <div class="grid">${items.map(restaurantCard).join("")}</div>
  `);
}

function plannerScreen() {
  const s = loadState();
  const days = activeDays();
  const day = days.find((item) => item.id === s.plannerDayId) || nearestDay(days);
  const plan = dayPlan(day);
  const dayLocationIds = new Set(linkedLocationIds(day));
  const dayRestaurantIds = new Set(linkedRestaurantIds(day));
  const dayTransportIds = new Set(linkedTransportIds(day));
  const locationPool = locations.filter((item) => item.routeFit.includes(day.route) && item.city === day.city);
  const restaurantPool = restaurants.filter((item) => item.routeFit.includes(day.route) && item.city === day.city);
  const transportPool = transportMoves.filter((item) => item.city === day.city);
  return screen("Планирование маршрута", `
    <div class="toolbar">
      ${routeSwitch()}
      <select data-action="planner-day">
        ${days.map((item) => `<option value="${item.id}" ${item.id === day.id ? "selected" : ""}>${item.date} · ${cityLabel(item.city)} · ${item.focus}</option>`).join("")}
      </select>
    </div>
    <article class="card premium-line">
      <div class="card-kicker">${day.date} · ${cityLabel(day.city)} · сценарий ${day.route}</div>
      <h2>${day.focus}</h2>
      <p>Этот экран связывает день, локации, еду, транспорт и бюджет. Все выбранные пункты появятся в карточке дня и сохранятся в localStorage.</p>
      ${dayCostsBlock(day)}
    </article>
    <div class="grid">
      <article class="card"><h3>1. Локации дня</h3><p>Выберите, что реально оставляем в маршруте.</p>${locationPool.map((item) => `<label class="check-row"><input type="checkbox" data-action="planner-location" data-day="${day.id}" data-id="${item.id}" ${dayLocationIds.has(item.id) ? "checked" : ""}><span><strong>${item.name}</strong><small>${priorityNames[item.priority] || item.priority} · ${item.bestTime}</small></span></label>`).join("")}</article>
      <article class="card"><h3>2. Еда и рестораны</h3><p>Подберите места рядом с выбранным городом и сценарием.</p>${restaurantPool.map((item) => `<label class="check-row"><input type="checkbox" data-action="planner-restaurant" data-day="${day.id}" data-id="${item.id}" ${dayRestaurantIds.has(item.id) ? "checked" : ""}><span><strong>${item.name}</strong><small>${item.budgetMin.toLocaleString("ru-RU")} - ${item.budgetMax.toLocaleString("ru-RU")} ${item.currency}</small></span></label>`).join("")}</article>
      <article class="card"><h3>3. Транспорт</h3><p>Оставьте только релевантные перемещения.</p>${transportPool.map((item) => `<label class="check-row"><input type="checkbox" data-action="planner-transport" data-day="${day.id}" data-id="${item.id}" ${dayTransportIds.has(item.id) ? "checked" : ""}><span><strong>${item.from} → ${item.to}</strong><small>${item.taxiTime} · ${item.taxiBudget}</small></span></label>`).join("")}</article>
      <article class="card"><h3>4. Логика дня</h3><p>Если локаций больше трех, день станет тяжелым. Если есть парк или дальний выезд, лучше убрать вторую крупную активность и поднять транспортный бюджет.</p><button data-action="open-day" data-id="${day.id}" class="primary">Открыть карточку дня</button></article>
    </div>
  `);
}

function transportScreen() {
  const s = loadState();
  const moves = transportMoves.filter((m) => s.cityFilter === "all" || m.city === s.cityFilter);
  return screen("Транспорт", `<div class="toolbar">${cityFilter()}</div><div class="grid">${moves.map(transportCard).join("")}</div>`);
}

function budgetOverrideFields(route) {
  const s = loadState();
  const current = s.budgetOverrides?.[route] || {};
  const rows = [
    ["foodMinRub", "Питание минимум, ₽"],
    ["foodMaxRub", "Питание максимум, ₽"],
    ["ticketsRub", "Билеты и активности, ₽"],
    ["transportRub", "Транспорт, ₽"],
    ["hiddenRub", "Скрытые расходы, ₽"],
    ["premiumRub", "Премиум-рестораны и комфорт, ₽"]
  ];
  return `<article class="card premium-line">
    <h3>Корректировка сценария ${route}</h3>
    <p>Поля переопределяют базовый бюджет только на этом устройстве. Пустое поле возвращает автоматический расчет.</p>
    <div class="form-grid cost-inputs">${rows.map(([key, label]) => `<label>${label}<input type="number" min="0" inputmode="numeric" data-action="budget-override" data-route="${route}" data-field="${key}" value="${current[key] || ""}" placeholder="авто"></label>`).join("")}</div>
    <div class="button-row"><button data-action="reset-budget-overrides" data-route="${route}">Сбросить корректировки ${route}</button></div>
  </article>`;
}

function dayPlanBudgetSummary() {
  const s = loadState();
  const entries = Object.entries(s.dayPlans || {}).filter(([, plan]) => plan.costs && Object.values(plan.costs).some(Boolean));
  if (!entries.length) return `<article class="card"><h3>Мои изменения по дням</h3><p>Пока нет ручных затрат в днях. Когда вы заполните «Мой план дня», они появятся здесь.</p></article>`;
  const allDays = [...routeA, ...routeB, ...routeC];
  const rows = entries.map(([dayId, plan]) => {
    const day = allDays.find((item) => item.id === dayId);
    const costs = plan.costs || {};
    const sum = ["foodRub", "ticketsRub", "transportRub", "hiddenRub"].reduce((acc, key) => acc + (Number(costs[key]) || 0), 0);
    return { day, sum };
  }).filter((row) => row.day);
  const total = rows.reduce((sum, row) => sum + row.sum, 0);
  return `<article class="card">
    <h3>Мои изменения по дням</h3>
    <p>Это ручные суммы из карточек дней. Они помогают сверить общий бюджет с фактическим планом.</p>
    <dl class="mini-grid">${rows.map((row) => `<div><dt>${row.day.date} · ${cityLabel(row.day.city)} · ${row.day.route}</dt><dd>${fmtRub(row.sum)}</dd></div>`).join("")}<div><dt>Итого ручных затрат</dt><dd>${fmtRub(total)}</dd></div></dl>
  </article>`;
}

function budgetScreen() {
  const s = loadState();
  const rates = stateRates();
  return screen("Бюджет", `
    <div class="toolbar">${routeSwitch()}<button data-action="reset-rates">Сбросить курсы</button></div>
    <div class="grid two">${["A","B","C"].map((r) => budgetCard(r, s.selectedOptions, rates, s.budgetOverrides?.[r])).join("")}</div>
    <h2 class="section-title">Курсы</h2>
    <div class="card form-grid">${Object.entries(rates).filter(([k]) => k !== "RUB_RUB").map(([key, value]) => `<label>${key}<input type="number" step="0.0001" value="${value}" data-action="rate" data-rate="${key}"></label>`).join("")}</div>
    <h2 class="section-title">Корректировка бюджета</h2>
    ${budgetOverrideFields(s.route)}
    <h2 class="section-title">Опции</h2>
    <div class="grid">${options.map((option) => `<label class="card option-card"><input type="checkbox" data-action="option" data-option="${option.id}" ${s.selectedOptions.includes(option.id) ? "checked" : ""}><span><strong>${option.label}</strong><small>${option.amount.toLocaleString("ru-RU")} ${option.currency} · ${categoryNames[option.category] || option.category}</small></span></label>`).join("")}</div>
    <h2 class="section-title">Связь с планом по дням</h2>
    ${dayPlanBudgetSummary()}
    <article class="card"><h3>Заметки по бюджету</h3><textarea data-action="budget-notes" placeholder="Например: проверить цены Disneyland, заложить больше на такси в Бали, добавить депозит Koral...">${s.budgetNotes || ""}</textarea></article>
    <p class="note">Все цены являются ориентировочными, редактируемыми и требуют ручной перепроверки перед поездкой.</p>
  `);
}

function mapsScreen() {
  const s = loadState();
  const filtered = locations.filter((l) => l.routeFit.includes(s.route));
  return screen("Карта / Google Maps", `<div class="toolbar">${routeSwitch()}</div><div class="map-list">${filtered.map((l) => `<a class="map-row" href="${mapsUrl(l.googleMapsQuery)}" target="_blank" rel="noopener"><span>${cityLabel(l.city)}</span><strong>${l.name}</strong><small>${l.googleMapsQuery}</small></a>`).join("")}</div>`);
}

function checklistsScreen() {
  return screen("Чек-листы", `<div class="grid">${checklists.map((list) => {
    const p = checklistProgress(list);
    return `<article class="card checklist-card"><div class="card-kicker">${p.done}/${p.total} · ${p.pct}%</div><h3>${list.title}</h3>${list.items.map((item) => `<label class="check-row"><input type="checkbox" data-action="check" data-list="${list.id}" data-item="${item}" ${isChecked(list.id, item) ? "checked" : ""}><span>${item}</span></label>`).join("")}</article>`;
  }).join("")}</div>`);
}

function planBScreen() {
  return screen("План Б", `<div class="grid">${planB.map((p) => `<article class="card warning-card"><h3>${p.title}</h3><dl class="mini-grid"><div><dt>Отменяем</dt><dd>${p.cancel}</dd></div><div><dt>Заменяем</dt><dd>${p.replace}</dd></div><div><dt>Стоимость</dt><dd>${p.cost}</dd></div><div><dt>Время</dt><dd>${p.time}</dd></div><div><dt>Еда</dt><dd>${p.food}</dd></div><div><dt>Как добраться</dt><dd>${p.transport}</dd></div></dl></article>`).join("")}</div>`);
}

function sourcesScreen() {
  return screen("Источники", `<div class="grid">${allSources().map((s) => `<article class="card source-card"><div class="card-kicker">${s.type} · ${s.lastChecked} · ${statusNames[s.status] || s.status || "перепроверить"}</div><h3>${s.label}</h3><p>${s.whatItConfirms}</p><a class="link-button" href="${s.url}" target="_blank" rel="noopener">${s.url}</a></article>`).join("")}</div>`);
}

function guideScreen() {
  return screen("Гайд по приложению", `
    <div class="grid">
      <article class="card premium-line"><h3>Как пользоваться каждый день</h3><p>Откройте «Сегодня», выберите сценарий A/B/C и при необходимости поставьте ручную дату. Внутри дня смотрите порядок утра, обеда, дня и вечера, затем блок «Затраты на день», транспорт, риск, план Б и ссылки на карты.</p></article>
      <article class="card"><h3>Как выбрать сценарий</h3><p>A подходит для спокойного семейного темпа. B добавляет больше парков, шоу и выездов. C оставляет лучшие впечатления, но снижает перегруз за счет private car, премиальных ресторанов и буферов отдыха.</p></article>
      <article class="card"><h3>Как читать бюджет дня</h3><p>«Еда и вода» включает обычные приемы пищи, воду, фрукты, мороженое, bakery, snacks детям и кофе/напитки. «Билеты» включает вероятные платные активности дня. «Скрытые расходы» — локеры, полотенца, чаевые, мелкие покупки, доплата за комфорт. «Резерв» — 12% для A и 15% для B/C. Основная сумма показана в рублях, а строкой ниже указан эквивалент в CNY, IDR или HKD по текущему курсу.</p></article>
      <article class="card"><h3>Транспортное правило</h3><p>В жару, с детьми, багажом, ранним вылетом или вечерним возвратом выбирайте такси/private car. На Бали для Ubud, Safari, Uluwatu и дальних пляжей лучше машина на 8-10 часов, а не разовые такси.</p></article>
      <article class="card"><h3>Перед поездкой</h3><p>Зайдите в «Источники» и перепроверьте билеты, расписания, цены, HSR, Love Bali levy и часы работы ресторанов. Все суммы в приложении — плановые ориентиры, не финальные цены.</p></article>
      <article class="card"><h3>Офлайн</h3><p>После первого открытия через локальный сервер или опубликованный сайт приложение кэширует файлы. Google Maps и внешние сайты без интернета не откроются, но маршруты, чек-листы, бюджет и план Б останутся доступны.</p></article>
    </div>
  `);
}

function printScreen() {
  const all = { A: routeA, B: routeB, C: routeC };
  return screen("Печать / PDF", `<button class="primary no-print" data-action="print">Печать</button>${Object.entries(all).map(([key, days]) => `<section class="print-route"><h2>${trip.scenarios[key].label}</h2><table><thead><tr><th>Дата</th><th>Город</th><th>Фокус</th><th>План</th><th>Бюджет</th><th>Maps</th></tr></thead><tbody>${days.map((day) => `<tr><td>${day.date}</td><td>${day.city}</td><td>${day.focus}</td><td>${day.morning}; ${day.afternoon}; ${day.evening}</td><td>${day.foodBudget}</td><td>${day.attractions.map((id) => mapsUrl(locations.find((l) => l.id === id)?.googleMapsQuery || id)).join("\n")}</td></tr>`).join("")}</tbody></table></section>`).join("")}`);
}

addRoute("/", dashboard);
addRoute("/today", todayScreen);
addRoute("/routes", routesScreen);
addRoute("/day", dayScreen);
addRoute("/locations", locationsScreen);
addRoute("/food", foodScreen);
addRoute("/planner", plannerScreen);
addRoute("/transport", transportScreen);
addRoute("/budget", budgetScreen);
addRoute("/maps", mapsScreen);
addRoute("/checklists", checklistsScreen);
addRoute("/plan-b", planBScreen);
addRoute("/sources", sourcesScreen);
addRoute("/print", printScreen);
addRoute("/guide", guideScreen);

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "nav") navigate(target.dataset.to);
  if (action === "open-day") navigate(`/day?id=${target.dataset.id}`);
  if (action === "set-route") updateState({ route: target.dataset.route });
  if (action === "manual-date-clear") updateState({ manualDate: "" });
  if (action === "option") {
    const s = loadState();
    const selected = new Set(s.selectedOptions);
    target.checked ? selected.add(target.dataset.option) : selected.delete(target.dataset.option);
    updateState({ selectedOptions: [...selected] });
  }
  if (action === "check") toggleChecklist(target.dataset.list, target.dataset.item);
  if (action === "reset-rates") updateState({ rates: null });
  if (action === "reset-day-plan") {
    const s = loadState();
    const nextPlans = { ...(s.dayPlans || {}) };
    delete nextPlans[target.dataset.day];
    updateState({ dayPlans: nextPlans });
  }
  if (action === "reset-budget-overrides") {
    const s = loadState();
    const next = { ...(s.budgetOverrides || {}) };
    delete next[target.dataset.route];
    updateState({ budgetOverrides: next });
  }
  if (["planner-location","planner-restaurant","planner-transport"].includes(action)) {
    const field = action === "planner-location" ? "locationIds" : action === "planner-restaurant" ? "restaurantIds" : "transportIds";
    const day = [...routeA, ...routeB, ...routeC].find((item) => item.id === target.dataset.day);
    const current = new Set(field === "locationIds" ? linkedLocationIds(day) : field === "restaurantIds" ? linkedRestaurantIds(day) : linkedTransportIds(day));
    target.checked ? current.add(target.dataset.id) : current.delete(target.dataset.id);
    updateDayPlan(target.dataset.day, { [field]: [...current] });
  }
  if (action === "print") window.print();
  if (["set-route","manual-date-clear","option","check","reset-rates","reset-day-plan","planner-location","planner-restaurant","planner-transport","reset-budget-overrides"].includes(action)) renderCurrent();
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (target.dataset.action === "manual-date") updateState({ manualDate: target.value });
  if (target.dataset.action === "city-filter") updateState({ cityFilter: target.value });
  if (target.dataset.action === "planner-day") updateState({ plannerDayId: target.value });
  if (target.dataset.action === "rate") {
    const rates = { ...stateRates(), [target.dataset.rate]: Number(target.value) };
    updateState({ rates });
  }
  if (target.dataset.action === "budget-override") {
    const s = loadState();
    const route = target.dataset.route;
    updateState({ budgetOverrides: { ...(s.budgetOverrides || {}), [route]: { ...(s.budgetOverrides?.[route] || {}), [target.dataset.field]: target.value } } });
  }
  if (target.dataset.action === "budget-notes") updateState({ budgetNotes: target.value });
  if (target.dataset.action === "plan-field") {
    const s = loadState();
    const day = target.dataset.day;
    updateState({ dayPlans: { ...(s.dayPlans || {}), [day]: { ...(s.dayPlans?.[day] || {}), [target.dataset.field]: target.value } } });
  }
  if (target.dataset.action === "plan-cost") {
    const s = loadState();
    const day = target.dataset.day;
    const current = s.dayPlans?.[day] || {};
    updateState({ dayPlans: { ...(s.dayPlans || {}), [day]: { ...current, costs: { ...(current.costs || {}), [target.dataset.cost]: target.value } } } });
  }
  if (target.dataset.action) renderCurrent();
});

document.querySelector("#bottomNav").addEventListener("click", (event) => {
  const target = event.target.closest("button[data-to]");
  if (target) navigate(target.dataset.to);
});

window.addEventListener("hashchange", () => {
  const { path } = currentRoute();
  document.querySelectorAll("#bottomNav button").forEach((button) => button.classList.toggle("active", button.dataset.to === path || (button.dataset.to === "/" && path === "/")));
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}

startRouter(root);
