from minio import Minio
from rest_framework.views import exception_handler
from rest_framework.response import Response

def get_presigned_url(bucket_name, object_name):
    client = Minio(
        "localhost:9000",
        access_key="admin",
        secret_key="12345678",
        secure=False
    )
    return client.presigned_get_object(bucket_name, object_name)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        if response.status_code == 401:
            response.status_code = 403
            response.data = {'detail': 'У вас нет прав.'}

    return response