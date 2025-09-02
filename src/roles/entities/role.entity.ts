import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({
    description: 'Unique identifier for the role',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the role',
    example: 'admin',
    examples: {
      admin: {
        summary: 'Admin Role',
        value: 'admin',
      },
      user: {
        summary: 'User Role',
        value: 'user',
      },
    },
  })
  name: string;

  @ApiProperty({
    description: 'Status of the role (active/inactive)',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Date when the role was created',
    example: '2025-09-01T20:52:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the role was last updated',
    example: '2025-09-01T20:52:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<Role> = {}) {
    Object.assign(this, partial);
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
    if (this.status === undefined) {
      this.status = true; // Default to active
    }
  }
}
