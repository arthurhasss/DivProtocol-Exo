export enum DocumentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export const VALID_TRANSITIONS: Record<DocumentStatus, DocumentStatus[]> = {
  [DocumentStatus.DRAFT]: [DocumentStatus.REVIEW],
  [DocumentStatus.REVIEW]: [DocumentStatus.APPROVED, DocumentStatus.REJECTED],
  [DocumentStatus.APPROVED]: [DocumentStatus.ARCHIVED],
  [DocumentStatus.REJECTED]: [DocumentStatus.DRAFT],
  [DocumentStatus.ARCHIVED]: [],
};
