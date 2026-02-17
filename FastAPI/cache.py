from time import time

CACHE = {}
TTL = 600  # 10 minutes

def get_cache(query: str):
    entry = CACHE.get(query)
    if not entry:
        return None
    
    data, timestamp = entry
    if time() - timestamp > TTL:
        del CACHE[query]
        return None
    
    return data


def set_cache(query: str, response):
    CACHE[query] = (response, time())
