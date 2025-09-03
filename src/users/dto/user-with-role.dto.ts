import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Role } from '../../roles/entities/role.entity';

export class UserWithRoleDto extends User {
  @ApiProperty({
    description: 'Role assigned to the user',
    type: () => Role,
  })
  role: Role;
}
