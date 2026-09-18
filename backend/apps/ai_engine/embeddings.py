import os
from typing import List, Dict, Any
from django.conf import settings

class EmbeddingService:
    """Handles embedding generation and ChromaDB vector indexing."""

    def __init__(self):
        self.persist_dir = getattr(settings, 'CHROMA_PERSIST_DIRECTORY', 'chroma_db')
        os.makedirs(self.persist_dir, exist_ok=True)
        self.client = None
        self._init_chroma()

    def _init_chroma(self):
        try:
            import chromadb
            from chromadb.config import Settings
            self.client = chromadb.PersistentClient(path=self.persist_dir)
        except Exception:
            self.client = None

    def store_document_chunks(self, document_id: str, chunks: List[Dict[str, Any]]):
        """Store chunk vectors in ChromaDB collection."""
        if not chunks:
            return

        collection_name = f"doc_{str(document_id).replace('-', '_')}"

        if self.client:
            try:
                # Delete existing collection if re-indexing
                try:
                    self.client.delete_collection(name=collection_name)
                except Exception:
                    pass

                collection = self.client.create_collection(name=collection_name)
                ids = [f"{document_id}_{c['chunk_index']}" for c in chunks]
                documents = [c['text'] for c in chunks]
                metadatas = [{'chunk_index': c['chunk_index']} for c in chunks]
                
                collection.add(
                    documents=documents,
                    ids=ids,
                    metadatas=metadatas
                )
            except Exception as e:
                print(f"ChromaDB storage error: {e}")

    def query_similar_chunks(self, document_id: str, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """Retrieve top_k most relevant text chunks."""
        collection_name = f"doc_{str(document_id).replace('-', '_')}"
        results = []

        if self.client:
            try:
                collection = self.client.get_collection(name=collection_name)
                query_res = collection.query(
                    query_texts=[query],
                    n_results=min(top_k, collection.count() or top_k)
                )
                if query_res and query_res.get('documents') and query_res['documents'][0]:
                    for idx, doc_text in enumerate(query_res['documents'][0]):
                        meta = query_res['metadatas'][0][idx] if query_res.get('metadatas') else {}
                        results.append({
                            'text': doc_text,
                            'chunk_index': meta.get('chunk_index', idx),
                            'distance': query_res['distances'][0][idx] if query_res.get('distances') else 0.0
                        })
                    return results
            except Exception as e:
                print(f"ChromaDB retrieval error: {e}")

        return results

    def delete_document_index(self, document_id: str):
        """Clean up vector storage for deleted document."""
        if self.client:
            try:
                collection_name = f"doc_{str(document_id).replace('-', '_')}"
                self.client.delete_collection(name=collection_name)
            except Exception:
                pass
