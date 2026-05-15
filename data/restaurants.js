const r = (id, city, name, mealType, routeFit, budgetMin, budgetMax, currency, extra = {}) => ({
  id, city, name, type: extra.type || "семейная еда", mealType, routeFit,
  whyGo: extra.whyGo || "Надежная семейная точка с простой логистикой.",
  whatToOrderAdults: extra.adults || "Фирменные местные блюда, безопасные напитки.",
  whatToOrderKids: extra.kids || "Рис/лапша, dumplings, фрукты, простой белок.",
  bestTime: extra.bestTime || "Обед или ранний ужин",
  scenario: extra.scenario || routeFit.join("/"),
  currency, budgetMin, budgetMax,
  rubMin: extra.rubMin || 0, rubMax: extra.rubMax || 0,
  sourceUrl: extra.sourceUrl || "",
  googleMapsQuery: extra.googleMapsQuery || `${name}, ${city}`,
  reservationNeeded: Boolean(extra.reservationNeeded),
  risk: extra.risk || "Цены и часы работы нужно перепроверить."
});

export const restaurants = [
  r("gz-dimsum", "Guangzhou", "Dian Dou De / Tao Tao Ju dim sum lunch", "lunch", ["A","B","C"], 450, 750, "CNY", { adults: "Dim sum, roast goose, чай", kids: "Булочки с BBQ pork, shrimp dumplings, лапша" }),
  r("food-gz-bingsheng", "Guangzhou", "Bingsheng / Lingnan Cantonese dinner", "dinner", ["A","B","C"], 650, 1100, "CNY", { reservationNeeded: true }),
  r("gz-mall-food", "Guangzhou", "Food court / mall lunch for hot day", "lunch", ["A","B","C"], 280, 520, "CNY"),
  r("gz-chimelong-food", "Guangzhou", "Chimelong food", "park-food", ["B"], 350, 650, "CNY", { sourceUrl: "https://www.chimelong.com/" }),
  r("gz-airport-buffer", "Guangzhou", "Airport meal buffer", "snack", ["A","B","C"], 300, 600, "CNY"),

  r("bali-melia-lunch", "Bali", "Melia casual lunch", "lunch", ["A","B","C"], 900000, 1500000, "IDR"),
  r("bali-collection-dinner", "Bali", "Bali Collection dinner", "dinner", ["A","B","C"], 1200000, 2200000, "IDR", { sourceUrl: "https://bali-collection.com/" }),
  r("food-bali-koral", "Bali", "Koral Restaurant", "dinner", ["C"], 4500000, 6500000, "IDR", { type: "премиум", reservationNeeded: true, sourceUrl: "https://www.kempinski.com/en/the-apurva-kempinski-bali/restaurants-bars/koral-restaurant", risk: "Бронь и минимальный депозит нужно перепроверить." }),
  r("bali-waterbom-food", "Bali", "Waterbom food court", "park-food", ["A","B","C"], 900000, 1600000, "IDR", { sourceUrl: "https://www.waterbom-bali.com/ticket" }),
  r("bali-uluwatu-dinner", "Bali", "Pecatu / Uluwatu dinner after Kecak", "dinner", ["A","B","C"], 1400000, 2600000, "IDR"),
  r("bali-pasar-fruits", "Bali", "Pasar Badung fruits", "market", ["B"], 200000, 500000, "IDR", { risk: "Покупать только фрукты, которые можно очистить; есть риск по гигиене." }),
  r("bali-grocery", "Bali", "Pepito / GrandLucky fruits, water, snacks", "market", ["A","B","C"], 400000, 900000, "IDR"),
  r("bali-safari-lunch", "Bali", "Bali Safari lunch", "park-food", ["B","C"], 900000, 1800000, "IDR"),
  r("bali-tanjung-lunch", "Bali", "Tanjung Benoa lunch", "lunch", ["B"], 900000, 1600000, "IDR"),
  r("bali-ubud-lunch", "Bali", "Ubud family lunch", "lunch", ["B","C"], 1000000, 1900000, "IDR"),
  r("food-bali-jimbaran", "Bali", "Jimbaran / Kedonganan seafood dinner", "dinner", ["A","B","C"], 1800000, 3800000, "IDR", { risk: "Согласовать цену до заказа морепродуктов." }),

  r("hk-foodhall", "Hong Kong", "K11 Musea / Harbour City food hall", "lunch", ["A","B","C"], 850, 1500, "HKD"),
  r("food-hk-tim-ho-wan", "Hong Kong", "Tim Ho Wan", "lunch", ["A","B","C"], 450, 850, "HKD"),
  r("hk-disney-dining", "Hong Kong", "Disneyland dining", "park-food", ["A","B","C"], 1300, 2400, "HKD", { sourceUrl: "https://www.hongkongdisneyland.com/en-hk/dining/" }),
  r("hk-ocean-dining", "Hong Kong", "Ocean Park dining", "park-food", ["B"], 1100, 2000, "HKD", { sourceUrl: "https://www.oceanpark.com.hk/en" }),
  r("hk-ifc-lunch", "Hong Kong", "Central / IFC lunch before HSR", "lunch", ["A","C"], 850, 1600, "HKD"),
  r("hk-snack-buffer", "Hong Kong", "Bakery / snack / water buffer", "snack", ["A","B","C"], 250, 500, "HKD")
];

export const dailyFoodLine = {
  id: "daily-snacks",
  label: "Ежедневно: вода, фрукты, мороженое, bakery, snacks детям, кофе / напитки",
  rubEstimate: 4200,
  status: "ориентир / редактируется"
};
