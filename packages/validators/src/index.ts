import { z } from 'zod';

export const DocumentCategoryEnum = z.enum([
  'Insurance',
  'Identity',
  'Vehicle',
  'Education',
  'Warranty',
  'Finance',
  'Medical',
]);

export const RequestPresignedUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required').max(255),
  fileType: z.enum(['pdf', 'png', 'jpg', 'jpeg']),
  fileSizeBytes: z.number().int().positive().max(50 * 1024 * 1024, 'File size limit is 50MB'),
});

export const CreateDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  category: DocumentCategoryEnum,
  fileKey: z.string().min(1, 'File storage key is required'),
  fileType: z.enum(['pdf', 'png', 'jpg', 'jpeg']),
  fileSizeBytes: z.number().int().positive(),
  folderId: z.string().uuid().optional().nullable(),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Issue date must be YYYY-MM-DD').optional(),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expiry date must be YYYY-MM-DD').optional().nullable(),
  issuer: z.string().max(150).optional().nullable(),
  policyNumber: z.string().max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  tags: z.array(z.string().max(50)).default([]),
  isPriority: z.boolean().default(false),
});

export const UpdateDocumentSchema = CreateDocumentSchema.partial();

export const CreateReminderSchema = z.object({
  documentId: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'),
});

export const UpdateReminderSchema = z.object({
  title: z.string().max(200).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isCompleted: z.boolean().optional(),
});

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Hex color code').optional(),
  icon: z.string().max(50).optional(),
});

export const CreateShareTokenSchema = z.object({
  documentId: z.string().uuid(),
  expiresInHours: z.number().int().min(1).max(720).default(48), // up to 30 days
});

export const DocumentQuerySchema = z.object({
  search: z.string().optional(),
  category: DocumentCategoryEnum.optional(),
  filter: z.enum(['all', 'recent', 'expiring']).optional(),
  sortBy: z.enum(['date', 'expiry', 'title']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
