import { ForbiddenException, Injectable, Logger, NotFoundException, UnprocessableEntityException, } from '@nestjs/common';
import { Document } from './document.entity';
import { DocumentStatus, VALID_TRANSITIONS } from './enums/document-status.enum';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ListDocumentsDto } from './dto/list-documents.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentsRepository } from './documents.repository';

export interface PaginatedDocuments {
  data: Document[];
  total: number;
  page: number;
  limit: number;
}

export interface DocumentStats {
  total: number;
  draft: number;
  review: number;
  approved: number;
  rejected: number;
  archived: number;
}

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly documentsRepository: DocumentsRepository,
  ) { }

  async findAll(query: ListDocumentsDto): Promise<PaginatedDocuments> {
    const { status, type, owner, page = 1, limit = 20 } = query;

    const [data, total] = await this.documentsRepository.findAll({
      status,
      type,
      owner,
      page,
      limit,
    });

    this.logger.log(`Listed ${data.length} documents (page ${page})`);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentsRepository.findById(id);
    if (!document) {
      throw new NotFoundException(`Document with id "${id}" not found`);
    }
    return document;
  }

  async search(q: string, owner?: string): Promise<Document[]> {
    const results = await this.documentsRepository.searchByTitle(q, owner);
    this.logger.log(`Search "${q}" returned ${results.length} results`);
    return results;
  }

  async create(dto: CreateDocumentDto): Promise<Document> {
    const document = this.documentsRepository.create({
      ...dto,
      status: DocumentStatus.DRAFT,
      description: dto.description ?? null,
      filePath: dto.filePath ?? null,
      fileSize: dto.fileSize ?? 0,
    });

    const saved = await this.documentsRepository.save(document);
    this.logger.log(`Created document id=${saved.id} title="${saved.title}"`);
    return saved;
  }

  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    const document = await this.findOne(id);

    if (dto.title !== undefined) document.title = dto.title;
    if (dto.description !== undefined) document.description = dto.description ?? null;
    if (dto.type !== undefined) document.type = dto.type;
    if (dto.filePath !== undefined) document.filePath = dto.filePath ?? null;
    if (dto.fileSize !== undefined) document.fileSize = dto.fileSize;

    const saved = await this.documentsRepository.save(document);
    this.logger.log(`Updated document id=${id}`);
    return saved;
  }

  async changeStatus(id: string, dto: ChangeStatusDto): Promise<Document> {
    const document = await this.findOne(id);
    const { status: newStatus } = dto;

    const allowedTransitions = VALID_TRANSITIONS[document.status];

    if (!allowedTransitions.includes(newStatus)) {
      throw new UnprocessableEntityException(
        `Invalid status transition from "${document.status}" to "${newStatus}". ` +
        `Allowed: ${allowedTransitions.length ? allowedTransitions.join(', ') : 'none'}`,
      );
    }

    document.status = newStatus;
    const saved = await this.documentsRepository.save(document);
    this.logger.log(`Status changed: document id=${id} → ${newStatus}`);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const document = await this.findOne(id);

    if (document.status === DocumentStatus.APPROVED) {
      throw new ForbiddenException(
        'Approved documents cannot be deleted. Archive the document first.',
      );
    }

    await this.documentsRepository.remove(document);
    this.logger.log(`Deleted document id=${id}`);
  }

  async getStats(): Promise<DocumentStats> {
    const [total, byStatus] = await Promise.all([
      this.documentsRepository.count(),
      this.documentsRepository.countByStatus(),
    ]);

    this.logger.log(`Stats fetched: total=${total}`);

    return {
      total,
      draft: byStatus[DocumentStatus.DRAFT],
      review: byStatus[DocumentStatus.REVIEW],
      approved: byStatus[DocumentStatus.APPROVED],
      rejected: byStatus[DocumentStatus.REJECTED],
      archived: byStatus[DocumentStatus.ARCHIVED],
    };
  }
}
