class YandexMusicBrowser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
  }

  setConfig(config) {
    this._config = {
      title: config.title || 'Яндекс Музыка',
      ...config
    };
  }

  set hass(hass) {
    this._hass = hass;
    this.applyTheme();
    this.render();
  }

  applyTheme() {
    const isDark = this._hass?.theme?.dark ?? true;
    this.shadowRoot.host.style.setProperty('--bg', isDark ? '#000' : '#f0f0f0');
    this.shadowRoot.host.style.setProperty('--sidebar-bg', isDark ? '#0a0a0a' : '#fff');
    this.shadowRoot.host.style.setProperty('--text', isDark ? '#fff' : '#000');
    this.shadowRoot.host.style.setProperty('--text-secondary', isDark ? '#aaa' : '#555');
    this.shadowRoot.host.style.setProperty('--accent', '#ff6a00');
  }

  render() {
    if (!this._hass) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          background: var(--bg);
          color: var(--text);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
        }

        .layout {
          display: flex;
          height: 100%;
        }

        /* Sidebar */
        .sidebar {
          width: 220px;
          background: var(--sidebar-bg);
          padding: 20px 0;
          border-right: 1px solid rgba(255,255,255,0.08);
          overflow-y: auto;
        }

        .logo {
          padding: 0 20px 30px;
          font-size: 1.9em;
          font-weight: bold;
          background: linear-gradient(135deg, #00ff9d, #00b8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .nav-item:hover {
          background: rgba(255,106,0,0.1);
        }

        .nav-icon {
          margin-right: 16px;
          font-size: 1.4em;
          opacity: 0.8;
        }

        /* Main */
        .main {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
          position: relative;
        }

        /* Blob background effect */
        .blob-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: 
            radial-gradient(circle at 20% 30%, rgba(0,255,157,0.12) 0%, transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(255,106,0,0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0,184,255,0.1) 0%, transparent 45%);
            opacity: 0.7;
        }

        header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }

        .user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #444;
        }

        .wave-hero {
          text-align: center;
          margin: 60px 0 80px;
        }

        .wave-title {
          font-size: 3.8em;
          font-weight: bold;
          margin: 0 0 20px;
          background: linear-gradient(90deg, #ff6a00, #ffd700, #00ff9d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .play-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 40px;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.3em;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(255,106,0,0.4);
          transition: transform 0.2s;
        }

        .play-btn:hover {
          transform: scale(1.05);
        }

        .section {
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 2em;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cards {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 20px;
        }

        .card {
          min-width: 220px;
          background: rgba(255,255,255,0.05);
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.25s;
        }

        .card:hover {
          transform: translateY(-8px);
        }

        .card-img {
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(135deg, #333, #111);
        }

        .card-label {
          padding: 16px;
          font-weight: 500;
        }

        /* Player bar */
        .player {
          position: fixed;
          bottom: 0;
          left: 220px;
          right: 0;
          height: 90px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          padding: 0 30px;
          gap: 24px;
        }

        .player-cover {
          width: 60px;
          height: 60px;
          background: #222;
          border-radius: 8px;
        }
      </style>

      <div class="layout">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="logo">Яндекс Музыка</div>
          
          <div class="nav-item"><span class="nav-icon">🔍</span>Поиск</div>
          <div class="nav-item"><span class="nav-icon">🎵</span>Главная</div>
          <div class="nav-item"><span class="nav-icon">🎤</span>Концерты</div>
          <div class="nav-item"><span class="nav-icon">📚</span>Книги и подкасты</div>
          <div class="nav-item"><span class="nav-icon">👶</span>Детям</div>
          <div class="nav-item"><span class="nav-icon">❤️</span>Коллекция</div>
          <div class="nav-item"><span class="nav-icon">✨</span>Ваш Плюс</div>
        </div>

        <!-- Main content with blob effect -->
        <div class="main">
          <div class="blob-bg"></div>

          <header>
            <div class="user">
              <div class="avatar"></div>
              <span>${this._hass?.user?.name || 'Гость'}</span>
            </div>
          </header>

          <div class="wave-hero">
            <h1 class="wave-title">Моя волна</h1>
            <button class="play-btn">
              <span>▶</span> Слушать
            </button>
            <div style="margin-top:12px; color:var(--text-secondary);">Самые точные рекомендации</div>
          </div>

          <div class="section">
            <h2 class="section-title">Итоги года · Для вас · Тренды</h2>
            <div class="cards">
              <div class="card"><div class="card-img"></div><div class="card-label">Итоги 2025-го</div></div>
              <div class="card"><div class="card-img"></div><div class="card-label">Для вас</div></div>
              <div class="card"><div class="card-img"></div><div class="card-label">Тренды</div></div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Мне нравится · История</h2>
            <div class="cards">
              <div class="card"><div class="card-img"></div><div class="card-label">Мне нравится (85)</div></div>
              <div class="card"><div class="card-img"></div><div class="card-label">История прослушиваний</div></div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Свели в AI-сет</h2>
            <div style="display:flex; gap:12px; margin-bottom:20px;">
              <button style="padding:8px 16px; border-radius:30px; background:rgba(255,255,255,0.1);">Топ</button>
              <button style="padding:8px 16px; border-radius:30px; background:rgba(255,255,255,0.1);">По жанру</button>
              <button style="padding:8px 16px; border-radius:30px; background:rgba(255,255,255,0.1);">Под настроение</button>
            </div>
            <div class="cards">
              <div class="card" style="background:linear-gradient(135deg,#00b8ff,#0066ff);"><div class="card-label">Под настроение</div></div>
              <div class="card" style="background:linear-gradient(135deg,#ff6a00,#ffaa00);"><div class="card-label">По жанру</div></div>
              <div class="card" style="background:linear-gradient(135deg,#00ff9d,#00cc77);"><div class="card-label">Новый год</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Player bar -->
      <div class="player">
        <div class="player-cover"></div>
        <div style="flex:1;">
          <div>Трек не выбран</div>
          <div style="color:var(--text-secondary);">Артист — Альбом</div>
        </div>
        <div style="display:flex; gap:20px; font-size:1.6em;">
          <button style="background:none;border:none;color:inherit;">❤️</button>
          <button style="background:none;border:none;color:inherit;">⏮</button>
          <button style="background:none;border:none;color:inherit;font-size:2em;">▶</button>
          <button style="background:none;border:none;color:inherit;">⏭</button>
          <button style="background:none;border:none;color:inherit;">🔀</button>
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 12;
  }
}

customElements.define('yandex-music-browser', YandexMusicBrowser);

console.info(
  "%c YANDEX-MUSIC-BROWSER %c v0.3.0 — 2026 дизайн с blobs ",
  "background:#ff6a00;color:white;padding:5px 10px;border-radius:4px;",
  "background:#111;color:#ff6a00;padding:5px 10px;border-radius:4px;"
);