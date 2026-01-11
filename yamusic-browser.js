class YandexMusicBrowser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
    this.currentSection = 'main'; // main | search | library | my-wave etc.
  }

  setConfig(config) {
    this._config = {
      title: config.title || 'Яндекс Музыка',
      ...config
    };
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    if (!oldHass || oldHass.theme !== hass.theme) {
      this.applyTheme();
    }

    this.render();
  }

  applyTheme() {
    const theme = this._hass?.selectedTheme || this._hass?.theme || {};
    const isDark = theme.dark ?? true;

    this.shadowRoot.host.style.setProperty('--bg-main', isDark ? '#0f0f0f' : '#f5f5f5');
    this.shadowRoot.host.style.setProperty('--bg-sidebar', isDark ? '#121212' : '#ffffff');
    this.shadowRoot.host.style.setProperty('--text-primary', isDark ? '#ffffff' : '#000000');
    this.shadowRoot.host.style.setProperty('--text-secondary', isDark ? '#b3b3b3' : '#666666');
    this.shadowRoot.host.style.setProperty('--accent', '#ff6a00'); // фирменный оранжевый Яндекса
    this.shadowRoot.host.style.setProperty('--player-bg', isDark ? '#1a1a1a' : '#ffffff');
  }

  render() {
    if (!this._hass) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: var(--bg-main);
          color: var(--text-primary);
          overflow: hidden;
        }

        .layout {
          display: flex;
          height: 100%;
        }

        /* Sidebar (левая панель) */
        .sidebar {
          width: 240px;
          background: var(--bg-sidebar);
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          padding: 16px 0;
        }

        .logo {
          padding: 0 24px 24px;
          font-size: 1.8em;
          font-weight: bold;
          color: var(--accent);
        }

        .nav-item {
          padding: 12px 24px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .nav-item:hover, .nav-item.active {
          background: rgba(255,106,0,0.12);
        }

        .pinned {
          margin-top: 32px;
          padding: 0 24px;
          font-size: 0.9em;
          color: var(--text-secondary);
        }

        /* Main content */
        .main {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .search {
          flex: 1;
          max-width: 500px;
        }

        input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 24px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: var(--text-primary);
          font-size: 1em;
        }

        .section-title {
          font-size: 1.8em;
          margin: 0 0 16px;
          font-weight: 600;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 24px;
        }

        .card {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.2s;
          cursor: pointer;
        }

        .card:hover {
          transform: scale(1.04);
        }

        .card-img {
          width: 100%;
          aspect-ratio: 1;
          background: #222;
        }

        .card-title {
          padding: 12px;
          font-size: 1em;
          font-weight: 500;
        }

        /* Player bar (нижний плеер) */
        .player {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 90px;
          background: var(--player-bg);
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 24px;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.4);
        }

        .player-track {
          flex: 1;
        }

        .controls button {
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.8em;
          cursor: pointer;
          margin: 0 8px;
        }
      </style>

      <div class="layout">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="logo">Я.Музыка</div>
          
          <div class="nav-item ${this.currentSection === 'main' ? 'active' : ''}">Главная</div>
          <div class="nav-item">Моя волна</div>
          <div class="nav-item">Поиск</div>
          <div class="nav-item">Коллекция</div>
          
          <div class="pinned">
            Закреплённые
            <div class="nav-item" style="padding: 8px 0;">Мой плейлист дня</div>
            <div class="nav-item" style="padding: 8px 0;">Любимые треки</div>
          </div>
        </div>

        <!-- Main content -->
        <div class="main">
          <header>
            <div class="search">
              <input type="text" placeholder="Треки, исполнители, подкасты...">
            </div>
            <div>👤 ${this._hass?.user?.name || 'Гость'}</div>
          </header>

          <h2 class="section-title">Для вас</h2>
          <div class="grid">
            <div class="card"><div class="card-img"></div><div class="card-title">Мой плейлист дня</div></div>
            <div class="card"><div class="card-img"></div><div class="card-title">Микс настроения</div></div>
            <div class="card"><div class="card-img"></div><div class="card-title">Похоже на...</div></div>
            <div class="card"><div class="card-img"></div><div class="card-title">Новинки</div></div>
          </div>

          <h2 class="section-title" style="margin-top: 48px;">Тренды</h2>
          <div class="grid">
            <div class="card"><div class="card-img"></div><div class="card-title">Чарт Яндекс Музыки</div></div>
            <div class="card"><div class="card-img"></div><div class="card-title">Новое и горячее</div></div>
            <div class="card"><div class="card-img"></div><div class="card-title">Хиты в машине</div></div>
          </div>
        </div>
      </div>

      <!-- Нижний плеер -->
      <div class="player">
        <div style="width:60px; height:60px; background:#333; border-radius:8px;"></div>
        <div class="player-track">
          <div>Трек не играет</div>
          <div style="color: var(--text-secondary);">Исполнитель — Альбом</div>
        </div>
        <div class="controls">
          <button>⏮</button>
          <button>▶️</button>
          <button>⏭</button>
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 10; // Большая панель
  }
}

customElements.define('yandex-music-browser', YandexMusicBrowser);

console.info(
  "%c YANDEX-MUSIC-BROWSER %c v0.2.0 — Новый дизайн 2025 ",
  "background: #ff6a00; color: white; padding: 4px 8px;",
  "background: #222; color: #ff6a00; padding: 4px 8px;"
);