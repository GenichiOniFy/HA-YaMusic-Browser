class YandexMusicBrowser extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    // Здесь можно будет потом принимать конфиг от пользователя
    this.config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this._hass) return;

    // Очищаем предыдущее содержимое
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          padding: 20px;
          font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
          color: var(--primary-text-color);
          text-align: center;
        }
        h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
        }
        p {
          font-size: 1.2em;
          color: var(--secondary-text-color);
        }
        .emoji {
          font-size: 4em;
          margin: 20px 0;
        }
      </style>

      <div class="container">
        <div class="emoji">🎵</div>
        <h1>Hello from Yandex Music Browser!</h1>
        <p>Привет, это твой будущий браузер Яндекс Музыки в Home Assistant.</p>
        <p>Текущий язык HA: ${this._hass.language}</p>
        <p>Пользователь: ${this._hass.user.name}</p>
      </div>
    `;
  }

  // Размер панели (можно менять в конфиге позже)
  getCardSize() {
    return 6;
  }
}

// Регистрируем кастомный элемент
customElements.define('yandex-music-browser', YandexMusicBrowser);

// Сообщаем Lovelace, что ресурс загружен
console.info(
  `%c YANDEX-MUSIC-BROWSER %c v0.0.1 `,
  'color: white; background: #ff6a00; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
  'color: #ff6a00; background: white; padding: 4px 8px; border-radius: 4px;'
);