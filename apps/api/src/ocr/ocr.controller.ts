import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OcrService } from './ocr.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('AI & OCR')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('extract')
  @ApiOperation({ summary: 'Extract metadata and categorize document via Gemini API OCR' })
  async extract(@Body('fileKey') fileKey: string) {
    const data = await this.ocrService.extractDocumentMetadata(fileKey || 'sample.pdf');
    return { success: true, data };
  }
}
