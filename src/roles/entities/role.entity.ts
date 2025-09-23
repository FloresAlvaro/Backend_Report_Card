import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({
    description: 'Unique identifier for the role',
    example: 1,
  })
  roleId: number;

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
  roleName: string;

  @ApiProperty({
    description: 'Status of the role (active/inactive)',
    example: true,
  })
  roleStatus: boolean;

  constructor(partial: Partial<Role> = {}) {
    Object.assign(this, partial);
    if (this.roleStatus === undefined) {
      this.roleStatus = true; // Default to active
    }
  }

  // Helper methods for backward compatibility with existing code
  get id(): number {
    return this.roleId;
  }

  get name(): string {
    return this.roleName;
  }

  get status(): boolean {
    return this.roleStatus;
  }
}
