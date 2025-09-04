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

  constructor(partial: Partial<Role> = {}) {
    Object.assign(this, partial);
    if (this.status === undefined) {
      this.status = true; // Default to active
    }
  }
}
