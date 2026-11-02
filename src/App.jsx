import React, { useState, useMemo, useEffect, useId } from "react";
import { SPELLS, CLASS_SPELLS, DUNAMANCY_CLASS_SPELLS, CLASS_META, SCHOOL_COLORS, T, BOOKS, ALL_SPELLS_BY_LEVEL } from "./data";
import { maxSlotLevel, arcanumLevels, availableLevels, normalizeLevel, reconcileSelection, validLevelFilter, toggleSelection } from "./rules.js";

import RuleText from './RuleText.jsx';
import { loadRulebook } from './rulebooks.js';
import { STORAGE_KEY, createBook, emptyLibrary, decodeLibrary, retainPrepared } from './characterBooks.js';

// ── style constants ───────────────────────────────────────────────────────────

const G = {
  bg:     "#0f172a",
  panel:  "rgba(15,23,42,0.97)",
  card:   "rgba(30,41,59,0.7)",
  cardHov:"rgba(30,41,59,0.95)",
  border: "rgba(240,180,41,0.18)",
  gold:   "#f0b429",
  goldL:  "#fcd34d",
  text:   "#f1f5f9",
  muted:  "#94a3b8",
  dim:    "#64748b",
  green:  "#4ade80",
  red:    "#f87171",
};

const inp = {
  background: "rgba(15,23,42,0.8)",
  border: "1px solid " + G.border,
  borderRadius: "0.6rem",
  color: G.text,
  padding: "0.45rem 0.75rem",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
};

// ── components ────────────────────────────────────────────────────────────────

function LevelBadge({ level, t }) {
  return (
    <span style={{
      background: "rgba(240,180,41,0.15)",
      border: "1px solid rgba(240,180,41,0.35)",
      borderRadius: "0.4rem",
      color: G.gold,
      fontSize: "0.65rem",
      fontWeight: 700,
      padding: "0.1rem 0.45rem",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {level === 0 ? t.cantrips : `${t.level} ${level}`}
    </span>
  );
}

function SchoolBadge({ school }) {
  const color = SCHOOL_COLORS[school] || G.muted;
  return (
    <span style={{
      background: color + "22",
      border: "1px solid " + color + "55",
      borderRadius: "0.4rem",
      color,
      fontSize: "0.6rem",
      fontWeight: 700,
      padding: "0.1rem 0.45rem",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      {school}
    </span>
  );
}

function SpellCard({ name, spell, checked, onToggle, prepared, onPrepare, lang, t, ruleText, rulesError, catalogueMode }) {
  const [hov, setHov] = useState(false);
  const selectionId = useId();

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
        background: checked
          ? "rgba(74,222,128,0.07)"
          : hov ? G.cardHov : G.card,
        border: `1px solid ${checked ? "rgba(74,222,128,0.35)" : G.border}`,
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        cursor: "default",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <input id={selectionId} type="checkbox" checked={checked} disabled={catalogueMode} aria-label={`${t.selectSpell}: ${name}`}
        onChange={onToggle} onClick={e => e.stopPropagation()}
        style={{ flexShrink: 0, width: 18, height: 18, marginTop: 2, accentColor: G.green }} />
      {/* content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
          <label htmlFor={selectionId} style={{ color: G.text, fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>{name}</label>
          <SchoolBadge school={spell.school} />
          <span style={{ color: G.muted, fontSize: "0.7rem" }}>{spell.book} · {t.rulesVersion} {spell.rulesVersion}</span>
          <a href={spell.source.url} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ color: G.goldL, fontSize: "0.7rem" }}>
            {spell.source.label}{spell.source.page && !/\b(?:p|s)\.\s*\d/.test(spell.source.label) ? ` · ${lang === "da" ? "s." : "p."} ${spell.source.page}` : ""}
          </a>

        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.35rem" }}>
          {[
            [t.castTime, spell.cast],
            [t.range,    spell.range],
            [t.duration, spell.dur],
            [t.components, spell.components],
            [t.classes, spell.classes.join(", ")],
          ].map(([label, val]) => (
            <span key={label} style={{ fontSize: "0.7rem", color: G.muted }}>
              <span style={{ color: G.dim, marginRight: 3 }}>{label}:</span>{val}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", margin: "0.6rem 0", fontSize: "0.85rem" }}>
          <label htmlFor={selectionId} style={{ cursor: "pointer", color: checked ? G.green : G.muted }}>{checked ? t.inBook : t.addToBook}</label>
          {spell.level > 0 ? <label style={{ color: prepared ? G.gold : G.muted }}>
            <input type="checkbox" checked={prepared} disabled={!checked || catalogueMode} onChange={onPrepare} aria-label={`${t.prepareSpell}: ${name}`} style={{ accentColor: G.gold, marginRight: 6 }} />
            {t.preparedSpells}
          </label> : checked && <span style={{ color: G.muted }}>{t.cantripReady}</span>}
        </div>
        {spell.accessNote && <p role="note" style={{ color: G.goldL, fontSize: "0.78rem", lineHeight: 1.5 }}>{spell.accessNote[lang]}</p>}
        {spell.rulesVersion !== "2024" && <p role="note" style={{ color: G.goldL, fontSize: "0.78rem", lineHeight: 1.5, borderLeft: "2px solid " + G.gold, paddingLeft: "0.6rem" }}>{t.legacyRulesNote}</p>}
        <section lang={lang} aria-label={t.fullRules}>
          {ruleText ? <RuleText text={ruleText} /> : <p role="status">{rulesError ? t.sourceFallback : t.loading}</p>}
        </section>
        {spell.errataUrl && <a href={spell.errataUrl} target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()} style={{ fontSize: "0.7rem", color: G.goldL }}>{t.errata}</a>}
      </div>
    </div>
  );
}

function SpellLevelSection({ level, spells, selected, onToggle, prepared, onPrepare, lang, t, isArcanum, rulebook, rulesError, catalogueMode }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!spells.length) return null;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <button
        onClick={() => setCollapsed(c => !c)}
        aria-expanded={!collapsed}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
          padding: "0.2rem 0",
          width: "100%",
          textAlign: "left",
        }}
      >
        <LevelBadge level={level} t={t} />
        {isArcanum && <span style={{ color: G.gold, fontSize: "0.75rem" }}>Mystic Arcanum · {t.chooseOne}</span>}
        <span style={{ color: G.dim, fontSize: "0.72rem" }}>
          {spells.length} {lang === "da" ? "trylleformler" : "spells"}
        </span>
        <span style={{ color: G.dim, fontSize: "0.75rem", marginLeft: "auto" }}>
          {collapsed ? "▶" : "▼"}
        </span>
      </button>
      {!collapsed && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {spells.map(name => (
            <SpellCard
              key={name}
              name={name}
              spell={SPELLS[name]}
              ruleText={rulebook?.[name]}
              rulesError={rulesError}
              catalogueMode={catalogueMode}
              prepared={!!prepared[name]}
              onPrepare={() => onPrepare(name)}
              checked={!!selected[name]}
              onToggle={() => onToggle(name)}
              lang={lang}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── main app ──────────────────────────────────────────────────────────────────

export default function App() {
  const [lang, setLang]         = useState("en");
  const [initialBooks] = useState(() => {
    try { return { library: decodeLibrary(localStorage.getItem(STORAGE_KEY)), blocked: false }; }
    catch { return { library: emptyLibrary(), blocked: true }; }
  });
  const [library, setLibrary] = useState(initialBooks.library);
  const [saveError, setSaveError] = useState(initialBooks.blocked);
  const [catalogueView, setCatalogueView] = useState(false);
  const [onlySelected, setOnlySelected] = useState(false);
  const [deletedBook, setDeletedBook] = useState(null);
  const activeBook = library.books.find(book => book.id === library.activeId) || library.books[0];
  const className = catalogueView ? "all" : activeBook.className;
  const charLevel = activeBook.level;
  const selected = activeBook.selected;
  const prepared = activeBook.prepared;
  const allowDunamancy = activeBook.allowDunamancy;
  const [onlyPrepared, setOnlyPrepared] = useState(false);
  function updateBook(change) {
    setLibrary(current => ({ ...current, books: current.books.map(book => book.id === current.activeId
      ? { ...book, ...(typeof change === 'function' ? change(book) : change) } : book) }));
  }
  function setSelected(change) {
    updateBook(book => {
      const next = typeof change === 'function' ? change(book.selected) : change;
      return { selected: next, prepared: retainPrepared(book.prepared, next) };
    });
  }
  useEffect(() => {
    if (initialBooks.blocked) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(library)); setSaveError(false); }
    catch { setSaveError(true); }
  }, [library, initialBooks.blocked]);
  const [levelFilter, setLF]    = useState("all");
  const [bookFilter, setBookFilter] = useState("all");
  const [search, setSearch]     = useState("");

  const [loadedRules, setLoadedRules] = useState(null);
  const [rulesError, setRulesError] = useState(false);
  const rulebook = loadedRules?.language === lang ? loadedRules.spells : null;
  useEffect(() => {
    let active = true;
    setRulesError(false);
    loadRulebook(lang).then(spells => {
      if (active) setLoadedRules({ language: lang, spells });
    }).catch(() => { if (active) setRulesError(true); });
    return () => { active = false; };
  }, [lang]);

  const t = T[lang];
  const [notice, setNotice] = useState("");
  const catalogueMode = className === "all";
  const maxSL = maxSlotLevel(className, charLevel);
  const arcana = arcanumLevels(className, charLevel);
  const availLevels = catalogueMode ? Object.keys(ALL_SPELLS_BY_LEVEL).map(Number).sort((a,b)=>a-b) : availableLevels(className, charLevel, allowDunamancy);
  const classSpells = catalogueMode ? ALL_SPELLS_BY_LEVEL : (allowDunamancy ? DUNAMANCY_CLASS_SPELLS : CLASS_SPELLS)[className] || {};

  // Build filtered spell groups
  const spellGroups = useMemo(() => {
    const groups = {};
    const sl = search.trim().toLowerCase();
    const levels = levelFilter === "all"
      ? [...availLevels]
      : [Number(levelFilter)].filter(l => availLevels.includes(l));

    levels.sort((a, b) => a - b);

    for (const level of levels) {
      const names = (classSpells[level] || []).filter(name => {
        if (!SPELLS[name]) return false;
        if (onlySelected && !selected[name]) return false;
        if (onlyPrepared && !prepared[name]) return false;
        if (bookFilter !== "all" && SPELLS[name].book !== bookFilter) return false;
        if (!sl) return true;
        return (
          name.toLowerCase().includes(sl) ||
          (rulebook?.[name] || "").toLowerCase().includes(sl) ||
          (SPELLS[name].school || "").toLowerCase().includes(sl)
        );
      });
      if (names.length) groups[level] = names;
    }
    return groups;
  }, [className, charLevel, search, levelFilter, bookFilter, rulebook, onlySelected, selected, onlyPrepared, prepared, allowDunamancy]);

  function toggleSpell(name) {
    if (catalogueMode) return;
    setSelected(s => toggleSelection(s, name, className, charLevel, allowDunamancy));
    setNotice("");
  }

  function changeLevel(value) {
    const level = normalizeLevel(value);
    const next = reconcileSelection(selected, className, level, allowDunamancy);
    const removed = Object.keys(selected).filter(name => !next[name]);
    updateBook({ selected: next, prepared: retainPrepared(prepared, next), level });
    setLF(filter => validLevelFilter(filter, className, level, allowDunamancy));
    setNotice(removed.length ? `${t.removedSelections}: ${removed.join(", ")}` : "");
  }

  function resetFilters() { setLF("all"); setBookFilter("all"); setSearch(""); setCatalogueView(false); setNotice(""); }
  function switchBook(id) { setLibrary(current => ({ ...current, activeId: id })); resetFilters(); }
  function newBook() {
    const book = createBook();
    setLibrary(current => ({ ...current, activeId: book.id, books: [...current.books, book] }));
    setOnlySelected(false); setOnlyPrepared(false); resetFilters();
  }
  function removeBook() {
    setDeletedBook(activeBook);
    setLibrary(current => {
      const books = current.books.filter(book => book.id !== current.activeId);
      if (!books.length) return emptyLibrary();
      return { ...current, activeId: books[0].id, books };
    });
    resetFilters();
  }
  function undoRemove() {
    setLibrary(current => ({ ...current, activeId: deletedBook.id, books: [...current.books, deletedBook] }));
    setDeletedBook(null); resetFilters();
  }
  const selectedNames = Object.keys(selected);

  return (
    <div style={{
      minHeight: "100vh",
      background: G.bg,
      color: G.text,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* ── header ── */}
      <div style={{
        background: "rgba(15,23,42,0.98)",
        borderBottom: "1px solid " + G.border,
        padding: "1rem 1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.15rem" }}>
              <span style={{ fontSize: "1.4rem" }}>📖</span>
              <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 900, color: G.gold }}>{t.title}</h1>
            </div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: G.muted }}>
              {t.subtitle}{" "}
              <a href="https://asaheim.dk" target="_blank" rel="noopener noreferrer"
                style={{ color: G.gold, textDecoration: "underline" }}>
                asaheim.dk
              </a>
            </p>
          </div>
          {/* language toggle */}
          <button
            onClick={() => setLang(l => l === "en" ? "da" : "en")}
            style={{
              background: "rgba(240,180,41,0.1)",
              border: "1px solid " + G.border,
              borderRadius: "0.6rem",
              color: G.gold,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.8rem",
              padding: "0.4rem 0.9rem",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            🌐 {t.lang}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <section aria-label={t.characterBooks} style={{ background: G.card, border: "1px solid " + G.border, borderRadius: "1rem", padding: "1rem", marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", color: G.gold, fontSize: "1rem" }}>{t.characterBooks}</h2>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "end" }}>
            <label style={{ flex: "1 1 180px" }}>{t.chooseCharacter}
              <select id="character-book" value={activeBook.id} onChange={e => switchBook(e.target.value)} style={inp}>
                {library.books.map((book, index) => <option key={book.id} value={book.id}>{book.name || `${t.unnamedCharacter} ${index + 1}`} · {book.className} {book.level}</option>)}
              </select>
            </label>
            <label style={{ flex: "1 1 180px" }}>{t.characterName}
              <input id="character-name" value={activeBook.name} maxLength={80} placeholder={t.characterNamePlaceholder} onChange={e => updateBook({ name: e.target.value })} style={inp} />
            </label>
            <button type="button" onClick={newBook} style={{ ...inp, width: "auto", cursor: "pointer" }}>{t.newCharacter}</button>
            <button type="button" onClick={removeBook} style={{ ...inp, width: "auto", color: G.red, cursor: "pointer" }}>{t.deleteCharacter}</button>
          </div>
          <label style={{ display: "block", marginTop: "0.8rem", fontSize: "0.85rem" }}>
            <input type="checkbox" checked={allowDunamancy} onChange={e => {
              const allowed = e.target.checked;
              updateBook(book => {
                const next = reconcileSelection(book.selected, book.className, book.level, allowed);
                return { allowDunamancy: allowed, selected: next, prepared: retainPrepared(book.prepared, next) };
              });
              setLF("all");
            }} aria-describedby="dunamancy-help" /> {t.dunamancyAccess}
          </label>
          <p id="dunamancy-help" style={{ fontSize: "0.75rem", color: G.muted }}>{t.dunamancyHelp}</p>
          <p role="status" style={{ fontSize: "0.75rem", color: saveError ? G.red : G.muted }}>{saveError ? t.bookSaveError : t.bookSavedLocally}</p>
          {deletedBook && <p style={{ fontSize: "0.8rem" }}>{t.bookDeleted} <button type="button" onClick={undoRemove} style={{ ...inp, width: "auto", cursor: "pointer" }}>{t.undoDelete}</button></p>}
          <p style={{ fontSize: "0.78rem", color: G.muted }}>{t.preparationNote}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button type="button" aria-pressed={!onlySelected && !onlyPrepared} onClick={() => { setOnlySelected(false); setOnlyPrepared(false); }} style={{ ...inp, width: "auto", color: !onlySelected ? G.gold : G.text, cursor: "pointer" }}>{t.browseSpells}</button>
            <button type="button" aria-pressed={onlySelected} onClick={() => { setOnlySelected(true); setOnlyPrepared(false); resetFilters(); }} style={{ ...inp, width: "auto", color: onlySelected ? G.gold : G.text, cursor: "pointer" }}>{t.mySpellbook} ({selectedNames.length})</button>
            <button type="button" aria-pressed={onlyPrepared} onClick={() => { setOnlyPrepared(true); setOnlySelected(false); resetFilters(); }} style={{ ...inp, width: "auto", color: onlyPrepared ? G.gold : G.text, cursor: "pointer" }}>{t.preparedSpells} ({Object.keys(prepared).length})</button>
          </div>
        </section>
        {/* ── controls ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}>
          {/* class */}
          <div>
            <label htmlFor="class" style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {t.selectClass}
            </label>
            <select value={className} id="class" onChange={e => { const value = e.target.value; setCatalogueView(value === "all"); if (value !== "all" && value !== activeBook.className) updateBook({ className: value, selected: {}, prepared: {} }); setLF("all"); setNotice(""); }} style={inp}>
              <option value="all">{t.allClasses}</option>
              {Object.keys(CLASS_SPELLS).map(c => (
                <option key={c} value={c}>
                  {lang === "da" ? `${c} (${CLASS_META[c]?.da})` : c}
                </option>
              ))}
            </select>
          </div>
          {/* level */}
          <div>
            <label htmlFor="character-level" style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {t.charLevel}: <span style={{ color: G.gold }}>{charLevel}</span>
            </label>
            <input
              id="character-level" disabled={catalogueMode} type="range" min={1} max={20} value={charLevel}
              onChange={e => changeLevel(e.target.value)}
              style={{ width:"100%", accentColor: G.gold }}
            />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", color:G.dim }}>
              <span>1</span>
              <span style={{ color: G.muted }}>
                {catalogueMode ? "—" : lang === "da" ? `Maks. slotniveau: ${maxSL}` : `Max slot level: ${maxSL}`}
              </span>
              <span>20</span>
            </div>
          </div>
          {/* spell level filter */}
          <div>
            <label htmlFor="spell-level" style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {t.level}
            </label>
            <select id="spell-level" value={levelFilter} onChange={e => setLF(e.target.value)} style={inp}>
              <option value="all">{t.allLevels}</option>
              {availLevels.map(l => (
                <option key={l} value={l}>
                  {l === 0 ? t.cantrips : `${t.level} ${l}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="book-filter" style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>{t.book}</label>
            <select id="book-filter" value={bookFilter} onChange={e => setBookFilter(e.target.value)} style={inp}>
              <option value="all">{t.allBooks}</option>
              {BOOKS.map(book => <option key={book} value={book}>{book}</option>)}
            </select>
          </div>
          {/* search */}
          <div>
            <label htmlFor="spell-search" style={{ display:"block", fontSize:"0.7rem", color:G.dim, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"0.3rem", fontWeight:700 }}>
              {lang === "da" ? "Søg" : "Search"}
            </label>
            <input
              id="spell-search" type="text" value={search} placeholder={t.searchPlaceholder}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inp }}
            />
          </div>
        </div>

        <p style={{ color: G.muted, fontSize: "0.78rem", lineHeight: 1.5 }}>{t.scopeNote}</p>
        {catalogueMode && <p style={{ color: G.goldL, fontSize: "0.78rem" }}>{t.catalogueNote}</p>}
        {className === "Warlock" && <p style={{ color: G.goldL, fontSize: "0.78rem" }}>
          {t.arcanumNote}{arcana.length > 0 ? ` (${arcana.join(", ")})` : ""}
        </p>}
        <p role="status" style={{ color: G.goldL, fontSize: "0.8rem" }}>{notice}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* ── spell list ── */}
          <div>
            {Object.keys(spellGroups).length === 0 ? (
              <div style={{ color: G.muted, fontStyle:"italic", textAlign:"center", padding:"2rem" }}>
                {onlyPrepared && !Object.keys(prepared).length ? t.emptyPrepared : onlySelected && !selectedNames.length ? t.emptySpellbook : t.noSpells}
              </div>
            ) : (
              Object.entries(spellGroups).map(([level, names]) => (
                <SpellLevelSection
                  key={level}
                  level={Number(level)}
                  isArcanum={className === "Warlock" && Number(level) >= 6}
                  rulebook={rulebook}
                  rulesError={rulesError}
                  catalogueMode={catalogueMode}
                  spells={names}
                  prepared={prepared}
                  onPrepare={name => updateBook(book => {
                    if (!book.selected[name] || SPELLS[name].level === 0) return {};
                    const next = { ...book.prepared };
                    if (next[name]) delete next[name]; else next[name] = true;
                    return { prepared: next };
                  })}
                  selected={selected}
                  onToggle={toggleSpell}
                  lang={lang}
                  t={t}
                />
              ))
            )}
          </div>

          {/* ── selected spells panel ── */}
          {selectedNames.length > 0 && (
            <div style={{
              background: G.card,
              border: "1px solid " + G.border,
              borderRadius: "1rem",
              padding: "1rem 1.25rem",
            }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
                <span style={{ fontWeight:800, fontSize:"0.85rem", color:G.gold, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                  {activeBook.name ? `${activeBook.name} · ` : ""}{t.selected} ({selectedNames.length})
                </span>
                <button
                  onClick={() => setSelected({})}
                  style={{ background:"transparent", border:"none", color:G.red, cursor:"pointer", fontSize:"0.75rem", fontWeight:700 }}
                >
                  {t.clearAll}
                </button>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                {selectedNames.map(name => {
                  const sp = SPELLS[name];
                  const color = sp ? SCHOOL_COLORS[sp.school] || G.muted : G.muted;
                  return (
                    <button type="button"
                      key={name}
                      onClick={() => toggleSpell(name)}
                      title={sp ? (sp[lang] || sp.en) : ""}
                      style={{
                        background: color + "22",
                        border: "1px solid " + color + "55",
                        borderRadius: "0.5rem",
                        color,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.6rem",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      {name} ×
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── footer ── */}
      <div style={{
        borderTop: "1px solid " + G.border,
        padding: "1rem 1.5rem",
        textAlign: "center",
        fontSize: "0.72rem",
        color: G.dim,
        marginTop: "2rem",
      }}>
        SpellbookRPG Expanded · D&D 5e · {t.rulesDate} ·{" "}
        <a href="https://asaheim.dk" target="_blank" rel="noopener noreferrer" style={{ color: G.gold }}>
          asaheim.dk
        </a>
        <p style={{ maxWidth: 900, margin: "0.75rem auto 0" }}>
          This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”)
          by Wizards of the Coast LLC, available at <a href="https://www.dndbeyond.com/srd" style={{ color: G.muted }}>https://www.dndbeyond.com/srd</a>.
          The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License,
          available at <a href="https://creativecommons.org/licenses/by/4.0/legalcode" style={{ color: G.muted }}>https://creativecommons.org/licenses/by/4.0/legalcode</a>.
        </p>
      </div>
    </div>
  );
}
