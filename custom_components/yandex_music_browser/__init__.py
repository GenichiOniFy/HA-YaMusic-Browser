"""Yandex Music Browser - основа интеграции"""

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN, CONF_TOKEN

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Загрузка интеграции после добавления через UI"""
    hass.data.setdefault(DOMAIN, {})

    token = entry.data.get(CONF_TOKEN)
    if not token:
        _LOGGER.error("Токен не найден в конфигурации")
        return False

    # Пока просто логируем — что токен принят
    _LOGGER.info("Yandex Music Browser успешно загружен! Токен принят (длина: %d символов)", len(token))

    # Сохраняем токен в hass.data для будущих сервисов
    hass.data[DOMAIN][entry.entry_id] = {"token": token}

    return True