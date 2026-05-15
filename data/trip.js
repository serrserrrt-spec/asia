export const trip = {
  id: "asia-family-trip-2026",
  name: "Семейное путешествие по Азии 2026",
  dates: { start: "2026-07-20", end: "2026-08-06" },
  family: [
    { label: "Взрослый 1", tariff: "взрослый тариф" },
    { label: "Взрослый 2", tariff: "взрослый тариф" },
    { label: "Девочка 12 лет", tariff: "считать взрослым, если детский тариф до 11 лет" },
    { label: "Девочка 7 лет", tariff: "детский тариф, если доступен" }
  ],
  bases: [
    { city: "Guangzhou", dates: "20.07-23.07", base: "Holiday Inn Guangzhou Zhujiang New Town, 62 Jinsui Road, Tianhe" },
    { city: "Bali", dates: "23.07-01.08", base: "Melia Nusa Dua" },
    { city: "Hong Kong", dates: "01.08-03.08", base: "Отель в TST или у гавани" },
    { city: "Guangzhou", dates: "03.08-06.08", base: "Holiday Inn Guangzhou Zhujiang New Town, 62 Jinsui Road, Tianhe" }
  ],
  flights: [
    { date: "2026-07-20", title: "Прилет в Гуанчжоу", detail: "Прилет CAN 14:20" },
    { date: "2026-07-23", title: "Гуанчжоу → Бали", detail: "Вылет CAN 02:35, прилет DPS 07:20" },
    { date: "2026-08-01", title: "Бали → Гонконг", detail: "Вылет DPS 08:05" },
    { date: "2026-08-03", title: "Гонконг → Гуанчжоу", detail: "Скоростной поезд West Kowloon → Guangzhou South" },
    { date: "2026-08-06", title: "Вылет из Гуанчжоу", detail: "Вылет CAN 17:20" }
  ],
  scenarios: {
    A: { name: "Семейный баланс", label: "A - Семейный баланс", color: "blue", reserveRate: 0.12 },
    B: { name: "Максимум впечатлений", label: "B - Максимум впечатлений", color: "green", reserveRate: 0.15 },
    C: { name: "Премиум без перегруза", label: "C - Премиум без перегруза", color: "gold", reserveRate: 0.15 }
  },
  importantRule: "Все цены являются ориентировочными, редактируемыми и требуют перепроверки перед поездкой."
};
