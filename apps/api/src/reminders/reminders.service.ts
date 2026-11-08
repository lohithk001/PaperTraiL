import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReminderItem, User } from '@papertrail/types';
import { CreateReminderDto } from '@papertrail/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  private mockReminders: ReminderItem[] = [
    {
      id: 'rem-1',
      userId: 'user-demo-id',
      documentId: 'doc-1',
      documentTitle: 'Vehicle Insurance Policy',
      title: 'Renew Geico Car Insurance before lapse',
      dueDate: '2026-11-12',
      daysLeft: 12,
      urgency: 'critical',
      isCompleted: false,
      category: 'Insurance',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rem-2',
      userId: 'user-demo-id',
      documentId: 'doc-4',
      documentTitle: 'MacBook Pro AppleCare Warranty',
      title: 'AppleCare+ 3-year extension eligibility deadline',
      dueDate: '2026-12-15',
      daysLeft: 45,
      urgency: 'warning',
      isCompleted: false,
      category: 'Warranty',
      createdAt: new Date().toISOString(),
    },
  ];

  private mapPrismaReminder(r: any): ReminderItem {
    const diffMs = new Date(r.dueDate).getTime() - Date.now();
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const urgency = daysLeft < 15 ? 'critical' : daysLeft < 45 ? 'warning' : 'normal';

    return {
      id: r.id,
      userId: r.userId,
      documentId: r.documentId,
      documentTitle: r.document?.title || 'Associated Document',
      title: r.title,
      dueDate: r.dueDate instanceof Date ? r.dueDate.toISOString().split('T')[0] : String(r.dueDate),
      daysLeft,
      urgency,
      isCompleted: r.isCompleted,
      category: (r.document?.category as any) || 'Insurance',
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    };
  }

  async listReminders(user: User): Promise<ReminderItem[]> {
    try {
      const dbReminders = await this.prisma.reminder.findMany({
        where: { userId: user.id },
        include: { document: true },
        orderBy: { dueDate: 'asc' },
      });
      if (dbReminders.length > 0) {
        return dbReminders.map((r) => this.mapPrismaReminder(r));
      }
    } catch {
      // Graceful offline fallback
    }
    return this.mockReminders.filter((r) => r.userId === user.id || r.userId === 'user-demo-id');
  }

  async createReminder(user: User, dto: CreateReminderDto): Promise<ReminderItem> {
    const diffMs = new Date(dto.dueDate).getTime() - Date.now();
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const urgency = daysLeft < 15 ? 'critical' : daysLeft < 45 ? 'warning' : 'normal';

    try {
      const doc = await this.prisma.document.findFirst({
        where: { id: dto.documentId, userId: user.id },
      });

      if (doc) {
        const created = await this.prisma.reminder.create({
          data: {
            userId: user.id,
            documentId: dto.documentId,
            title: dto.title,
            dueDate: new Date(dto.dueDate),
            urgency: urgency as any,
            isCompleted: false,
          },
          include: { document: true },
        });
        return this.mapPrismaReminder(created);
      }
    } catch {
      // Graceful offline fallback
    }

    const newReminder: ReminderItem = {
      id: `rem-${Date.now()}`,
      userId: user.id,
      documentId: dto.documentId,
      documentTitle: 'Associated Document',
      title: dto.title,
      dueDate: dto.dueDate,
      daysLeft,
      urgency,
      isCompleted: false,
      category: 'Insurance',
      createdAt: new Date().toISOString(),
    };

    this.mockReminders.push(newReminder);
    return newReminder;
  }

  async toggleReminder(user: User, id: string): Promise<ReminderItem> {
    try {
      const existing = await this.prisma.reminder.findUnique({
        where: { id },
        include: { document: true },
      });
      if (existing) {
        if (existing.userId !== user.id) {
          throw new ForbiddenException('Access denied: You do not own this reminder');
        }
        const updated = await this.prisma.reminder.update({
          where: { id },
          data: { isCompleted: !existing.isCompleted },
          include: { document: true },
        });
        return this.mapPrismaReminder(updated);
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      // Graceful offline fallback
    }

    const rem = this.mockReminders.find((r) => r.id === id);
    if (!rem) {
      throw new NotFoundException(`Reminder with ID "${id}" not found`);
    }
    if (rem.userId !== user.id && rem.userId !== 'user-demo-id') {
      throw new ForbiddenException('Access denied: You do not own this reminder');
    }
    rem.isCompleted = !rem.isCompleted;
    return rem;
  }

  async deleteReminder(user: User, id: string): Promise<{ success: boolean }> {
    try {
      const existing = await this.prisma.reminder.findUnique({ where: { id } });
      if (existing) {
        if (existing.userId !== user.id) {
          throw new ForbiddenException('Access denied: You do not own this reminder');
        }
        await this.prisma.reminder.delete({ where: { id } });
        return { success: true };
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      // Graceful offline fallback
    }

    const rem = this.mockReminders.find((r) => r.id === id);
    if (!rem) {
      throw new NotFoundException(`Reminder with ID "${id}" not found`);
    }
    if (rem.userId !== user.id && rem.userId !== 'user-demo-id') {
      throw new ForbiddenException('Access denied: You do not own this reminder');
    }
    this.mockReminders = this.mockReminders.filter((r) => r.id !== id);
    return { success: true };
  }
}
