import { routeA } from "./routes-a.js";

const upgrades = {
  "2026-07-21": ["Добавить вечерний Beijing Road, если есть силы", "Больше ходьбы и выше риск перегрева"],
  "2026-07-22": ["Pearl River Night Cruise перед буфером в аэропорт", "Поздний вечер и риск недосыпа"],
  "2026-07-28": ["Полный день Bali Safari", "Больше билетов и длиннее дорога"],
  "2026-07-29": ["Пакет watersports в Tanjung Benoa", "Риск погоды и давления продавцов"],
  "2026-07-30": ["Ubud + Monkey Forest + Tegallalang", "Monkey Forest пропустить, если дети устали или боятся"],
  "2026-08-02": ["Полный день Disneyland с решением по Premier Access", "Можно заменить на Ocean Park как более насыщенный день"],
  "2026-08-04": ["Chimelong Safari Park", "Длинный жаркий день после переезда из Гонконга"]
};

export const routeB = routeA.map((day, index) => {
  const up = upgrades[day.date];
  return {
    ...day,
    id: `b-${index + 1}`,
    route: "B",
    focus: up ? `${day.focus}: максимум впечатлений` : day.focus,
    afternoon: up ? `${day.afternoon}. ${up[0]}` : day.afternoon,
    evening: day.date === "2026-08-04" ? "Ранний ужин после Chimelong / отдых в отеле" : day.evening,
    attractions: day.date === "2026-08-04" ? ["gz-chimelong"] : day.attractions,
    foodBudget: day.foodBudget.replace("Еда", "Еда + перекусы"),
    ticketBudget: "повышенный ориентир / редактируется / нужно перепроверить",
    hiddenCosts: up ? `${day.hiddenCosts}; дополнительный буфер на очереди и такси` : day.hiddenCosts,
    planB: up ? `${day.planB}; откатиться к версии маршрута A` : day.planB,
    risk: up ? up[1] : day.risk
  };
});
