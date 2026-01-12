DOMAIN = "yandex_music_browser"

async def async_setup(hass, config):
    hass.states.set("sensor.hello_world", "Привет, мир!")
    return True