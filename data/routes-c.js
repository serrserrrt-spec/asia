import { routeA } from "./routes-a.js";

const premium = {
  "2026-07-22": "Canton Tower только при хорошей видимости; иначе премиальный ужин в молле.",
  "2026-07-26": "Melasti + Palmilla Bali, private car, Kecak только если дети не устали.",
  "2026-07-27": "Бронь Koral Restaurant или премиальный ужин в отеле.",
  "2026-07-30": "Private car в Ubud, Celuk и Tegallalang; Monkey Forest пропустить.",
  "2026-08-02": "Disneyland с Premier Access или спокойный культурный день в West Kowloon.",
  "2026-08-03": "M+ / Palace Museum как замена, если на Peak плохая видимость."
};

export const routeC = routeA.map((day, index) => ({
  ...day,
  id: `c-${index + 1}`,
  route: "C",
  focus: premium[day.date] ? `${day.focus}: премиум без перегруза` : day.focus,
  afternoon: premium[day.date] || day.afternoon,
  transport: day.city === "Bali" ? "Private car / проверенное такси, без плотных пересадок" : day.transport,
  taxi: day.city === "Bali" ? "Private car предпочтительнее: комфортнее и проще вернуться вечером" : day.taxi,
  publicTransport: day.city === "Bali" ? "Не рекомендовано для семейной логистики" : day.publicTransport,
  foodBudget: day.foodBudget.replace("Еда", "Премиум-питание"),
  ticketBudget: "премиум-ориентир / редактируется / нужно перепроверить",
  hiddenCosts: `${day.hiddenCosts}; буфер на комфорт и бронирования`,
  planB: `${day.planB}; выбрать крытый премиальный ресторан или восстановление в отеле`,
  risk: day.risk.includes("Длинный") ? "Перегруз снижается за счет удаления одной точки" : day.risk
}));
