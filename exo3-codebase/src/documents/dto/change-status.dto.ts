import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentStatus } from '../enums/document-status.enum';

export class ChangeStatusDto {
  @ApiProperty({
    enum: DocumentStatus,
    example: DocumentStatus.REVIEW,
    description:
      'Nouveau statut. Transitions valides : draft→review, review→approved/rejected, approved→archived, rejected→draft',
  })
  @IsEnum(DocumentStatus, {
    message: `status must be one of: ${Object.values(DocumentStatus).join(', ')}`,
  })
  @IsNotEmpty()
  status!: DocumentStatus;
}
