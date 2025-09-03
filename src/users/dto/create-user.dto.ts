import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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
    description: 'Password for the user account',
    example: 'strongPassword123',
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    description: 'ID of the role to assign to the user',
    example: 1,
  })
  roleId: number;

  @ApiProperty({
    description: 'Status of the user (active/inactive)',
    example: true,
    default: true,
    required: false,
  })
  status?: boolean;
}
