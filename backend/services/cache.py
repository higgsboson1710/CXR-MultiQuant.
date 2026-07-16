import redis
import json

# Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def get_cached_dashboard(user_id: int):
    cache_key = f"dashboard:{user_id}"
    data = redis_client.get(cache_key)
    if data:
        return json.loads(data)
    return None

def set_cached_dashboard(user_id: int, data: list, expire_time: int = 300):
    cache_key = f"dashboard:{user_id}"
    redis_client.setex(cache_key, expire_time, json.dumps(data))

def clear_cached_dashboard(user_id: int):
    cache_key = f"dashboard:{user_id}"
    redis_client.delete(cache_key)
