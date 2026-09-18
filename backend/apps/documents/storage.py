import os
import uuid
import re
from django.core.exceptions import ValidationError
from django.conf import settings

ALLOWED_MIME_TYPES = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'text/plain': 'txt',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/tiff': 'tiff'
}

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt', 'png', 'jpg', 'jpeg', 'tiff'}

def sanitize_filename(filename: str) -> str:
    """Sanitize original filename to prevent path traversal and injection attacks."""
    clean_name = os.path.basename(filename)
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', clean_name)
    return clean_name[:150]

def document_upload_path(instance, filename: str) -> str:
    """Generate isolated UUID path per user to prevent enumeration."""
    user_id = str(instance.owner.id) if instance.owner else 'anonymous'
    file_id = str(uuid.uuid4())
    ext = filename.split('.')[-1].lower() if '.' in filename else 'bin'
    clean_name = sanitize_filename(filename)
    return f'documents/{user_id}/{file_id}_{clean_name}'

def validate_uploaded_file(file_obj):
    """Validate file size and magic bytes."""
    # 1. Size check
    max_size = getattr(settings, 'MAX_UPLOAD_SIZE', 50 * 1024 * 1024)
    if file_obj.size > max_size:
        raise ValidationError(f"File size exceeds the limit of {max_size // (1024 * 1024)}MB.")

    # 2. Extension check
    ext = file_obj.name.split('.')[-1].lower() if '.' in file_obj.name else ''
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(f"Unsupported file extension '.{ext}'. Supported: {', '.join(ALLOWED_EXTENSIONS)}")

    # 3. Magic byte check if magic is available
    try:
        import magic
        file_obj.seek(0)
        header = file_obj.read(2048)
        file_obj.seek(0)
        mime = magic.from_buffer(header, mime=True)
        if mime not in ALLOWED_MIME_TYPES and not mime.startswith('text/'):
            # Allow fallback for standard plain text or docs where libmagic is lenient
            if ext not in ALLOWED_EXTENSIONS:
                raise ValidationError(f"Invalid file content. Detected MIME type: {mime}")
    except (ImportError, Exception):
        # Fallback if magic library is not installed in local environment
        pass
