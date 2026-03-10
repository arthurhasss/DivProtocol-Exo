import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ListDocumentsDto } from './dto/list-documents.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentStatus } from './enums/document-status.enum';
import { DocumentType } from './enums/document-type.enum';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Get()
  @ApiOperation({ summary: 'Lister les documents', description: 'Retourne une liste paginée avec filtres optionnels.' })
  @ApiQuery({ name: 'status', enum: DocumentStatus, required: false })
  @ApiQuery({ name: 'type', enum: DocumentType, required: false })
  @ApiQuery({ name: 'owner', required: false, example: 'alice@cabinet.fr' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Liste paginée de documents.' })
  findAll(@Query() query: ListDocumentsDto) {
    return this.documentsService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher par titre', description: 'Recherche insensible à la casse sur le titre du document.' })
  @ApiQuery({ name: 'q', required: false, example: 'contrat' })
  @ApiQuery({ name: 'owner', required: false, example: 'alice@cabinet.fr' })
  @ApiResponse({ status: 200, description: 'Documents correspondant à la recherche.' })
  search(@Query('q') q: string, @Query('owner') owner?: string) {
    return this.documentsService.search(q ?? '', owner);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Statistiques par statut', description: 'Retourne le nombre de documents pour chaque statut.' })
  @ApiResponse({ status: 200, description: 'Comptages par statut.', schema: { example: { total: 42, draft: 10, review: 8, approved: 15, rejected: 5, archived: 4 } } })
  getStats() {
    return this.documentsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un document par ID' })
  @ApiParam({ name: 'id', description: 'UUID du document', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 200, description: 'Document trouvé.' })
  @ApiResponse({ status: 404, description: 'Document introuvable.' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un document', description: 'Le statut initial est toujours `draft`.' })
  @ApiResponse({ status: 201, description: 'Document créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un document', description: 'Mise à jour partielle des métadonnées. Pour changer le statut, utiliser PATCH /:id/status.' })
  @ApiParam({ name: 'id', description: 'UUID du document' })
  @ApiResponse({ status: 200, description: 'Document mis à jour.' })
  @ApiResponse({ status: 404, description: 'Document introuvable.' })
  update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Changer le statut',
    description: 'Transitions valides :\n- `draft` → `review`\n- `review` → `approved` ou `rejected`\n- `approved` → `archived`\n- `rejected` → `draft`',
  })
  @ApiParam({ name: 'id', description: 'UUID du document' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 404, description: 'Document introuvable.' })
  @ApiResponse({ status: 422, description: 'Transition de statut invalide.' })
  changeStatus(@Param('id') id: string, @Body() dto: ChangeStatusDto) {
    return this.documentsService.changeStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un document', description: 'Interdit si le document est en statut `approved`.' })
  @ApiParam({ name: 'id', description: 'UUID du document' })
  @ApiResponse({ status: 204, description: 'Document supprimé.' })
  @ApiResponse({ status: 403, description: 'Suppression interdite (document approuvé).' })
  @ApiResponse({ status: 404, description: 'Document introuvable.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.documentsService.remove(id);
  }
}
