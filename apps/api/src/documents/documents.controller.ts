import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Query, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@papertrail/types';
import { CreateDocumentSchema, UpdateDocumentSchema, DocumentQuerySchema } from '@papertrail/validators';

@ApiTags('Documents')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'List vault documents with filtering, search, and sorting' })
  async listDocuments(
    @CurrentUser() user: User,
    @Query() query: any,
  ) {
    const validated = DocumentQuerySchema.parse(query);
    const result = await this.documentsService.listDocuments(user, validated);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details and presigned download URL by ID' })
  async getDocument(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const doc = await this.documentsService.getDocumentById(user, id);
    return {
      success: true,
      data: doc,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Save new document metadata to vault database' })
  async createDocument(
    @CurrentUser() user: User,
    @Body() body: any,
  ) {
    const validated = CreateDocumentSchema.parse(body);
    const doc = await this.documentsService.createDocument(user, validated);
    return {
      success: true,
      data: doc,
      message: 'Document saved to vault successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update document metadata, notes, or expiration date' })
  async updateDocument(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const validated = UpdateDocumentSchema.parse(body);
    const updated = await this.documentsService.updateDocument(user, id, validated);
    return {
      success: true,
      data: updated,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document record and associated reminders' })
  async deleteDocument(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const res = await this.documentsService.deleteDocument(user, id);
    return {
      success: true,
      data: res,
      message: 'Document deleted successfully',
    };
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Mark document as verified and authentic' })
  async verifyDocument(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    const doc = await this.documentsService.verifyDocument(user, id);
    return {
      success: true,
      data: doc,
      message: 'Document marked verified',
    };
  }
}
