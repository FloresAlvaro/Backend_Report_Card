import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
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
      moderator: {
        summary: 'Moderator Role',
        value: 'moderator',
      },
    },
  })
  name: string;

  @ApiProperty({
    description: 'The status of the role (active/inactive)',
    example: true,
    default: true,
    required: false,
  })
  status?: boolean;
}
