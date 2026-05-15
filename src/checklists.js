import { loadState, updateState } from "./state.js";

export function isChecked(listId, item) {
  const state = loadState();
  return Boolean(state.checklist?.[`${listId}:${item}`]);
}

export function toggleChecklist(listId, item) {
  const state = loadState();
  const id = `${listId}:${item}`;
  updateState({ checklist: { ...(state.checklist || {}), [id]: !state.checklist?.[id] } });
}

export function checklistProgress(list) {
  const done = list.items.filter((item) => isChecked(list.id, item)).length;
  return { done, total: list.items.length, pct: Math.round((done / list.items.length) * 100) };
}
