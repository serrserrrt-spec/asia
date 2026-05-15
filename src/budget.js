import { currencies } from "../data/currencies.js";
import { options } from "../data/options.js";
import { budgetProfiles } from "../data/budget.js";
import { trip } from "../data/trip.js";

export const fmtRub = (value) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(value)) + " ₽";

export function convertToRub(amount, currency, rates) {
  return amount * (rates[`${currency}_RUB`] || 1);
}

export function calculateBudget(route, selectedOptions, rates = currencies.rates, override = {}) {
  const base = { ...budgetProfiles[route], ...Object.fromEntries(Object.entries(override).filter(([, value]) => value !== "" && value !== null && value !== undefined).map(([key, value]) => [key, Number(value)])) };
  const optionItems = options.filter((option) => selectedOptions.includes(option.id));
  const optionRub = optionItems.reduce((sum, option) => sum + convertToRub(option.amount, option.currency, rates), 0);
  const reserveRate = trip.scenarios[route].reserveRate;
  const subtotalMin = base.foodMinRub + base.transportRub + base.ticketsRub + base.hiddenRub + base.premiumRub + optionRub;
  const subtotalMax = base.foodMaxRub + base.transportRub + base.ticketsRub + base.hiddenRub + base.premiumRub + optionRub;
  return { base, options: optionItems, optionRub, reserveRate, reserveMin: subtotalMin * reserveRate, reserveMax: subtotalMax * reserveRate, totalMin: subtotalMin * (1 + reserveRate), totalMax: subtotalMax * (1 + reserveRate) };
}

export function budgetCard(route, selectedOptions, rates, override = {}) {
  const b = calculateBudget(route, selectedOptions, rates, override);
  return `<article class="card budget-card premium-line">
    <div class="card-kicker">${trip.scenarios[route].label}</div>
    <h3>${fmtRub(b.totalMin)} - ${fmtRub(b.totalMax)}</h3>
    <p>${b.base.note}</p>
    <dl class="mini-grid">
      <div><dt>Еда</dt><dd>${fmtRub(b.base.foodMinRub)} - ${fmtRub(b.base.foodMaxRub)}</dd></div>
      <div><dt>Билеты</dt><dd>${fmtRub(b.base.ticketsRub)}</dd></div>
      <div><dt>Транспорт</dt><dd>${fmtRub(b.base.transportRub)}</dd></div>
      <div><dt>Скрытые</dt><dd>${fmtRub(b.base.hiddenRub)}</dd></div>
      <div><dt>Опции</dt><dd>${fmtRub(b.optionRub)}</dd></div>
      <div><dt>Резерв</dt><dd>${Math.round(b.reserveRate * 100)}%</dd></div>
    </dl>
  </article>`;
}
