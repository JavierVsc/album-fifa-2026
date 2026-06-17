const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

let cachedApi;

async function loadApi() {
  if (cachedApi) return cachedApi;
  const appPath = path.resolve(__dirname, "..", "app.js");
  await import(`${pathToFileURL(appPath).href}?case=${Date.now()}-${Math.random()}`);
  cachedApi = globalThis.__albumTestApi;
  return cachedApi;
}

test("exposes pure helpers outside the browser", async () => {
  const api = await loadApi();

  assert.equal(typeof api.createMovementEntry, "function");
  assert.equal(typeof api.formatDateTimeParts, "function");
  assert.equal(typeof api.getDashboardMetrics, "function");
});

test("formats local date and time for movement rows", async () => {
  const api = await loadApi();
  const parts = api.formatDateTimeParts(new Date(2026, 5, 17, 21, 5, 0));

  assert.deepEqual(parts, {
    date: "17/06/2026",
    time: "21:05",
  });
});

test("creates movement text for normal finds and exchange finds", async () => {
  const api = await loadApi();
  const sticker = {
    name: "Alexis Sánchez",
    country: "Chile",
    code: "CHI",
    number: "10",
  };

  const found = api.createMovementEntry("found", sticker, new Date(2026, 5, 17, 21, 5, 0));
  const exchange = api.createMovementEntry("foundExchange", sticker, new Date(2026, 5, 17, 21, 6, 0));

  assert.equal(found.text, "Se encontró lámina Alexis Sánchez (Chile; CHI; 10)");
  assert.equal(exchange.text, "Se obtuvo por intercambio lámina Alexis Sánchez (Chile; CHI; 10)");
  assert.equal(found.date, "17/06/2026");
  assert.equal(exchange.time, "21:06");
});

test("creates movement text for bulk group actions", async () => {
  const api = await loadApi();
  const groupSummary = {
    name: "Grupo A",
    country: "Grupo A",
    code: "A",
    number: "18",
  };

  const found = api.createMovementEntry("bulkFound", groupSummary, new Date(2026, 5, 17, 21, 7, 0));
  const cleared = api.createMovementEntry("bulkCleared", groupSummary, new Date(2026, 5, 17, 21, 8, 0));

  assert.equal(found.text, "Se marcó grupo visible como encontrado (Grupo A; 18 láminas actualizadas)");
  assert.equal(cleared.text, "Se limpió grupo visible (Grupo A; 18 láminas actualizadas)");
});

test("computes dashboard metrics as found over total", async () => {
  const api = await loadApi();
  const state = {
    a: { owned: true, duplicates: 0 },
    b: { owned: true, duplicates: 2 },
    c: { owned: false, duplicates: 0 },
  };

  assert.deepEqual(api.getDashboardMetrics(state, 10), {
    owned: 2,
    total: 10,
    missing: 8,
    duplicates: 2,
    progress: 20,
    foundLabel: "2/10",
  });
}
);
