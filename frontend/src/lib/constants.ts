export const LEGAL_DISCLAIMER_TEXT = 
  "LexAssist AI provides legal information and document analysis assistance. It does not provide legal advice or replace consultation with a qualified legal professional.";

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  employment: 'Employment Contract',
  rental: 'Rental / Lease Agreement',
  nda: 'Non-Disclosure Agreement (NDA)',
  privacy: 'Privacy Policy & Terms',
  service: 'Master Service Agreement (MSA)',
  legal_notice: 'Legal Notice / Court Order',
  commercial: 'Commercial Contract',
  general: 'General Legal Document',
};

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';
