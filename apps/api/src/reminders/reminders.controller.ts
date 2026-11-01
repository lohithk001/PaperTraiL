import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RemindersService } from './reminders.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@papertrail/types';
import { CreateReminderSchema } from '@papertrail/validators';

@ApiTags('Reminders')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @ApiOperation({ summary: 'List upcoming document renewal & expiration reminders' })
  async listReminders(@CurrentUser() user: User) {
    const data = await this.remindersService.listReminders(user);
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Schedule a new reminder linked to a document' })
  async createReminder(@CurrentUser() user: User, @Body() body: any) {
    const validated = CreateReminderSchema.parse(body);
    const data = await this.remindersService.createReminder(user, validated);
    return { success: true, data };
  }

  @Post(':id/toggle')
  @ApiOperation({ summary: 'Toggle reminder completion / renewal status' })
  async toggleReminder(@CurrentUser() user: User, @Param('id') id: string) {
    const data = await this.remindersService.toggleReminder(user, id);
    return { success: true, data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reminder' })
  async deleteReminder(@CurrentUser() user: User, @Param('id') id: string) {
    const data = await this.remindersService.deleteReminder(user, id);
    return { success: true, data };
  }
}
