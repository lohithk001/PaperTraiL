import { Injectable, NotFoundException } from '@nestjs/common';
import { ReminderItem, User } from '@papertrail/types';
import { CreateReminderDto } from '@papertrail/contracts';

@Injectable()
export class RemindersService {
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

  async listReminders(user: User): Promise<ReminderItem[]> {
    return this.mockReminders;
  }

  async createReminder(user: User, dto: CreateReminderDto): Promise<ReminderItem> {
    const diffMs = new Date(dto.dueDate).getTime() - Date.now();
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    const urgency = daysLeft < 15 ? 'critical' : daysLeft < 45 ? 'warning' : 'normal';

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
    const rem = this.mockReminders.find((r) => r.id === id);
    if (!rem) {
      throw new NotFoundException(`Reminder with ID "${id}" not found`);
    }
    rem.isCompleted = !rem.isCompleted;
    return rem;
  }

  async deleteReminder(user: User, id: string): Promise<{ success: boolean }> {
    this.mockReminders = this.mockReminders.filter((r) => r.id !== id);
    return { success: true };
  }
}
