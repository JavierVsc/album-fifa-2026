const FIREBASE_ACTIVO = false;

const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI.firebaseapp.com",
  projectId: "PEGA_AQUI_TU_PROJECT_ID",
  storageBucket: "PEGA_AQUI.appspot.com",
  messagingSenderId: "PEGA_AQUI",
  appId: "PEGA_AQUI"
};

const ALBUM_ID = "album-fifa-2026-javier";
const STORAGE_KEY = "album-fifa-2026-progreso";
const UI_SCALE_KEY = "album-fifa-2026-ui-scale";
const STICKER_DATA_KEY = "album-fifa-2026-sticker-data";

const album = [
  { id: "A", title: "Grupo A", type: "team", countries: [{ key: "México", display: "México", code: "MEX" }, { key: "Sudáfrica", display: "Sudáfrica", code: "RSA" }, { key: "Corea del Sur", display: "Corea del Sur", code: "KOR" }, { key: "Chequia", display: "República Checa", code: "CZE" }] },
  { id: "B", title: "Grupo B", type: "team", countries: [{ key: "Canadá", display: "Canadá", code: "CAN" }, { key: "Bosnia y Herzegovina", display: "Bosnia y Herzegovina", code: "BIH" }, { key: "Qatar", display: "Catar", code: "QAT" }, { key: "Suiza", display: "Suiza", code: "SUI" }] },
  { id: "C", title: "Grupo C", type: "team", countries: [{ key: "Brasil", display: "Brasil", code: "BRA" }, { key: "Marruecos", display: "Marruecos", code: "MAR" }, { key: "Haití", display: "Haití", code: "HAI" }, { key: "Escocia", display: "Escocia", code: "SCO" }] },
  { id: "D", title: "Grupo D", type: "team", countries: [{ key: "Estados Unidos", display: "Estados Unidos", code: "USA" }, { key: "Paraguay", display: "Paraguay", code: "PAR" }, { key: "Australia", display: "Australia", code: "AUS" }, { key: "Turquía", display: "Turquía", code: "TUR" }] },
  { id: "E", title: "Grupo E", type: "team", countries: [{ key: "Alemania", display: "Alemania", code: "GER" }, { key: "Curazao", display: "Curazao", code: "CUW" }, { key: "Costa de Marfil", display: "Costa de Marfil", code: "CIV" }, { key: "Ecuador", display: "Ecuador", code: "ECU" }] },
  { id: "F", title: "Grupo F", type: "team", countries: [{ key: "Países Bajos", display: "Países Bajos", code: "NED" }, { key: "Japón", display: "Japón", code: "JPN" }, { key: "Suecia", display: "Suecia", code: "SWE" }, { key: "Túnez", display: "Túnez", code: "TUN" }] },
  { id: "G", title: "Grupo G", type: "team", countries: [{ key: "Bélgica", display: "Bélgica", code: "BEL" }, { key: "Egipto", display: "Egipto", code: "EGY" }, { key: "Irán", display: "Irán", code: "IRN" }, { key: "Nueva Zelanda", display: "Nueva Zelanda", code: "NZL" }] },
  { id: "H", title: "Grupo H", type: "team", countries: [{ key: "España", display: "España", code: "ESP" }, { key: "Cabo Verde", display: "Cabo Verde", code: "CPV" }, { key: "Arabia Saudita", display: "Arabia Saudita", code: "KSA" }, { key: "Uruguay", display: "Uruguay", code: "URU" }] },
  { id: "I", title: "Grupo I", type: "team", countries: [{ key: "Francia", display: "Francia", code: "FRA" }, { key: "Senegal", display: "Senegal", code: "SEN" }, { key: "Irak", display: "Irak", code: "IRQ" }, { key: "Noruega", display: "Noruega", code: "NOR" }] },
  { id: "J", title: "Grupo J", type: "team", countries: [{ key: "Argentina", display: "Argentina", code: "ARG" }, { key: "Argelia", display: "Argelia", code: "ALG" }, { key: "Austria", display: "Austria", code: "AUT" }, { key: "Jordania", display: "Jordania", code: "JOR" }] },
  { id: "K", title: "Grupo K", type: "team", countries: [{ key: "Portugal", display: "Portugal", code: "POR" }, { key: "RD Congo", display: "Congo RD", code: "COD" }, { key: "Uzbekistán", display: "Uzbekistán", code: "UZB" }, { key: "Colombia", display: "Colombia", code: "COL" }] },
  { id: "L", title: "Grupo L", type: "team", countries: [{ key: "Inglaterra", display: "Inglaterra", code: "ENG" }, { key: "Croacia", display: "Croacia", code: "CRO" }, { key: "Ghana", display: "Ghana", code: "GHA" }, { key: "Panamá", display: "Panamá", code: "PAN" }] },
  { id: "FWC", title: "FWC", type: "fwc", countries: [{ key: "FWC", display: "FWC", code: "FWC" }] },
  { id: "CC", title: "Coca-Cola", type: "cc", countries: [{ key: "Coca-Cola", display: "Coca-Cola Latinoamérica / Chile", code: "CC" }] }
];

let state = loadLocalState();
let stickerData = loadLocalStickerData();
let activeTab = "A";
let activeActionKey = null;
let uiScale = loadUiScale();
let docRef = null;
let firebaseReady = false;
let saving = false;

const $ = (selector) => document.querySelector(selector);

Object.assign(window, {
  changeTab,
  openCardActions,
  applyCardAction,
  closeCardModal,
  markVisibleAsOwned,
  clearVisibleTab,
  resetAlbum,
  exportData,
  openImportData,
  importDataFromFile,
  scrollToSection,
  toggleUiScaleMenu,
  changeUiScale,
  resetUiScale
});

function esc(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[char]));
}

function normalizeEntry(value) {
  if (value === "owned") return { owned: true, duplicates: 0 };
  if (value === "duplicate") return { owned: true, duplicates: 1 };

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const owned = value.owned === true || value.status === "owned" || value.status === "duplicate";
    const duplicates = Math.max(0, Math.floor(Number(value.duplicates ?? value.duplicateCount ?? (value.status === "duplicate" ? 1 : 0)) || 0));
    if (owned) return { owned: true, duplicates };
  }

  return null;
}

function migrateState(raw) {
  const migrated = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return migrated;

  Object.entries(raw).forEach(([key, value]) => {
    const normalized = normalizeEntry(value);
    if (normalized) migrated[key] = normalized;
  });

  return migrated;
}

function loadLocalState() {
  try {
    return migrateState(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
  } catch {
    return {};
  }
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  $("#lastUpdateText").textContent = "Último guardado local: " + new Date().toLocaleString("es-CL");
}

function getEntry(key) {
  return state[key] || { owned: false, duplicates: 0 };
}

function setSyncStatus(text, mode = "") {
  const element = $("#syncStatus");
  element.textContent = text;
  element.className = `badge ${mode}`.trim();
}

async function initFirebase() {
  if (!FIREBASE_ACTIVO) {
    setSyncStatus("Guardado local activo", "offline");
    return;
  }

  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const { getFirestore, doc, onSnapshot, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    docRef = doc(db, "albums", ALBUM_ID);
    firebaseReady = true;
    window.firebaseSetDoc = setDoc;
    window.firebaseServerTimestamp = serverTimestamp;
    setSyncStatus("Sincronización online activa", "online");

    onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      if (data?.cards) {
        state = migrateState(data.cards);
        saveLocalState();
        render();
      }
      if (data?.updatedAt?.toDate) {
        $("#lastUpdateText").textContent = "Última actualización online: " + data.updatedAt.toDate().toLocaleString("es-CL");
      }
    });
  } catch (error) {
    console.error(error);
    setSyncStatus("Error al conectar Firebase", "offline");
  }
}

async function saveCloudState() {
  saveLocalState();
  if (!firebaseReady || !docRef || saving) return;

  saving = true;
  try {
    await window.firebaseSetDoc(docRef, {
      cards: state,
      updatedAt: window.firebaseServerTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error(error);
    setSyncStatus("Error al guardar online", "offline");
  } finally {
    saving = false;
  }
}

function getCardDefs(section) {
  if (section.type === "team") {
    return Array.from({ length: 20 }, (_, index) => ({
      stateNumber: String(index + 1).padStart(2, "0"),
      displayNumber: String(index + 1).padStart(2, "0"),
      dataNumber: String(index + 1)
    }));
  }

  if (section.type === "fwc") {
    return [
      { stateNumber: "FWC 00", displayNumber: "00", dataNumber: "00" },
      ...Array.from({ length: 19 }, (_, index) => ({
        stateNumber: `FWC ${index + 1}`,
        displayNumber: `FWC-${index + 1}`,
        dataNumber: `FWC-${index + 1}`
      }))
    ];
  }

  return Array.from({ length: 14 }, (_, index) => ({
    stateNumber: `CC-${index + 1}`,
    displayNumber: `CC-${index + 1}`,
    dataNumber: `CC-${index + 1}`
  }));
}

function cardKey(sectionId, countryKey, stateNumber) {
  return `${sectionId}|${countryKey}|${stateNumber}`;
}

function totalCards() {
  return album.reduce((sum, section) => sum + section.countries.length * getCardDefs(section).length, 0);
}

function findSection(sectionId) {
  return album.find((section) => section.id === sectionId);
}

function findCardContext(key) {
  const [sectionId, countryKey, stateNumber] = key.split("|");
  const section = findSection(sectionId);
  const country = section?.countries.find((item) => item.key === countryKey);
  const card = section ? getCardDefs(section).find((item) => item.stateNumber === stateNumber) : null;
  return { section, country, card };
}

function getMeta(section, country, card) {
  let meta = null;
  if (section?.type === "team") meta = stickerData.teams?.[country.code]?.[card.dataNumber];
  if (section?.type === "fwc") meta = stickerData.fwc?.[card.dataNumber];
  if (section?.type === "cc") meta = stickerData.cc?.[card.dataNumber];

  return {
    country: meta?.country || country?.display || "",
    code: meta?.code || country?.code || section?.id || "",
    number: meta?.number || card?.displayNumber || "",
    name: meta?.name || "Nombre no cargado"
  };
}

function statusText(entry) {
  if (!entry.owned) return "Faltante";
  if (entry.duplicates > 0) return `Repetidas: ${entry.duplicates}`;
  return "Encontrada";
}

function statusClass(entry) {
  if (!entry.owned) return "";
  return entry.duplicates > 0 ? "duplicate" : "owned";
}

function renderTabs() {
  $("#tabs").innerHTML = album.map((section) => `
    <button class="tab-btn ${section.id === activeTab ? "active" : ""}" onclick="changeTab('${section.id}')">
      ${esc(section.id)}
    </button>
  `).join("");
}

function changeTab(tabId) {
  activeTab = tabId;
  renderTabs();
  renderContent();
}

function renderContent() {
  const section = findSection(activeTab);
  const cards = getCardDefs(section);

  $("#content").innerHTML = `
    <h2 class="group-title">${esc(section.title)}</h2>
    <div class="countries">
      ${section.countries.map((country) => `
        <article class="country">
          <h3>${esc(country.display)} <small>${esc(country.code)} · ${cards.length} láminas</small></h3>
          <div class="cards-grid">
            ${cards.map((card) => {
              const key = cardKey(section.id, country.key, card.stateNumber);
              const entry = getEntry(key);
              const meta = getMeta(section, country, card);
              return `
                <button class="card-btn ${statusClass(entry)}" data-key="${esc(key)}">
                  <span class="sticker-number">${esc(meta.code)} ${esc(meta.number)}</span>
                  <span class="sticker-name">${esc(meta.name)}</span>
                  <span class="sticker-status">${esc(statusText(entry))}</span>
                </button>
              `;
            }).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".card-btn[data-key]").forEach((button) => {
    button.addEventListener("click", () => openCardActions(button.dataset.key));
  });
}

function updateStats() {
  let owned = 0;
  let duplicates = 0;

  Object.values(state).forEach((entry) => {
    if (entry.owned) owned += 1;
    duplicates += Number(entry.duplicates) || 0;
  });

  const missing = totalCards() - owned;
  const progress = totalCards() ? Math.round((owned / totalCards()) * 100) : 0;

  $("#progressText").textContent = `${progress}%`;
  $("#ownedText").textContent = owned;
  $("#missingText").textContent = missing;
  $("#duplicateText").textContent = duplicates;
  $("#progressBar").style.width = `${progress}%`;
}

function getAllCollections(groupId = "") {
  return album
    .filter((section) => !groupId || section.id === groupId)
    .flatMap((section) => section.countries.map((country) => ({
      id: `${section.id}|${country.key}`,
      section,
      country
    })));
}

function renderGroupOptions(selectId, selectedValue) {
  const select = document.getElementById(selectId);
  select.innerHTML = [
    `<option value="">Todos los grupos</option>`,
    ...album.map((section) => `<option value="${esc(section.id)}">${esc(section.title)}</option>`)
  ].join("");
  select.value = selectedValue || "";
}

function renderCountryOptions(selectId, groupId, selectedValue) {
  const select = document.getElementById(selectId);
  const collections = getAllCollections(groupId);
  select.innerHTML = [
    `<option value="">Todos los países/secciones</option>`,
    ...collections.map((item) => `<option value="${esc(item.id)}">${esc(item.country.display)}</option>`)
  ].join("");

  const available = collections.some((item) => item.id === selectedValue);
  select.value = available ? selectedValue : "";
}

function setupFilterListeners() {
  ["missing", "duplicate"].forEach((type) => {
    const groupSelect = document.getElementById(`${type}Group`);
    const countrySelect = document.getElementById(`${type}Country`);

    groupSelect.addEventListener("change", () => {
      renderCountryOptions(`${type}Country`, groupSelect.value, "");
      renderFilterResult(type);
    });

    countrySelect.addEventListener("change", () => renderFilterResult(type));
  });
}

function renderFilterControls() {
  ["missing", "duplicate"].forEach((type) => {
    const groupSelect = document.getElementById(`${type}Group`);
    const countrySelect = document.getElementById(`${type}Country`);
    const currentGroup = groupSelect.value || "";
    const currentCountry = countrySelect.value || "";

    renderGroupOptions(`${type}Group`, currentGroup);
    renderCountryOptions(`${type}Country`, currentGroup, currentCountry);
  });
}

function getRowsForCollection(collection, type) {
  return getCardDefs(collection.section)
    .filter((card) => {
      const entry = getEntry(cardKey(collection.section.id, collection.country.key, card.stateNumber));
      return type === "missing" ? !entry.owned : entry.duplicates > 0;
    })
    .map((card) => {
      const key = cardKey(collection.section.id, collection.country.key, card.stateNumber);
      return {
        key,
        card,
        entry: getEntry(key),
        meta: getMeta(collection.section, collection.country, card)
      };
    });
}

function renderFilterResult(type) {
  const groupId = document.getElementById(`${type}Group`).value || "";
  const countryId = document.getElementById(`${type}Country`).value || "";
  const result = document.getElementById(`${type}Result`);
  const label = type === "missing" ? "faltantes" : "repetidas";

  let collections = countryId
    ? getAllCollections().filter((item) => item.id === countryId)
    : getAllCollections(groupId);

  const total = collections.reduce((sum, collection) => sum + getRowsForCollection(collection, type).length, 0);
  const showEmptyGroups = Boolean(groupId || countryId);

  const content = collections.map((collection) => {
    const rows = getRowsForCollection(collection, type);
    if (!showEmptyGroups && rows.length === 0) return "";

    return `
      <section class="filter-country-block">
        <div class="filter-country-title">
          <strong>${esc(collection.country.display)}</strong>
          <span>${esc(collection.section.title)} · ${rows.length} ${label}</span>
        </div>
        ${rows.length ? `
          <div class="card-list">
            ${rows.map((row) => `
              <button class="mini-card ${type === "duplicate" ? "duplicate" : ""}" onclick="openCardActions('${esc(row.key)}')">
                ${esc(row.meta.code)} ${esc(row.meta.number)} · ${esc(row.meta.name)}${type === "duplicate" ? ` x${row.entry.duplicates}` : ""}
              </button>
            `).join("")}
          </div>
        ` : `<p class="filter-empty">Sin cartas ${label} en esta sección.</p>`}
      </section>
    `;
  }).join("");

  result.innerHTML = `
    <div class="filter-summary"><strong>${total}</strong> carta(s) ${label} según el filtro aplicado.</div>
    ${content || `<p class="filter-empty">No hay cartas ${label} para mostrar.</p>`}
  `;
}

function renderFilters() {
  renderFilterControls();
  renderFilterResult("missing");
  renderFilterResult("duplicate");
}

function openCardActions(key) {
  activeActionKey = key;
  const { section, country, card } = findCardContext(key);
  const meta = getMeta(section, country, card);
  const entry = getEntry(key);

  $("#modalTitle").textContent = `${meta.code} ${meta.number}`;
  $("#modalDetail").innerHTML = `
    <strong>${esc(meta.name)}</strong><br>
    ${esc(meta.country)} · Estado: <strong>${esc(statusText(entry))}</strong>
  `;

  const actions = [];
  if (!entry.owned) {
    actions.push(["found", "Marcar como encontrada", "safe"]);
  } else {
    if (entry.duplicates > 0) actions.push(["exchange", "Intercambiar", "safe"]);
    actions.push(["addDuplicate", "Agregar +1 repetida", ""]);
    actions.push(["missing", "Marcar como faltante", "danger"]);
  }

  $("#modalActions").innerHTML = actions.map(([action, text, className]) => `
    <button class="action-btn ${className}" onclick="applyCardAction('${action}')">${text}</button>
  `).join("");

  $("#cardModal").hidden = false;
}

function closeCardModal() {
  activeActionKey = null;
  $("#cardModal").hidden = true;
}

function applyCardAction(action) {
  if (!activeActionKey) return;

  const context = findCardContext(activeActionKey);
  const meta = getMeta(context.section, context.country, context.card);
  const entry = getEntry(activeActionKey);
  const messages = {
    found: `¿Marcar ${meta.code} ${meta.number} - ${meta.name} como encontrada?`,
    addDuplicate: `¿Agregar +1 repetida a ${meta.code} ${meta.number} - ${meta.name}?`,
    exchange: `¿Intercambiar una repetida de ${meta.code} ${meta.number} - ${meta.name}?`,
    missing: `¿Marcar ${meta.code} ${meta.number} - ${meta.name} como faltante?`
  };

  if (!confirm(messages[action] || "¿Confirmar acción?")) return;

  if (action === "found") state[activeActionKey] = { owned: true, duplicates: 0 };
  if (action === "addDuplicate") state[activeActionKey] = { owned: true, duplicates: (entry.duplicates || 0) + 1 };
  if (action === "exchange") state[activeActionKey] = { owned: true, duplicates: Math.max(0, (entry.duplicates || 0) - 1) };
  if (action === "missing") delete state[activeActionKey];

  closeCardModal();
  saveCloudState();
  render();
}

function visibleKeys() {
  const section = findSection(activeTab);
  const cards = getCardDefs(section);
  const keys = [];

  section.countries.forEach((country) => {
    cards.forEach((card) => keys.push(cardKey(section.id, country.key, card.stateNumber)));
  });

  return keys;
}

function markVisibleAsOwned() {
  if (!confirm("¿Marcar todas las láminas faltantes de la pestaña visible como encontradas?")) return;
  visibleKeys().forEach((key) => {
    const entry = getEntry(key);
    if (!entry.owned) state[key] = { owned: true, duplicates: 0 };
  });
  saveCloudState();
  render();
}

function clearVisibleTab() {
  if (!confirm("¿Limpiar solo la pestaña visible?")) return;
  visibleKeys().forEach((key) => delete state[key]);
  saveCloudState();
  render();
}

function resetAlbum() {
  if (!confirm("¿Reiniciar todo el álbum? Esta acción borrará el progreso local de este navegador.")) return;
  state = {};
  saveCloudState();
  render();
}

function exportData() {
  const data = {
    app: "album-fifa-2026",
    version: 3,
    exportedAt: new Date().toISOString(),
    storageKey: STORAGE_KEY,
    albumId: ALBUM_ID,
    cards: state
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `album-fifa-2026-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  alert("Data exportada. Guarda el archivo JSON como respaldo.");
}

function openImportData() {
  $("#dataImportInput").value = "";
  $("#dataImportInput").click();
}

function importDataFromFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const importedState = migrateState(data.cards || data);
      const total = Object.keys(importedState).length;

      if (!confirm(`Se importarán ${total} láminas marcadas. Esto reemplazará la data actual de este navegador. ¿Continuar?`)) return;

      state = importedState;
      saveCloudState();
      render();
      alert("Data importada correctamente.");
    } catch (error) {
      console.error(error);
      alert("No se pudo leer el archivo. Verifica que sea un JSON exportado desde esta página.");
    }
  };
  reader.readAsText(file);
}

function loadLocalStickerData() {
  try {
    return JSON.parse(localStorage.getItem(STICKER_DATA_KEY)) || { teams: {}, fwc: {}, cc: {} };
  } catch {
    return { teams: {}, fwc: {}, cc: {} };
  }
}

function saveStickerData() {
  localStorage.setItem(STICKER_DATA_KEY, JSON.stringify(stickerData));
  updateOfficialStatus();
}

function countStickerRows() {
  return Object.values(stickerData.teams || {}).reduce((sum, team) => sum + Object.keys(team).length, 0)
    + Object.keys(stickerData.fwc || {}).length
    + Object.keys(stickerData.cc || {}).length;
}

function updateOfficialStatus() {
  const total = countStickerRows();
  $("#officialDataStatus").textContent = total
    ? `Base oficial cargada: ${total} láminas con nombre.`
    : "Cargando base oficial de láminas...";
}

function parseStickerText(text) {
  const data = { teams: {}, fwc: {}, cc: {} };
  let section = "teams";

  text.split(/\r?\n/)
    .map((line) => line.trim().replace(/^\uFEFF/, ""))
    .filter(Boolean)
    .forEach((line) => {
      if (line.startsWith("[SECCIÓN ESPECIAL FWC]")) {
        section = "fwc";
        return;
      }
      if (line.startsWith("[SECCIÓN ESPECIAL COCA")) {
        section = "cc";
        return;
      }
      if (line.startsWith("País;") || line.startsWith("Número de Lámina;")) return;

      const parts = line.split(";");
      if (section === "teams" && parts.length >= 4) {
        const [country, code, number, ...nameParts] = parts;
        data.teams[code] ??= {};
        data.teams[code][number] = { country, code, number, name: nameParts.join(";") };
      }
      if (section === "fwc" && parts.length >= 2) {
        const [number, ...nameParts] = parts;
        data.fwc[number] = { number, name: nameParts.join(";") };
      }
      if (section === "cc" && parts.length >= 4) {
        const [country, code, number, ...nameParts] = parts;
        data.cc[number] = { country, code, number, name: nameParts.join(";") };
      }
    });

  return data;
}

async function loadOfficialDataFromRepo() {
  updateOfficialStatus();
  try {
    const response = await fetch("album-data.txt?v=4", { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo leer album-data.txt");

    const text = await response.text();
    const parsed = parseStickerText(text);
    const total = Object.values(parsed.teams).reduce((sum, team) => sum + Object.keys(team).length, 0)
      + Object.keys(parsed.fwc).length
      + Object.keys(parsed.cc).length;

    if (!total) throw new Error("album-data.txt no contiene datos válidos");

    stickerData = parsed;
    saveStickerData();
    render();
  } catch (error) {
    console.warn(error);
    const fallbackTotal = countStickerRows();
    $("#officialDataStatus").textContent = fallbackTotal
      ? `Base oficial cargada desde respaldo local: ${fallbackTotal} láminas.`
      : "No se pudo cargar la base oficial de láminas.";
  }
}

function loadUiScale() {
  const value = Number(localStorage.getItem(UI_SCALE_KEY));
  return Number.isFinite(value) ? Math.min(1.2, Math.max(0.78, value)) : 1;
}

function applyUiScale() {
  document.documentElement.style.setProperty("--page-scale", uiScale.toFixed(2));
  $("#uiScaleText").textContent = `${Math.round(uiScale * 100)}%`;
  localStorage.setItem(UI_SCALE_KEY, String(uiScale));
}

function toggleUiScaleMenu() {
  $("#uiScaleControl").classList.toggle("open");
}

function changeUiScale(delta) {
  uiScale = Math.min(1.2, Math.max(0.78, Math.round((uiScale + delta) * 100) / 100));
  applyUiScale();
}

function resetUiScale() {
  uiScale = 1;
  applyUiScale();
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupStatLinks() {
  document.querySelectorAll("[data-scroll]").forEach((element) => {
    element.addEventListener("click", () => scrollToSection(element.dataset.scroll));
  });
}

function setupModalClose() {
  $("#cardModal").addEventListener("click", (event) => {
    if (event.target.id === "cardModal") closeCardModal();
  });
}

function render() {
  renderTabs();
  renderContent();
  updateStats();
  renderFilters();
  updateOfficialStatus();
  applyUiScale();
}

setupFilterListeners();
setupStatLinks();
setupModalClose();
render();
loadOfficialDataFromRepo();
initFirebase();
