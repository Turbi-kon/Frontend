import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Service

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Service)
def sync_to_redis(sender, instance, **kwargs):
    logger.info(f"Syncing Service {instance.id} to Redis")
    key = f"Service:{instance.id}"
    data = {
        "id": instance.id,
        "name": instance.name,
        "price": instance.price,
        "status": instance.status,
    }
    cache.set(key, data, timeout=None)

@receiver(post_delete, sender=Service)
def delete_from_redis(sender, instance, **kwargs):
    logger.info(f"Deleting Service {instance.id} from Redis")
    key = f"Service:{instance.id}"
    cache.delete(key)