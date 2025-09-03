import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';

export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user (hashed)',
    example: '$2b$10$...',
    writeOnly: true,
  })
  password: string;

  @ApiProperty({
    description: 'ID of the role assigned to the user',
    example: 1,
  })
  roleId: number;

  @ApiProperty({
    description: 'Role assigned to the user',
    type: () => Role,
  })
  role?: Role;

  @ApiProperty({
    description: 'Status of the user (active/inactive)',
    example: true,
  })
  status: boolean;

  @ApiProperty({
    description: 'Date when the user was created',
    example: '2025-09-01T20:52:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: '2025-09-01T20:52:00.000Z',
  })
  updatedAt: Date;

  constructor(partial: Partial<User> = {}) {
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
