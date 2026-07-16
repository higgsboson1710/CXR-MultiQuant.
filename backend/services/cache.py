import redis
import json

# Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

def get_cached_dashboard(user_id: int):
    cache_key = f"dashboard:{user_id}"
    try:
        data = redis_client.get(cache_key)
        if data:
            return json.loads(data)
    except Exception as e:
        print(f"Redis cache miss/error: {e}")
    return None

def set_cached_dashboard(user_id: int, data: list, expire_time: int = 300):
    cache_key = f"dashboard:{user_id}"
    try:
        redis_client.setex(cache_key, expire_time, json.dumps(data))
    except Exception as e:
        print(f"Failed to set Redis cache: {e}")

def clear_cached_dashboard(user_id: int):
    cache_key = f"dashboard:{user_id}"
    try:
        redis_client.delete(cache_key)
    except Exception as e:
        pass
