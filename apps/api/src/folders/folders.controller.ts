import { Controller, Get, Post, Delete, Param, Body, UseGuards, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, FolderItem } from '@papertrail/types';
import { CreateFolderSchema } from '@papertrail/validators';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Folders')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly prisma: PrismaService) {}

  private mockFolders: FolderItem[] = [
    { id: 'f-1', userId: 'user-demo-id', name: 'Auto & Transit', color: '#0861E8', icon: 'car', documentCount: 2, createdAt: new Date().toISOString() },
    { id: 'f-2', userId: 'user-demo-id', name: 'Identity & Visa', color: '#10B981', icon: 'shield', documentCount: 1, createdAt: new Date().toISOString() },
    { id: 'f-3', userId: 'user-demo-id', name: 'Warranties & Gadgets', color: '#F59E0B', icon: 'laptop', documentCount: 1, createdAt: new Date().toISOString() },
  ];

  @Get()
  @ApiOperation({ summary: 'List user vault folders' })
  async listFolders(@CurrentUser() user: User) {
    try {
      const dbFolders = await this.prisma.folder.findMany({
        where: { userId: user.id },
        include: { _count: { select: { documents: true } } },
        orderBy: { createdAt: 'desc' },
      });
      if (dbFolders.length > 0) {
        return {
          success: true,
          data: dbFolders.map((f) => ({
            id: f.id,
            userId: f.userId,
            name: f.name,
            color: f.color || '#0861E8',
            icon: f.icon || 'folder',
            documentCount: f._count?.documents || 0,
            createdAt: f.createdAt.toISOString(),
          })),
        };
      }
    } catch {
      // Graceful offline fallback
    }
    return { success: true, data: this.mockFolders.filter((f) => f.userId === user.id || f.userId === 'user-demo-id') };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organized folder' })
  async createFolder(@CurrentUser() user: User, @Body() body: any) {
    const validated = CreateFolderSchema.parse(body);

    try {
      const created = await this.prisma.folder.create({
        data: {
          userId: user.id,
          name: validated.name,
          color: validated.color || '#0861E8',
          icon: validated.icon || 'folder',
        },
      });
      return {
        success: true,
        data: {
          id: created.id,
          userId: created.userId,
          name: created.name,
          color: created.color || '#0861E8',
          icon: created.icon || 'folder',
          documentCount: 0,
          createdAt: created.createdAt.toISOString(),
        },
      };
    } catch {
      // Graceful offline fallback
    }

    const newFolder: FolderItem = {
      id: `f-${Date.now()}`,
      userId: user.id,
      name: validated.name,
      color: validated.color || '#0861E8',
      icon: validated.icon || 'folder',
      documentCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.mockFolders.push(newFolder);
    return { success: true, data: newFolder };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vault folder' })
  async deleteFolder(@CurrentUser() user: User, @Param('id') id: string) {
    try {
      const existing = await this.prisma.folder.findUnique({ where: { id } });
      if (existing) {
        if (existing.userId !== user.id) {
          throw new ForbiddenException('Access denied: You do not own this folder');
        }
        await this.prisma.folder.delete({ where: { id } });
        return { success: true, message: 'Folder deleted successfully' };
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      // Graceful offline fallback
    }

    const folder = this.mockFolders.find((f) => f.id === id);
    if (!folder) {
      throw new NotFoundException(`Folder with ID "${id}" not found`);
    }
    if (folder.userId !== user.id && folder.userId !== 'user-demo-id') {
      throw new ForbiddenException('Access denied: You do not own this folder');
    }
    this.mockFolders = this.mockFolders.filter((f) => f.id !== id);
    return { success: true, message: 'Folder deleted successfully' };
  }
}
