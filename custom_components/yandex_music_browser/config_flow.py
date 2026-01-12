"""Config flow для Yandex Music Browser"""

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN, CONF_TOKEN

class YandexMusicBrowserConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Конфигурационный поток"""

    VERSION = 1

    async def async_step_user(self, user_input=None) -> FlowResult:
        """Шаг ввода токена"""

        errors = {}

        if user_input is not None:
            token = user_input.get(CONF_TOKEN, "").strip()

            if not token:
                errors["base"] = "empty_token"
            elif len(token) < 30:  # грубая проверка длины
                errors["base"] = "invalid_token_length"
            else:
                # Пока без реальной проверки токена — просто сохраняем
                return self.async_create_entry(
                    title="Yandex Music Browser",
                    data={CONF_TOKEN: token}
                )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_TOKEN): str,
            }),
            errors=errors,
            description_placeholders={
                "help": (
                    "Вставьте OAuth-токен Яндекс Музыки.\n"
                    "Как получить: Зайдите на music.yandex.ru → F12 → Network → "
                    "любой запрос к api.music.yandex.net → Headers → Authorization: OAuth ваш_токен"
                )
            }
        )