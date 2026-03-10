import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class UpdateDocumentDto {
  @ApiPropertyOptional({ example: 'Avenant au contrat 2024', description: 'Nouveau titre' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Mise à jour suite à la réunion du 10/03', description: 'Nouvelle description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: DocumentType, example: DocumentType.REPORT, description: 'Nouveau type' })
  @IsEnum(DocumentType, {
    message: `type must be one of: ${Object.values(DocumentType).join(', ')}`,
  })
  @IsOptional()
  type?: DocumentType;

  @ApiPropertyOptional({ example: '/uploads/avenant-2024.pdf', description: 'Nouveau chemin de fichier' })
  @IsString()
  @IsOptional()
  filePath?: string;

  @ApiPropertyOptional({ example: 512000, description: 'Nouvelle taille du fichier en octets' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fileSize?: number;
}
