import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '@papertrail/types';

@ApiTags('Authentication')
@ApiBearerAuth('clerk-auth')
@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile & storage quota' })
  getCurrentUser(@CurrentUser() user: User) {
    return {
      success: true,
      data: user,
    };
  }

  @Post('sync')
  @ApiOperation({ summary: 'Sync profile from Clerk into PostgreSQL vault database' })
  syncClerkProfile(@CurrentUser() user: User) {
    return {
      success: true,
      data: user,
      message: 'Profile synchronized successfully',
    };
  }
}
