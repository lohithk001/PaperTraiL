import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, FolderItem } from '@papertrail/types';
import { CreateFolderSchema } from '@papertrail/validators';

@ApiTags('Folders')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('folders')
export class FoldersController {
  private folders: FolderItem[] = [
    { id: 'f-1', userId: 'user-demo-id', name: 'Auto & Transit', color: '#0861E8', icon: 'car', documentCount: 2, createdAt: new Date().toISOString() },
    { id: 'f-2', userId: 'user-demo-id', name: 'Identity & Visa', color: '#10B981', icon: 'shield', documentCount: 1, createdAt: new Date().toISOString() },
    { id: 'f-3', userId: 'user-demo-id', name: 'Warranties & Gadgets', color: '#F59E0B', icon: 'laptop', documentCount: 1, createdAt: new Date().toISOString() },
  ];

  @Get()
  @ApiOperation({ summary: 'List user vault folders' })
  listFolders(@CurrentUser() user: User) {
    return { success: true, data: this.folders };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organized folder' })
  createFolder(@CurrentUser() user: User, @Body() body: any) {
    const validated = CreateFolderSchema.parse(body);
    const newFolder: FolderItem = {
      id: `f-${Date.now()}`,
      userId: user.id,
      name: validated.name,
      color: validated.color || '#0861E8',
      icon: validated.icon || 'folder',
      documentCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.folders.push(newFolder);
    return { success: true, data: newFolder };
  }
}
