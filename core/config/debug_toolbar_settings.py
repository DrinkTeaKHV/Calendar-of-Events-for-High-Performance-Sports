from .local_settings import *

MIDDLEWARE.append('debug_toolbar.middleware.DebugToolbarMiddleware', )
INSTALLED_APPS.append('debug_toolbar')
INTERNAL_IPS = [
    "127.0.0.1",
    "192.168.1.24"
]
