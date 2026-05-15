const defaults = {
  route: "A",
  manualDate: "",
  rates: null,
  selectedOptions: ["extra-taxi", "airport-food"],
  cityFilter: "all",
  checklist: {},
  dayPlans: {},
  plannerDayId: "",
  budgetOverrides: {},
  budgetNotes: ""
};

const key = "asiaFamilyTrip2026State";

export function loadState() {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(key)) || {}) };
  } catch {
    return { ...defaults };
  }
}

export function saveState(next) {
  localStorage.setItem(key, JSON.stringify(next));
}

export function updateState(patch) {
  const next = { ...loadState(), ...patch };
  saveState(next);
  return next;
}
