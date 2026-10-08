      <header style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 className="rf-display" style={{ fontSize: 30, fontWeight: 600, margin: 0, color: "var(--clay-dark)" }}>{t.appName}</h1>
            <p style={{ margin: "4px 0 0", color: "var(--ink-soft)", fontSize: 14, maxWidth: 380 }}>{t.tagline}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="rf-btn"
              onClick={() => setShowThemePicker((s) => !s)}
              aria-label={t.appearance}
              style={{ background: "var(--paper-card)", border: "1px solid var(--line)", width: 34, height: 34, borderRadius: "50%", fontSize: 15, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              🎨
            </button>
            <button className="rf-btn" onClick={() => setLang((l) => (l === "id" ? "en" : "id"))} style={{ background: "var(--paper-card)", border: "1px solid var(--line)", padding: "7px 13px", borderRadius: 999, color: "var(--ink)", fontSize: 12, fontWeight: 600 }}>
              {lang === "id" ? "EN" : "ID"}
            </button>
            <button
              className="rf-btn"
              onClick={signOut}
              title={lang === "id" ? "Keluar" : "Sign out"}
              style={{ background: "var(--paper-card)", border: "1px solid var(--line)", width: 34, height: 34, borderRadius: "50%", fontSize: 14, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ⎋
            </button>
            <button onClick={() => openProfile(account.userId)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <Avatar profile={myProfile} size={38} />
            </button>
          </div>
        </div>
        {showThemePicker && (
          <ThemePicker
            themes={THEMES}
            scenes={SCENES}
            fonts={FONT_OPTIONS}
            themeKey={themeKey}
            sceneKey={sceneKey}
            fontKey={fontKey}
            onSelectTheme={chooseTheme}
            onSelectScene={chooseScene}
            onSelectFont={chooseFont}
            labelTheme={t.appearance}
            labelScene={t.sceneLabel}
            labelFont={t.fontLabel}
            lang={lang}
            sceneLabels={{ none: t.sceneNone, gunung: t.sceneMountain, laut: t.sceneSea, hutan: t.sceneForest, malam: t.sceneNight, padang: t.sceneMeadow }}
            fontLabels={{ organik: t.fontOrganic, elegan: t.fontElegant, tangan: t.fontHandwritten, modern: t.fontModern }}
          />
        )}
        <nav style={{ display: "flex", gap: 20, marginTop: 22, borderBottom: "1px solid var(--line)" }}>
          {Object.entries(t.nav).map(([key, label]) => (
            <button key={key} className={`rf-tab ${tab === key ? "active" : ""}`} onClick={() => { setTab(key); if (key !== "profile") setViewingUserId(null); }}>{label}</button>
          ))}
        </nav>
      </header>
