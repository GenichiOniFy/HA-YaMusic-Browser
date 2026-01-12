"""Yandex Music Browser - основа интеграции"""

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse

from .const import DOMAIN, CONF_TOKEN

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Загрузка интеграции после добавления через UI"""
    hass.data.setdefault(DOMAIN, {})

    token = entry.data.get(CONF_TOKEN)
    if not token:
        _LOGGER.error("Токен не найден в конфигурации")
        return False

    from yandex_music import Client
    try:
        client = Client(token)
        client.init()
        # Проверка токена при загрузке (опционально)
        client.account_status()
        _LOGGER.info("Yandex Music Browser загружен! Токен валидный (аккаунт: %s)",
                     client.account_status().account.login)
    except Exception as e:
        _LOGGER.error("Ошибка инициализации клиента Yandex Music: %s", e)
        return False

    hass.data[DOMAIN][entry.entry_id] = client

    # Сервис поиска
    async def search_service(call: ServiceCall) -> ServiceResponse:
        """Сервис yandex_music_browser.search"""
        query = call.data.get("query", "").strip()
        if not query:
            return {"error": "query required"}

        try:
            search_result = client.search(query, types=["track"])
            tracks = search_result.tracks.results or []

            response = [
                {
                    "title": track.track.title,
                    "artist": track.track.artists[0].name if track.track.artists else "Неизвестный исполнитель",
                    "track_id": track.track.id,
                    "duration_ms": track.track.duration_ms
                }
                for track in tracks[:10]  # Ограничиваем 10 треками
            ]

            _LOGGER.info(f"Поиск '{query}': найдено {len(response)} треков")
            return {"response": response}

        except Exception as e:
            _LOGGER.error(f"Ошибка поиска: {e}")
            return {"error": str(e)}

    hass.services.async_register(DOMAIN, "search", search_service)

    return True