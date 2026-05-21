const baseFields = {
  duration: "1-3 ч",
  kidsFit: "хорошо подходит",
  instagramValue: "высокая",
  budgetNote: "ориентир / редактируется / перепроверить",
  officialSourceUrl: "",
  openSourceUrl: "",
};

const loc = (id, country, city, zone, name, type, routeFit, priority, extra = {}) => ({
  id, country, city, zone, name, type, routeFit, priority,
  whatToSee: extra.whatToSee || name,
  whyGo: extra.whyGo || `${name}: точка в зоне ${zone}, которую стоит держать как ${priority === "must" ? "обязательный" : "гибкий"} элемент маршрута ${city}.`,
  bestTime: extra.bestTime || "Утро или ближе к вечеру",
  idealScenario: extra.idealScenario || routeFit.join("/"),
  foodNearby: extra.foodNearby || `Искать семейную еду рядом с ${zone}; если дети устали, переносить прием пищи в ближайший молл/отель.`,
  risk: extra.risk || `${name}: возможны жара, очереди или пробки; часы работы перепроверить в день визита.`,
  planB: extra.planB || `Сократить ${name} до короткого захода и заменить на ближайший крытый вариант.`,
  googleMapsQuery: extra.googleMapsQuery || `${name}, ${city}`,
  transportFromBase: extra.transportFromBase || `${name}: с детьми проще такси/private car; общественный транспорт использовать только при прямом маршруте.`,
  taxiInstruction: extra.taxiInstruction || `Для такси сохранить точку ${name} в Google Maps и местное название, если доступно.`,
  publicTransportInstruction: extra.publicTransportInstruction || `До ${name} ехать метро/MTR только если маршрут прямой; перед выходом проверить Google/официальное приложение.`,
  ...baseFields,
  ...extra
});

const rawLocations = [
  loc("gz-canton-tower", "China", "Guangzhou", "Haizhu", "Canton Tower", "viewpoint", ["A","B","C"], "must", { officialSourceUrl: "https://www.cantontower.com/en/", bestTime: "Sunset if visibility is good", risk: "Bad visibility and queues; tickets need recheck." }),
  loc("gz-huacheng", "China", "Guangzhou", "Zhujiang New Town", "Huacheng Square", "walk", ["A","B","C"], "high"),
  loc("gz-zhujiang", "China", "Guangzhou", "Tianhe", "Zhujiang New Town", "district", ["A","B","C"], "high"),
  loc("gz-chen-clan", "China", "Guangzhou", "Liwan", "Chen Clan Ancestral Hall", "culture", ["A","B","C"], "high", { bestTime: "Morning", foodNearby: "Dian Dou De / Tao Tao Ju by taxi" }),
  loc("gz-yongqing", "China", "Guangzhou", "Liwan", "Yongqing Fang", "old town", ["A","B","C"], "high", { whatToSee: "Renovated Xiguan streets, small shops, Bruce Lee heritage context" }),
  loc("gz-shamian", "China", "Guangzhou", "Liwan", "Shamian Island", "walk", ["A","C"], "high", { whyGo: "Calmer colonial-era island walk after old Guangzhou." }),
  loc("gz-pearl-cruise", "China", "Guangzhou", "Pearl River", "Pearl River Night Cruise", "cruise", ["B","C"], "high", { bestTime: "Evening", risk: "Late finish can overload kids after a hot day." }),
  loc("gz-chimelong", "China", "Guangzhou", "Panyu", "Chimelong Safari Park", "theme park", ["B"], "high", { officialSourceUrl: "https://www.chimelong.com/", duration: "6-8 h", risk: "Exact 2026 ticketing needs verification; heat and crowds." }),
  loc("gz-grandview", "China", "Guangzhou", "Tianhe", "Grandview Mall", "mall", ["A","B","C"], "high", { whyGo: "Strong heat/rain fallback with food, shopping, aquarium-style attractions nearby." }),
  loc("gz-guangdong-museum", "China", "Guangzhou", "Zhujiang New Town", "Guangdong Museum", "museum", ["A","C"], "optional"),
  loc("gz-taikoo-hui", "China", "Guangzhou", "Tianhe", "Taikoo Hui", "mall", ["C"], "premium"),
  loc("gz-parc-central", "China", "Guangzhou", "Tianhe", "Parc Central", "mall", ["A","C"], "high"),
  loc("gz-beijing-road", "China", "Guangzhou", "Yuexiu", "Beijing Road", "shopping street", ["B"], "optional", { risk: "Can be crowded and hot; use only if logistics fit." }),
  loc("gz-dian-dou-de", "China", "Guangzhou", "Multiple", "Dian Dou De", "restaurant", ["A","B","C"], "must"),
  loc("gz-tao-tao-ju", "China", "Guangzhou", "Multiple", "Tao Tao Ju", "restaurant", ["A","B","C"], "high"),
  loc("gz-bingsheng", "China", "Guangzhou", "Multiple", "Bingsheng", "restaurant", ["A","B","C"], "high"),
  loc("gz-can", "China", "Guangzhou", "Airport", "Guangzhou Baiyun International Airport", "airport", ["A","B","C"], "must", { googleMapsQuery: "Guangzhou Baiyun International Airport" }),
  loc("gz-south", "China", "Guangzhou", "Panyu", "Guangzhou South Railway Station", "transport", ["A","B","C"], "must"),

  loc("bali-melia", "Indonesia", "Bali", "Nusa Dua", "Melia Nusa Dua", "hotel", ["A","B","C"], "must", { bestTime: "Base", googleMapsQuery: "Melia Bali Nusa Dua" }),
  loc("bali-collection", "Indonesia", "Bali", "Nusa Dua", "Bali Collection", "dining shopping", ["A","B","C"], "high", { officialSourceUrl: "https://bali-collection.com/" }),
  loc("bali-water-blow", "Indonesia", "Bali", "Nusa Dua", "Water Blow Nusa Dua", "nature", ["A","C"], "high", { risk: "Waves and slippery areas; keep kids back from edges." }),
  loc("bali-waterbom", "Indonesia", "Bali", "Kuta", "Waterbom Bali", "water park", ["A","B","C"], "must", { officialSourceUrl: "https://www.waterbom-bali.com/ticket", duration: "5-7 h" }),
  loc("bali-uluwatu", "Indonesia", "Bali", "Uluwatu", "Uluwatu Temple", "temple", ["A","B","C"], "must", { bestTime: "Late afternoon", risk: "Monkeys, sunset crowds, cliff edges." }),
  loc("bali-kecak", "Indonesia", "Bali", "Uluwatu", "Kecak Dance Uluwatu", "show", ["A","B","C"], "high", { bestTime: "Sunset", risk: "Tickets sell out; reserve buffer." }),
  loc("bali-melasti", "Indonesia", "Bali", "Ungasan", "Melasti Beach", "beach", ["A","B","C"], "high"),
  loc("bali-palmilla", "Indonesia", "Bali", "Melasti", "Palmilla Bali", "beach club", ["C"], "premium", { whyGo: "Calmer family beach-club option at Melasti." }),
  loc("bali-koral", "Indonesia", "Bali", "Nusa Dua", "Koral Restaurant, Apurva Kempinski", "premium restaurant", ["C"], "premium", { whyGo: "Signature underwater dining experience; reservation required." }),
  loc("bali-devdan", "Indonesia", "Bali", "Nusa Dua", "Devdan Show", "show", ["A","B","C"], "high", { officialSourceUrl: "https://www.devdanshow.com/" }),
  loc("bali-pasar-badung", "Indonesia", "Bali", "Denpasar", "Pasar Badung", "market", ["B"], "optional", { risk: "Hygiene, heat, traffic; buy only safe fruits." }),
  loc("bali-pepito", "Indonesia", "Bali", "Nusa Dua / Kuta", "Pepito / GrandLucky", "grocery", ["A","B","C"], "high", { whyGo: "Safe alternative for fruits, water, snacks." }),
  loc("bali-kedonganan", "Indonesia", "Bali", "Jimbaran", "Kedonganan Fish Market", "market", ["B"], "optional"),
  loc("bali-jimbaran", "Indonesia", "Bali", "Jimbaran", "Jimbaran seafood dinner", "restaurant area", ["A","B","C"], "high"),
  loc("bali-safari", "Indonesia", "Bali", "Gianyar", "Bali Safari and Marine Park", "theme park", ["B","C"], "high", { duration: "6-8 h" }),
  loc("bali-tanjung-benoa", "Indonesia", "Bali", "Tanjung Benoa", "Tanjung Benoa watersports", "activity", ["B"], "optional", { risk: "Weather, vendor quality; book conservatively with children." }),
  loc("bali-ubud", "Indonesia", "Bali", "Ubud", "Ubud", "day trip", ["B","C"], "high", { duration: "8-10 h", transportFromBase: "Private car for the full day." }),
  loc("bali-celuk", "Indonesia", "Bali", "Celuk", "Celuk silver workshops", "craft", ["C"], "optional"),
  loc("bali-monkey", "Indonesia", "Bali", "Ubud", "Monkey Forest", "nature", ["B"], "optional", { priority: "avoid", risk: "Monkey bites/theft risk; skip if kids are tired." }),
  loc("bali-tegallalang", "Indonesia", "Bali", "Ubud", "Tegallalang", "rice terraces", ["B","C"], "high"),
  loc("bali-dps", "Indonesia", "Bali", "Airport", "Denpasar DPS Airport", "airport", ["A","B","C"], "must"),

  loc("hk-tst", "Hong Kong", "Hong Kong", "Tsim Sha Tsui", "Tsim Sha Tsui Promenade", "walk", ["A","B","C"], "must"),
  loc("hk-avenue-stars", "Hong Kong", "Hong Kong", "Tsim Sha Tsui", "Avenue of Stars", "walk", ["A","B","C"], "high"),
  loc("hk-k11", "Hong Kong", "Hong Kong", "Tsim Sha Tsui", "K11 Musea", "mall museum", ["A","C"], "high"),
  loc("hk-harbour-city", "Hong Kong", "Hong Kong", "Tsim Sha Tsui", "Harbour City", "mall", ["A","C"], "high"),
  loc("hk-symphony", "Hong Kong", "Hong Kong", "Victoria Harbour", "Symphony of Lights", "show", ["A","B","C"], "high"),
  loc("hk-disneyland", "Hong Kong", "Hong Kong", "Lantau", "Hong Kong Disneyland", "theme park", ["A","B","C"], "must", { officialSourceUrl: "https://www.hongkongdisneyland.com/en-hk/offers-discounts/", duration: "8-10 h", publicTransportInstruction: "MTR to Disneyland Resort via Sunny Bay." }),
  loc("hk-ocean-park", "Hong Kong", "Hong Kong", "Aberdeen", "Ocean Park", "theme park", ["B"], "optional", { officialSourceUrl: "https://www.oceanpark.com.hk/en/tickets-and-offers/buy-tickets" }),
  loc("hk-victoria-peak", "Hong Kong", "Hong Kong", "The Peak", "Victoria Peak", "viewpoint", ["A","B","C"], "high", { bestTime: "Clear afternoon or evening", risk: "Bad visibility; use mall/museum fallback." }),
  loc("hk-peak-tram", "Hong Kong", "Hong Kong", "Central", "Peak Tram", "transport attraction", ["A","B","C"], "high", { officialSourceUrl: "https://ticket-thepeak.com/" }),
  loc("hk-sky-terrace", "Hong Kong", "Hong Kong", "The Peak", "Sky Terrace 428", "viewpoint", ["A","B","C"], "high", { officialSourceUrl: "https://ticket-thepeak.com/" }),
  loc("hk-mplus", "Hong Kong", "Hong Kong", "West Kowloon", "M+ Museum", "museum", ["C"], "high"),
  loc("hk-palace", "Hong Kong", "Hong Kong", "West Kowloon", "Hong Kong Palace Museum", "museum", ["C"], "high"),
  loc("hk-ifc", "Hong Kong", "Hong Kong", "Central", "IFC / Central", "mall district", ["A","C"], "high"),
  loc("hk-tim-ho-wan", "Hong Kong", "Hong Kong", "Multiple", "Tim Ho Wan", "restaurant", ["A","B","C"], "high"),
  loc("hk-west-kowloon", "Hong Kong", "Hong Kong", "West Kowloon", "Hong Kong West Kowloon Station", "transport", ["A","B","C"], "must", { officialSourceUrl: "https://www.highspeed.mtr.com.hk/en/main/" }),
  loc("hk-hkg", "Hong Kong", "Hong Kong", "Airport", "Hong Kong International Airport", "airport", ["A","B","C"], "must")
];

const locationDetails = {
  "gz-canton-tower": {
    whatToSee: "Вечерняя подсветка, панорама Zhujiang New Town, вид на Pearl River и башни IFC/CTF.",
    whyGo: "Главная визуальная точка Гуанчжоу. Идти только при хорошей видимости, иначе ценность резко падает.",
    bestTime: "За 45-60 минут до заката",
    foodNearby: "Перед/после лучше есть в Parc Central, Taikoo Hui или Zhujiang New Town; у самой башни еда менее удобна.",
    transportFromBase: "От Holiday Inn Zhujiang New Town: такси 10-25 мин, 25-60 CNY. Метро возможно, но с детьми вечером проще такси.",
    taxiInstruction: "Показать водителю Canton Tower / 广州塔. На обратный путь закладывать очередь на такси после заката.",
    publicTransportInstruction: "Метро до Canton Tower или Zhujiang New Town, затем пешком по ситуации.",
    planB: "Если дымка/дождь — не подниматься, заменить на Huacheng Square + ужин в молле.",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Canton_Tower_at_Night_20230722.jpg",
    photoCredit: "Wikimedia Commons"
  },
  "gz-huacheng": {
    whatToSee: "Ось города, открытая площадь, вид на Canton Tower, Guangzhou Opera House и ночную подсветку.",
    whyGo: "Самая простая прогулка от района отеля без сложной логистики.",
    foodNearby: "Parc Central, Mall of the World, рестораны Zhujiang New Town.",
    transportFromBase: "От Holiday Inn: 5-15 мин на такси или короткая прогулка/метро по погоде.",
    taxiInstruction: "Просить высадить у Huacheng Square / 花城广场, не у дальнего входа в подземный молл.",
    publicTransportInstruction: "Метро Zhujiang New Town / Huacheng Dadao, дальше пешком.",
    planB: "При жаре уйти в Parc Central или Mall of the World."
  },
  "gz-chen-clan": {
    whatToSee: "Резьба по дереву и камню, керамические крыши, дворики, традиционная архитектура Lingnan.",
    whyGo: "Лучшее короткое культурное место в Гуанчжоу: красиво, компактно, понятно детям.",
    foodNearby: "После визита ехать на dim sum в Dian Dou De / Tao Tao Ju.",
    transportFromBase: "От Holiday Inn: такси 25-40 мин, 45-90 CNY; метро дешевле, но с пересадками.",
    taxiInstruction: "Показать Chen Clan Ancestral Hall / 陈家祠.",
    publicTransportInstruction: "Метро до Chen Clan Academy, затем пешком 5-10 мин.",
    planB: "Если закрыто или дети устали — Yongqing Fang + обед, без музея."
  },
  "gz-yongqing": {
    whatToSee: "Отреставрированные улицы Xiguan, маленькие лавки, дворики, Bruce Lee heritage context.",
    whyGo: "Мягкий старый город без перегруза рынками и толпой.",
    foodNearby: "Кафе и чайные на месте; полноценный обед лучше в Tao Tao Ju/Dian Dou De.",
    transportFromBase: "После Chen Clan ехать такси 10-20 мин или совместить пешком при нормальной погоде.",
    taxiInstruction: "Yongqing Fang / 永庆坊, высадка у главного входа.",
    publicTransportInstruction: "Метро Huangsha или Changshou Lu, затем пешком.",
    planB: "Если жарко — сократить до 40 минут и уйти на Shamian Island или в молл."
  },
  "gz-shamian": {
    whatToSee: "Тенистые улицы, европейская застройка, спокойная прогулка, фото без гонки.",
    whyGo: "Низкий стресс после старого города; хорошо для детей и короткой паузы.",
    foodNearby: "Кафе на острове; полноценный ужин лучше вернуть в Tianhe.",
    transportFromBase: "От Holiday Inn такси 30-45 мин. После Yongqing Fang такси 10-15 мин.",
    taxiInstruction: "Shamian Island / 沙面岛.",
    publicTransportInstruction: "Метро Huangsha, затем пешком через мост.",
    planB: "При дожде пропустить и ехать в Grandview / Parc Central."
  },
  "gz-grandview": {
    whatToSee: "Фудкорт, магазины, детские indoor-активности, кондиционер.",
    whyGo: "Главный спасательный вариант при жаре, дожде или усталости.",
    foodNearby: "Внутри много семейной еды; удобно для простого обеда.",
    transportFromBase: "От Holiday Inn: такси 10-20 мин или метро/пешком по погоде.",
    taxiInstruction: "Grandview Mall / 正佳广场.",
    publicTransportInstruction: "Метро Tiyu Xilu / Tianhe Sports Center, дальше пешком.",
    planB: "Если слишком людно — Parc Central или Taikoo Hui."
  },
  "bali-waterbom": {
    whatToSee: "Семейные горки, lazy river, детские зоны, большие водные аттракционы с паузами.",
    whyGo: "Самый понятный детям платный день на Бали; хорошо чередуется с пляжными днями.",
    bestTime: "К открытию, чтобы пройти лучшие горки до жары и очередей",
    foodNearby: "Есть фудкорт внутри; выходить наружу днем неудобно.",
    transportFromBase: "От Melia Nusa Dua: такси 35-60 мин, 250k-400k IDR в одну сторону.",
    taxiInstruction: "Заказать Grab/Gojek/taxi заранее; на обратный путь заложить пробки Kuta.",
    publicTransportInstruction: "Не рекомендовано для семьи с детьми.",
    planB: "При сильном дожде/усталости заменить на бассейн Melia + Bali Collection.",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Waterboom_park,_Kuta,_Bali,_Indonesia_-_panoramio.jpg",
    photoCredit: "Wikimedia Commons"
  },
  "bali-uluwatu": {
    whatToSee: "Храм на утесе, океан, закат, Kecak рядом по времени.",
    whyGo: "Самый сильный южный закатный блок Бали, но его нельзя делать без private car.",
    bestTime: "16:00-18:30",
    foodNearby: "После Kecak ехать на ужин в Pecatu/Uluwatu, не искать еду у храма в пиковую толпу.",
    transportFromBase: "От Melia: private car на 5-7 часов, 700k-1.2m IDR.",
    taxiInstruction: "Договориться с водителем ждать до конца Kecak; one-way taxi обратно рискован.",
    publicTransportInstruction: "Не использовать.",
    risk: "Обезьяны, обрыв, толпа на закате; очки/телефоны держать крепко.",
    planB: "Если дети устали — Melasti Beach + ранний ужин без храма.",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Uluwatu_Temple_at_Sunset.jpg",
    photoCredit: "Wikimedia Commons"
  },
  "bali-melasti": {
    whatToSee: "Широкий пляж под скалами, спокойные фото, короткая прогулка без дальнего переезда.",
    whyGo: "Хороший пляжный блок перед Uluwatu или вместо него.",
    foodNearby: "Palmilla Bali или простые beach cafes.",
    transportFromBase: "Melia → Melasti: 35-60 мин на такси/private car.",
    taxiInstruction: "Лучше оставить водителя ждать, если после пляжа едете в Uluwatu.",
    publicTransportInstruction: "Не рекомендовано.",
    planB: "Если волны/ветер — Palmilla или возврат в Nusa Dua."
  },
  "bali-ubud": {
    whatToSee: "Ремесленные деревни, рисовые террасы Tegallalang, семейный обед, при желании короткий центр Ubud.",
    whyGo: "Культурный контраст к Nusa Dua, но только как private car day.",
    bestTime: "Выезд 08:00-08:30",
    foodNearby: "Семейные кафе в Ubud; выбирать место с кондиционером/тенью.",
    transportFromBase: "Melia → Ubud: 90-150 мин. Private car 8-10 часов, 800k-1.5m IDR.",
    taxiInstruction: "Согласовать маршрут заранее: Celuk → lunch → Tegallalang → отель.",
    publicTransportInstruction: "Не использовать.",
    planB: "Сократить до Celuk + обед, без Monkey Forest и дальних рисовых террас."
  },
  "hk-disneyland": {
    whatToSee: "Castle of Magical Dreams, семейные rides, шоу, parade/fireworks по погоде и силам детей.",
    whyGo: "Главный детский день Гонконга; лучше планировать как один большой блок без второй активности.",
    bestTime: "К открытию парка",
    foodNearby: "Питание внутри парка; бюджет выше обычного города.",
    transportFromBase: "TST → Disneyland: MTR через Sunny Bay 40-55 мин или такси 30-45 мин.",
    taxiInstruction: "Такси оправдано вечером, если дети устали.",
    publicTransportInstruction: "MTR до Sunny Bay, пересадка на Disneyland Resort Line.",
    planB: "Если жара/очереди — сократить rides, уйти на шоу/indoor, Premier Access решать на месте."
  },
  "hk-victoria-peak": {
    whatToSee: "Панорама гавани, Central, Kowloon; Sky Terrace только при нормальной видимости.",
    whyGo: "Лучший вид Гонконга, но день должен быть гибким из-за погоды.",
    bestTime: "Ясный день, лучше до вечернего пика очередей",
    foodNearby: "Peak Galleria / Central / IFC после спуска.",
    transportFromBase: "TST → Central MTR, затем Peak Tram/taxi. С багажом лучше не совмещать.",
    taxiInstruction: "Вверх можно taxi до Peak Tower, вниз по ситуации.",
    publicTransportInstruction: "MTR до Central, далее пешком/такси к Peak Tram.",
    planB: "Если облака — M+ / Palace Museum / K11, без оплаты обзорной площадки.",
    photoUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/1_hongkong_panorama_victoria_peak_2011.JPG",
    photoCredit: "Wikimedia Commons"
  }
};

export const locations = rawLocations.map((location) => ({ ...location, ...(locationDetails[location.id] || {}) }));
