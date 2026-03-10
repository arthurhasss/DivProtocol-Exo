import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { DocumentStatus } from './enums/document-status.enum';
import { DocumentType } from './enums/document-type.enum';

export interface FindAllOptions {
  status?: DocumentStatus;
  type?: DocumentType;
  owner?: string;
  page: number;
  limit: number;
}

@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectRepository(Document)
    private readonly repo: Repository<Document>,
  ) { }

  async findAll(options: FindAllOptions): Promise<[Document[], number]> {
    const { status, type, owner, page, limit } = options;
    const qb = this.repo.createQueryBuilder('document');

    if (status) qb.andWhere('document.status = :status', { status });
    if (type) qb.andWhere('document.type = :type', { type });
    if (owner) qb.andWhere('document.owner = :owner', { owner });

    qb.orderBy('document.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  findById(id: string): Promise<Document | null> {
    return this.repo.findOneBy({ id });
  }

  searchByTitle(q: string, owner?: string): Promise<Document[]> {
    const qb = this.repo.createQueryBuilder('document');
    qb.where('LOWER(document.title) LIKE :q', { q: `%${q.toLowerCase()}%` });
    if (owner) qb.andWhere('document.owner = :owner', { owner });
    return qb.getMany();
  }

  create(data: Partial<Document>): Document {
    return this.repo.create(data);
  }

  save(document: Document): Promise<Document> {
    return this.repo.save(document);
  }

  remove(document: Document): Promise<Document> {
    return this.repo.remove(document);
  }

  async countByStatus(): Promise<Record<DocumentStatus, number>> {
    const statuses = Object.values(DocumentStatus);
    const counts = await Promise.all(
      statuses.map((status) => this.repo.count({ where: { status } })),
    );
    return Object.fromEntries(
      statuses.map((status, i) => [status, counts[i]]),
    ) as Record<DocumentStatus, number>;
  }

  count(): Promise<number> {
    return this.repo.count();
  }
}
