DOMAIN = "yandex_music_browser"

async def async_setup(hass, config):
    hass.states.set("sensor.hello_world", "Привет, мир!")
    return True

async def async_setup_entry(hass, entry):
    """Вызывается при добавлении интеграции через UI"""
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = "Hello from config entry!"

    # Создаём сенсор
    hass.states.async_set(
        "sensor.hello_world",
        "Привет из Config Entry! 🌟",
        attributes={
            "friendly_name": "Hello World от интеграции",
            "icon": "mdi:star"
        }
    )

    print("Hello World интеграция добавлена через UI!")
    return True