// index.js — Yandex Music Browser (простая стартовая версия)

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Регистрируем карточку с префиксом custom:
@customElement('yandex-music-browser')
export class YandexMusicBrowser extends LitElement {
  
  // Обязательное: hass будет приходить от Home Assistant
  @property({ attribute: false }) hass;

  // Конфигурация карточки (то, что задаёшь в YAML)
  @state() config;

  // Метод, который HA вызывает при первой загрузке карточки
  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this.config = config;
  }

  // Стили карточки (можно потом сильно расширить)
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      background: var(--card-background-color, #1e1e1e);
      border-radius: 12px;
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, 0 2px 5px rgba(0,0,0,0.2));
    }

    .header {
      font-size: 1.4em;
      font-weight: bold;
      margin-bottom: 12px;
      color: var(--accent-color);
    }

    .status {
      opacity: 0.7;
      font-size: 0.9em;
    }
  `;

  // Основной рендер
  render() {
    if (!this.hass || !this.config) {
      return html`<div>Загрузка...</div>`;
    }

    const entity = this.config.entity 
      ? this.hass.states[this.config.entity] 
      : null;

    const playerState = entity 
      ? entity.state === 'playing' ? '▶ Играет' 
        : entity.state === 'paused' ? '⏸ На паузе' 
        : '⏹ Остановлено'
      : 'Нет плеера';

    return html`
      <div>
        <div class="header">
          Yandex Music Browser
        </div>

        <div>
          ${this.config.title || 'Управление Яндекс Музыкой'}
        </div>

        <div class="status">
          Состояние: ${playerState}<br>
          Entity: ${this.config.entity || 'не указан'}
        </div>

        <!-- Здесь потом будет основной интерфейс: поиск, плейлисты, треки и т.д. -->
        <div style="margin-top: 16px; opacity: 0.6;">
          (пока просто заготовка — скоро добавим браузер!)
        </div>
      </div>
    `;
  }
}

// Для отладки в консоли (опционально)
console.info(
  `%c  YANDEX-MUSIC-BROWSER \n%c  Версия: 0.0.1-dev | Начало проекта`,
  'color: #4CAF50; font-weight: bold; background: black; padding: 4px 8px;',
  'color: white;'
);