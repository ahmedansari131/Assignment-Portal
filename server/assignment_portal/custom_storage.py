from storages.backends.s3boto3 import S3Boto3Storage

class PDFStorage(S3Boto3Storage):
    location = 'pdfs'  # Change this to whatever location you prefer in your bucket
    default_acl = 'private'  # or 'public-read' if you want files to be publicly accessible
    file_overwrite = False
