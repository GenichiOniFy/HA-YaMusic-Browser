"""Config flow для Yandex Music Browser"""

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult
from yandex_music import Client

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
            else:
                try:
                    # Пробуем инициализировать клиент и сделать простой запрос
                    client = Client(token)
                    client.init()  # Это синхронно, но в HA допустимо в config flow
                    client.account_status()  # Простой запрос для проверки токена
                    # Если дошло сюда — токен валидный!
                    return self.async_create_entry(
                        title="Yandex Music Browser",
                        data={CONF_TOKEN: token}
                    )
                except Exception as err:
                    errors["base"] = "connection_error"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_TOKEN): str,
            }),
            errors=errors,
            description_placeholders={
                "help": (
                    "Вставьте OAuth-токен Яндекс Музыки.\n"
                    "Как получить: music.yandex.ru → F12 → Network → "
                    "запрос к api.music.yandex.net → Authorization: OAuth ваш_токен\n\n"
                    "Токен обычно живёт 3–12 месяцев."
                )
            }
        )