import re
from typing import List, Dict, Any

class DocumentChunker:
    """Chunks legal documents into overlapping context windows suitable for RAG embedding."""

    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str, doc_metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        if not text:
            return []

        doc_meta = doc_metadata or {}
        # Split text into paragraphs first
        paragraphs = re.split(r'\n\s*\n', text)
        chunks = []
        current_chunk_text = ""
        current_chunk_index = 0
        start_char = 0

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            # If adding this paragraph exceeds chunk size, split by sentences or save
            if len(current_chunk_text) + len(para) > self.chunk_size and current_chunk_text:
                chunks.append({
                    'chunk_index': current_chunk_index,
                    'text': current_chunk_text.strip(),
                    'char_count': len(current_chunk_text.strip()),
                    'start_char': start_char,
                    'end_char': start_char + len(current_chunk_text.strip()),
                    'metadata': {
                        **doc_meta,
                        'chunk_index': current_chunk_index,
                    }
                })
                start_char += len(current_chunk_text) - self.chunk_overlap
                # Overlap tail of previous chunk
                overlap_text = current_chunk_text[-self.chunk_overlap:] if len(current_chunk_text) > self.chunk_overlap else ""
                current_chunk_text = overlap_text + "\n" + para
                current_chunk_index += 1
            else:
                current_chunk_text = f"{current_chunk_text}\n{para}".strip()

        # Add remaining text
        if current_chunk_text.strip():
            chunks.append({
                'chunk_index': current_chunk_index,
                'text': current_chunk_text.strip(),
                'char_count': len(current_chunk_text.strip()),
                'start_char': start_char,
                'end_char': start_char + len(current_chunk_text.strip()),
                'metadata': {
                    **doc_meta,
                    'chunk_index': current_chunk_index,
                }
            })

        return chunks
