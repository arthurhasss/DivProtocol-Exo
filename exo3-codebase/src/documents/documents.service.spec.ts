import {
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Document } from './document.entity';
import { DocumentsRepository } from './documents.repository';
import { DocumentsService } from './documents.service';
import { DocumentStatus } from './enums/document-status.enum';
import { DocumentType } from './enums/document-type.enum';

// Minimal factory to build a Document object for tests
function makeDocument(overrides: Partial<Document> = {}): Document {
  return {
    id: 'test-uuid-1',
    title: 'Test Document',
    description: null,
    type: DocumentType.CONTRACT,
    status: DocumentStatus.DRAFT,
    owner: 'alice',
    filePath: null,
    fileSize: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

type MockDocumentsRepository = Partial<Record<keyof DocumentsRepository, jest.Mock>>;

const createMockRepository = (): MockDocumentsRepository => ({
  findById: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
  countByStatus: jest.fn(),
  findAll: jest.fn(),
  searchByTitle: jest.fn(),
});

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: MockDocumentsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: DocumentsRepository,
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get<MockDocumentsRepository>(DocumentsRepository);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Suite 1: Status workflow transitions
  // ─────────────────────────────────────────────────────────────────────────
  describe('changeStatus() — workflow transitions', () => {
    it('should transition from draft → review', async () => {
      const doc = makeDocument({ status: DocumentStatus.DRAFT });
      repo.findById!.mockResolvedValue(doc);
      repo.save!.mockImplementation((d: Document) => Promise.resolve(d));

      const result = await service.changeStatus(doc.id, {
        status: DocumentStatus.REVIEW,
      });

      expect(result.status).toBe(DocumentStatus.REVIEW);
    });

    it('should transition from review → approved', async () => {
      const doc = makeDocument({ status: DocumentStatus.REVIEW });
      repo.findById!.mockResolvedValue(doc);
      repo.save!.mockImplementation((d: Document) => Promise.resolve(d));

      const result = await service.changeStatus(doc.id, {
        status: DocumentStatus.APPROVED,
      });

      expect(result.status).toBe(DocumentStatus.APPROVED);
    });

    it('should transition from review → rejected', async () => {
      const doc = makeDocument({ status: DocumentStatus.REVIEW });
      repo.findById!.mockResolvedValue(doc);
      repo.save!.mockImplementation((d: Document) => Promise.resolve(d));

      const result = await service.changeStatus(doc.id, {
        status: DocumentStatus.REJECTED,
      });

      expect(result.status).toBe(DocumentStatus.REJECTED);
    });

    it('should transition from rejected → draft', async () => {
      const doc = makeDocument({ status: DocumentStatus.REJECTED });
      repo.findById!.mockResolvedValue(doc);
      repo.save!.mockImplementation((d: Document) => Promise.resolve(d));

      const result = await service.changeStatus(doc.id, {
        status: DocumentStatus.DRAFT,
      });

      expect(result.status).toBe(DocumentStatus.DRAFT);
    });

    it('should transition from approved → archived', async () => {
      const doc = makeDocument({ status: DocumentStatus.APPROVED });
      repo.findById!.mockResolvedValue(doc);
      repo.save!.mockImplementation((d: Document) => Promise.resolve(d));

      const result = await service.changeStatus(doc.id, {
        status: DocumentStatus.ARCHIVED,
      });

      expect(result.status).toBe(DocumentStatus.ARCHIVED);
    });

    it('should throw UnprocessableEntityException for draft → approved (skipping review)', async () => {
      const doc = makeDocument({ status: DocumentStatus.DRAFT });
      repo.findById!.mockResolvedValue(doc);

      await expect(
        service.changeStatus(doc.id, { status: DocumentStatus.APPROVED }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should throw UnprocessableEntityException for archived → anything', async () => {
      const doc = makeDocument({ status: DocumentStatus.ARCHIVED });
      repo.findById!.mockResolvedValue(doc);

      await expect(
        service.changeStatus(doc.id, { status: DocumentStatus.DRAFT }),
      ).rejects.toThrow(UnprocessableEntityException);
    });

    it('should throw NotFoundException when document does not exist', async () => {
      repo.findById!.mockResolvedValue(null);

      await expect(
        service.changeStatus('non-existent-id', { status: DocumentStatus.REVIEW }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Suite 2: Document type validation (via create)
  // ─────────────────────────────────────────────────────────────────────────
  describe('create() — document type is set at creation', () => {
    it.each(Object.values(DocumentType))(
      'should create a document with type "%s"',
      async (type) => {
        const dto = { title: 'Doc', type, owner: 'alice' };
        const created = makeDocument({ type });
        repo.create!.mockReturnValue(created);
        repo.save!.mockResolvedValue(created);

        const result = await service.create(dto);

        expect(result.type).toBe(type);
        expect(result.status).toBe(DocumentStatus.DRAFT);
      },
    );

    it('should always set initial status to DRAFT regardless of payload', async () => {
      const dto = { title: 'Doc', type: DocumentType.INVOICE, owner: 'bob' };
      const created = makeDocument({ type: DocumentType.INVOICE, status: DocumentStatus.DRAFT });
      repo.create!.mockReturnValue(created);
      repo.save!.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result.status).toBe(DocumentStatus.DRAFT);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Suite 3: Deletion rules
  // ─────────────────────────────────────────────────────────────────────────
  describe('remove() — deletion business rules', () => {
    it('should throw ForbiddenException when deleting an approved document', async () => {
      const doc = makeDocument({ status: DocumentStatus.APPROVED });
      repo.findById!.mockResolvedValue(doc);

      await expect(service.remove(doc.id)).rejects.toThrow(ForbiddenException);
      expect(repo.remove).not.toHaveBeenCalled();
    });

    it('should successfully delete a draft document', async () => {
      const doc = makeDocument({ status: DocumentStatus.DRAFT });
      repo.findById!.mockResolvedValue(doc);
      repo.remove!.mockResolvedValue(doc);

      await expect(service.remove(doc.id)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(doc);
    });

    it('should successfully delete a rejected document', async () => {
      const doc = makeDocument({ status: DocumentStatus.REJECTED });
      repo.findById!.mockResolvedValue(doc);
      repo.remove!.mockResolvedValue(doc);

      await expect(service.remove(doc.id)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(doc);
    });

    it('should throw NotFoundException when document does not exist', async () => {
      repo.findById!.mockResolvedValue(null);

      await expect(service.remove('ghost-id')).rejects.toThrow(NotFoundException);
    });
  });
});
