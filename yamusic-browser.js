class YandexMusicBrowser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._config = {};
    this.activeTab = 'search'; // search | playlists | playing
  }

  setConfig(config) {
    this._config = {
      title: config.title || 'Yandex Music Browser',
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
    const theme = this._hass?.selectedTheme || this._hass?.theme;
    this.shadowRoot.host.style.setProperty('--ha-card-background', theme?.['card-background-color'] || '#1e1e1e');
    this.shadowRoot.host.style.setProperty('--primary-text-color', theme?.['primary-text-color'] || '#e0e0e0');
    this.shadowRoot.host.style.setProperty('--secondary-text-color', theme?.['secondary-text-color'] || '#b0b0b0');
    this.shadowRoot.host.style.setProperty('--accent-color', theme?.['accent-color'] || '#ff6a00');
  }

  render() {
    if (!this._hass) return;

    const isDark = this._hass.theme?.dark || false;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          height: 100%;
          --ha-card-background: #1e1e1e;
          --primary-text-color: #e0e0e0;
          --secondary-text-color: #b0b0b0;
          --accent-color: #ff6a00;
        }

        .container {
          height: 100%;
          display: flex;
          flex-direction: column;
          font-family: var(--paper-font-body1_-_font-family, -apple-system, BlinkMacC, "Segoe UI", Roboto, sans-serif);
          background: var(--ha-card-background);
          color: var(--primary-text-color);
          overflow: hidden;
        }

        header {
          padding: 16px 20px;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        h1 {
          margin: 0;
          font-size: 1.6em;
          font-weight: 500;
        }

        .tabs {
          display: flex;
          background: rgba(0,0,0,0.2);
        }

        .tab {
          flex: 1;
          padding: 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 3px solid transparent;
        }

        .tab.active {
          background: rgba(255,106,0,0.15);
          border-bottom-color: var(--accent-color);
          color: var(--accent-color);
          font-weight: 600;
        }

        .content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .search-bar {
          display: flex;
          margin-bottom: 20px;
        }

        input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 8px 0 0 8px;
          background: rgba(255,255,255,0.08);
          color: white;
          font-size: 1em;
        }

        button {
          padding: 0 20px;
          border: none;
          background: var(--accent-color);
          color: white;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          transition: background 0.2s;
        }

        button:hover {
          background: #ff8533;
        }

        .track {
          display: flex;
          align-items: center;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 8px;
          background: rgba(255,255,255,0.05);
          transition: transform 0.15s;
        }

        .track:hover {
          transform: translateY(-2px);
          background: rgba(255,106,0,0.12);
        }

        .track-art {
          width: 50px;
          height: 50px;
          background: #333;
          border-radius: 6px;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .track-info {
          flex: 1;
        }

        .track-title {
          font-weight: 500;
          margin: 0 0 4px;
        }

        .track-artist {
          color: var(--secondary-text-color);
          font-size: 0.9em;
        }

        .player-bar {
          padding: 16px;
          background: rgba(0,0,0,0.4);
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 16px;
        }
      </style>

      <div class="container">
        <header>
          <h1>${this._config.title}</h1>
          <div>🎧 Yandex Music</div>
        </header>

        <div class="tabs">
          <div class="tab ${this.activeTab === 'search' ? 'active' : ''}" data-tab="search">Поиск</div>
          <div class="tab ${this.activeTab === 'playlists' ? 'active' : ''}" data-tab="playlists">Плейлисты</div>
          <div class="tab ${this.activeTab === 'playing' ? 'active' : ''}" data-tab="playing">Сейчас играет</div>
        </div>

        <div class="content">
          ${this.renderContent()}
        </div>

        <div class="player-bar">
          <div class="track-art"></div>
          <div class="track-info">
            <div class="track-title">Трек не выбран</div>
            <div class="track-artist">—</div>
          </div>
          <button>▶️</button>
        </div>
      </div>
    `;

    // Добавляем обработчики вкладок
    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.dataset.tab;
        this.render();
      });
    });
  }

  renderContent() {
    if (this.activeTab === 'search') {
      return `
        <div class="search-bar">
          <input type="text" placeholder="Поиск треков, артистов, альбомов...">
          <button>Найти</button>
        </div>
        <div style="text-align:center; padding: 40px 0; color: var(--secondary-text-color);">
          Введите запрос выше, чтобы начать поиск в Яндекс Музыке
        </div>
      `;
    }

    if (this.activeTab === 'playlists') {
      return `
        <div style="text-align:center; padding: 60px 0;">
          <div style="font-size: 4em; opacity: 0.4;">📂</div>
          <p style="margin: 16px 0;">Ваши плейлисты появятся здесь</p>
          <p style="color: var(--secondary-text-color);">Скоро будет авторизация и реальные данные</p>
        </div>
      `;
    }

    if (this.activeTab === 'playing') {
      return `
        <div style="text-align:center; padding: 80px 20px;">
          <div style="font-size: 6em; margin-bottom: 20px;">🎶</div>
          <h2>Сейчас ничего не играет</h2>
          <p>Выберите трек из поиска или плейлиста</p>
        </div>
      `;
    }

    return '<p>Неизвестная вкладка</p>';
  }

  getCardSize() {
    return 10;
  }
}

customElements.define('yandex-music-browser', YandexMusicBrowser);

console.info(
  "%c YANDEX-MUSIC-BROWSER %c v0.1.0 — Let's rock! ",
  "background: #ff6a00; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px;",
  "background: #333; color: #ff6a00; padding: 4px 8px; border-radius: 0 4px 4px 0;"
);