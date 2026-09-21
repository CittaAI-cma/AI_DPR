import { api } from '@/lib/api';

/**
 * Thin wrappers so Create New Latest DPR call sites don't say "Cluster" in product code.
 * They still hit the shared draft/generate/upload endpoints.
 */
export const individualDprApi = {
  saveDraft(payload: any) {
    return api.saveClusterDPRDraft(payload);
  },
  generate(payload: any, language: 'english' | 'telugu' | 'bilingual' = 'bilingual') {
    return api.generateClusterDPR(payload, language);
  },
  get(dprId: string) {
    return api.getClusterDPR(dprId);
  },
  uploadDocument(file: File) {
    return api.uploadClusterDPRDocument(file);
  },
};
