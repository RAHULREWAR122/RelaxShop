const NUMBER_FIELDS = ["price", "rating", "availableQty"];
const STRING_FIELDS = ["title", "thumbnail", "desc", "category"];

// Whitelists and validates product fields from an admin request.
export function cleanProduct(input = {}, { partial }) {
  const data = {};

  for (const key of STRING_FIELDS) {
    if (key in input) data[key] = String(input[key] ?? "").trim();
  }
  for (const key of NUMBER_FIELDS) {
    if (key in input && input[key] !== "") data[key] = Number(input[key]);
  }
  if ("imgs" in input) {
    data.imgs = (Array.isArray(input.imgs) ? input.imgs : [])
      .map((s) => String(s).trim())
      .filter(Boolean);
  }

  if (!partial) {
    for (const key of STRING_FIELDS) if (!data[key]) return { error: `${key} is required` };
    for (const key of NUMBER_FIELDS) if (data[key] === undefined) return { error: `${key} is required` };
    if (!data.imgs?.length) data.imgs = [data.thumbnail];
  }

  for (const key of NUMBER_FIELDS) {
    if (key in data && (!Number.isFinite(data[key]) || data[key] < 0)) {
      return { error: `${key} must be a positive number` };
    }
  }
  if ("rating" in data && data.rating > 5) return { error: "rating must be between 0 and 5" };
  if ("availableQty" in data) data.availableQty = Math.floor(data.availableQty);

  return { data };
}
