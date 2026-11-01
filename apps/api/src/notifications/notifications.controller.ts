import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, NotificationItem } from '@papertrail/types';

@ApiTags('Notifications')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  private notifications: NotificationItem[] = [
    {
      id: 'n-1',
      userId: 'user-demo-id',
      title: 'Urgent: Insurance Expiring',
      message: 'Vehicle Insurance Policy expires in 12 days. Tap to review.',
      type: 'alert',
      isRead: false,
      createdAt: '10m ago',
    },
    {
      id: 'n-2',
      userId: 'user-demo-id',
      title: 'Document Verified',
      message: 'International Passport has been verified and encrypted.',
      type: 'success',
      isRead: false,
      createdAt: '2h ago',
    },
  ];

  @Get()
  @ApiOperation({ summary: 'List user notifications and policy alert feed' })
  listNotifications(@CurrentUser() user: User) {
    return { success: true, data: this.notifications };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read' })
  markRead(@CurrentUser() user: User, @Param('id') id: string) {
    const item = this.notifications.find((n) => n.id === id);
    if (item) item.isRead = true;
    return { success: true };
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: User) {
    this.notifications.forEach((n) => (n.isRead = true));
    return { success: true };
  }
}
