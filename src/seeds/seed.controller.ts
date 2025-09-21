import { Controller, Post, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seeds')
@Controller('seeds')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Seed database with sample data',
    description:
      'Populates the database with sample roles, grades, subjects, users, and enrollments',
  })
  @ApiResponse({
    status: 200,
    description: 'Database seeded successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Database seeded successfully with sample data',
        },
        timestamp: {
          type: 'string',
          example: '2025-09-21T01:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during seeding',
  })
  seedDatabase(): { message: string; timestamp: string } {
    this.seedService.seedAll();
    return {
      message: 'Database seeded successfully with sample data',
      timestamp: new Date().toISOString(),
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Clear all seed data',
    description: 'Removes all seed data from the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Seed data cleared successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'All seed data cleared successfully',
        },
        timestamp: {
          type: 'string',
          example: '2025-09-21T01:30:00.000Z',
        },
      },
    },
  })
  clearSeedData(): { message: string; timestamp: string } {
    this.seedService.clearDatabase();
    return {
      message: 'All seed data cleared successfully',
      timestamp: new Date().toISOString(),
    };
  }
}
