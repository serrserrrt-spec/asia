const t = (id, date, city, from, to, taxiTime, taxiBudget, publicTime, publicBudget, extra = {}) => ({
  id, date, city, from, to,
  modeTaxi: extra.modeTaxi || "Такси / private car",
  taxiInstruction: extra.taxiInstruction || "С детьми, жарой, багажом, ранним вылетом или вечерним возвратом лучше такси/private car.",
  taxiTime, taxiBudget,
  modePublic: extra.modePublic || "Общественный транспорт",
  publicInstruction: extra.publicInstruction || "Использовать метро/MTR по ситуации; перед поездкой проверить маршрут в официальном приложении.",
  publicTime, publicBudget,
  whenTaxiBetter: extra.whenTaxiBetter || "Жара, багаж, уставшие дети, поздний возврат или дождь.",
  whenPublicBetter: extra.whenPublicBetter || "Мало вещей, прямой MTR/метро-маршрут, нет давления по времени.",
  risk: extra.risk || "Пробки и изменения расписания; нужен буфер.",
  googleMapsRouteQuery: `${from} to ${to}`
});

export const transportMoves = [
  t("gz-can-hotel","2026-07-20","Guangzhou","Guangzhou Baiyun Airport","Holiday Inn Guangzhou Zhujiang New Town","45-70 min","110-180 CNY / до 5 000 ₽ при prebook","65-90 min","8-15 CNY"),
  t("gz-hotel-liwan","2026-07-21","Guangzhou","Holiday Inn Guangzhou Zhujiang New Town","Chen Clan / Yongqing Fang","20-40 min","45-90 CNY","30-50 min","4-8 CNY"),
  t("gz-hotel-tower","2026-07-22","Guangzhou","Holiday Inn Guangzhou Zhujiang New Town","Canton Tower / Huacheng Square","10-25 min","25-60 CNY","15-30 min","3-6 CNY"),
  t("gz-hotel-chimelong","2026-08-04","Guangzhou","Holiday Inn Guangzhou Zhujiang New Town","Chimelong Safari Park","40-70 min","140-240 CNY","60-90 min","8-15 CNY"),
  t("gz-city-south","2026-08-03","Guangzhou","Holiday Inn Guangzhou Zhujiang New Town","Guangzhou South Railway Station","35-60 min","120-220 CNY","45-70 min","8-15 CNY"),
  t("gz-city-can","2026-08-06","Guangzhou","Holiday Inn Guangzhou Zhujiang New Town","Guangzhou Baiyun Airport","45-75 min","110-180 CNY / до 5 000 ₽ при prebook","65-90 min","8-15 CNY"),
  t("bali-dps-melia","2026-07-23","Bali","DPS airport","Melia Nusa Dua","25-45 min","300k-450k IDR","не практично","-", { publicInstruction: "Общественный транспорт не рекомендован при прилете с багажом." }),
  t("bali-melia-waterbom","2026-07-25","Bali","Melia Nusa Dua","Waterbom Bali","35-60 min","250k-400k IDR в одну сторону","не практично","-"),
  t("bali-melia-uluwatu","2026-07-26","Bali","Melia Nusa Dua","Uluwatu","45-80 min","800k-1.2m IDR машина","не практично","-", { taxiInstruction: "На закат и возврат после Kecak лучше private car; разовое такси обратно рискованно." }),
  t("bali-melia-melasti","2026-07-26","Bali","Melia Nusa Dua","Melasti Beach","35-60 min","700k-1.0m IDR блок машины","не практично","-"),
  t("bali-melia-pasar","2026-07-27","Bali","Melia Nusa Dua","Pasar Badung","45-75 min","700k-1.1m IDR блок машины","не практично","-"),
  t("bali-melia-jimbaran","2026-07-27","Bali","Melia Nusa Dua","Kedonganan / Jimbaran","25-45 min","250k-400k IDR в одну сторону","не практично","-"),
  t("bali-melia-safari","2026-07-28","Bali","Melia Nusa Dua","Bali Safari","60-100 min","1.0m-1.4m IDR полный день","не практично","-"),
  t("bali-melia-tanjung","2026-07-29","Bali","Melia Nusa Dua","Tanjung Benoa","15-25 min","120k-250k IDR","не практично","-"),
  t("bali-melia-ubud","2026-07-30","Bali","Melia Nusa Dua","Ubud","90-150 min","1.1m-1.5m IDR полный день","не практично","-", { taxiInstruction: "Private car на 8-10 часов, не точечное такси туда-обратно." }),
  t("bali-melia-dps","2026-08-01","Bali","Melia Nusa Dua","DPS airport","25-45 min","300k-450k IDR","не практично","-"),
  t("hk-hkg-tst","2026-08-01","Hong Kong","Hong Kong Airport","TST hotel","30-45 min такси","350-500 HKD","45-65 min","120-360 HKD", { publicInstruction: "Airport Express до Kowloon/Hong Kong, затем такси/MTR до отеля." }),
  t("hk-tst-disney","2026-08-02","Hong Kong","TST","Hong Kong Disneyland","30-45 min","260-420 HKD","40-55 min","80-150 HKD", { publicInstruction: "MTR до Disneyland Resort через Sunny Bay." }),
  t("hk-tst-ocean","2026-08-02","Hong Kong","TST","Ocean Park","25-40 min","180-320 HKD","35-50 min","60-120 HKD", { publicInstruction: "MTR до Ocean Park через South Island Line." }),
  t("hk-tst-peak","2026-08-03","Hong Kong","TST","Victoria Peak","25-45 min","180-320 HKD","35-60 min","60-130 HKD", { publicInstruction: "MTR до Central, затем пешком/такси до Peak Tram; очереди зависят от дня." }),
  t("hk-hotel-wk","2026-08-03","Hong Kong","Hotel","Hong Kong West Kowloon Station","10-25 min","80-180 HKD","15-30 min","20-50 HKD"),
  t("hk-wk-gz","2026-08-03","Hong Kong","Hong Kong West Kowloon","Guangzhou South by HSR","HSR, не такси","-","~1 ч поезд + буфер на границу","тариф перепроверить", { modeTaxi: "Не применяется", modePublic: "High Speed Rail", publicInstruction: "HSR West Kowloon → Guangzhou South; бронировать через официальный MTR/12306, приехать заранее на cross-boundary process.", whenPublicBetter: "Это основной рекомендованный маршрут." })
];
