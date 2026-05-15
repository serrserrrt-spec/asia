export const sources = [
  { id: "waterbom", label: "Waterbom Bali tickets / pricing", url: "https://www.waterbom-bali.com/ticket", type: "official", whatItConfirms: "Ticket categories, inclusions, paid extras such as lockers, towels, gazebo/cabana.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "hk-disney-tickets", label: "Hong Kong Disneyland tickets", url: "https://www.hongkongdisneyland.com/en-hk/offers-discounts/", type: "official", whatItConfirms: "Ticket calendar, admission tiers, Disney Premier Access offers.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "ocean-park-tickets", label: "Ocean Park Hong Kong tickets", url: "https://www.oceanpark.com.hk/en/tickets-and-offers/buy-tickets", type: "official", whatItConfirms: "Admission tickets, age rules, current offers.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "peak-tram", label: "Peak Tram / Sky Terrace 428 tickets", url: "https://ticket-thepeak.com/", type: "official", whatItConfirms: "Peak Tram and Sky Terrace combo tickets.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "canton-tower", label: "Canton Tower official website", url: "https://www.cantontower.com/en/", type: "official", whatItConfirms: "Opening information and ticketing entry point.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "bali-collection", label: "Bali Collection official website", url: "https://bali-collection.com/", type: "official", whatItConfirms: "Nusa Dua dining, shopping, shuttle information.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "devdan", label: "Devdan Show official website", url: "https://www.devdanshow.com/", type: "official", whatItConfirms: "Show schedule, ticket classes, venue.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "love-bali", label: "Love Bali tourist levy", url: "https://lovebali.baliprov.go.id/", type: "official", whatItConfirms: "Tourist levy payment portal and official process.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "mtr", label: "MTR Hong Kong official", url: "https://www.mtr.com.hk/en/customer/main/index.html", type: "transport", whatItConfirms: "MTR network, Airport Express, route information.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "hsr", label: "Hong Kong High Speed Rail official", url: "https://www.highspeed.mtr.com.hk/en/main/", type: "transport", whatItConfirms: "West Kowloon HSR fares, timetable search, station process.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "chimelong", label: "Chimelong Safari Park official / ticketing", url: "https://www.chimelong.com/", type: "official", whatItConfirms: "Official entry point; exact 2026 international ticketing needs verification.", lastChecked: "2026-05-15", status: "needs verification" },
  { id: "ihg-holiday-inn-gz", label: "Holiday Inn Guangzhou Zhujiang New Town", url: "https://www.ihg.com/holidayinn/hotels/us/en/guangzhou/cannt/hoteldetail/directions", type: "official", whatItConfirms: "Hotel address: 62 Jinsui Road, Tianhe District, Zhujiang New Town.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "gz-taxi-fares", label: "Guangzhou official taxi fare rules", url: "https://www.gz.gov.cn/attachment/7/7792/7792046/10199330.pdf", type: "transport", whatItConfirms: "Taxi start fare and per-kilometer fare in Guangzhou; used to cap CAN ↔ Zhujiang New Town estimate.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "gz-airport-city-taxi", label: "Guangzhou airport to Zhujiang New Town taxi estimate", url: "https://airports.guide/CAN", type: "open-source", whatItConfirms: "Airport taxi estimate to Zhujiang New Town around 110-140 CNY plus toll/traffic buffer.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "bali-airport-taxi", label: "Bali airport to Nusa Dua taxi estimate", url: "https://bali-dps-airport.com/transfers/airport-taxi/", type: "open-source", whatItConfirms: "DPS to Nusa Dua fixed taxi range used for arrival/departure planning.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "bali-private-car", label: "Bali private driver 10-hour estimate", url: "https://go2-bali.com/blog/bali-private-driver-cost-guide/", type: "open-source", whatItConfirms: "Private driver day rate estimate for Ubud, Safari, Uluwatu long days.", lastChecked: "2026-05-15", status: "needs recheck" },
  { id: "hk-airport-taxi", label: "Hong Kong airport taxi to Tsim Sha Tsui", url: "https://www.hongkong.net/transportation/to-from-airport", type: "open-source", whatItConfirms: "Taxi estimate from HKG to Tsim Sha Tsui/Kowloon with luggage/tunnel buffer.", lastChecked: "2026-05-15", status: "needs recheck" }
];

export const mapSource = (query) => ({
  label: `Google Maps: ${query}`,
  url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
  type: "maps",
  whatItConfirms: "Location, route planning, live traffic and opening context.",
  lastChecked: "2026-05-15",
  status: "live"
});
