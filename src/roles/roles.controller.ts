import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description:
      'Creates a new role in the system. Example: Create an admin role with full permissions.',
  })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Role data to create',
    examples: {
      admin: {
        summary: 'Admin Role Example',
        description: 'Example of creating an admin role with full permissions',
        value: {
          name: 'admin',
          status: true,
        },
      },
      user: {
        summary: 'User Role Example',
        description: 'Example of creating a regular user role',
        value: {
          name: 'user',
          status: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: Role,
    example: {
      id: 1,
      name: 'admin',
      status: true,
      createdAt: '2025-09-01T20:52:00.000Z',
      updatedAt: '2025-09-01T20:52:00.000Z',
    },
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active roles',
    description:
      'Retrieves all active roles in the system, including admin, user, and other role types.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active roles',
    type: [Role],
    example: [
      {
        id: 1,
        name: 'admin',
        status: true,
        createdAt: '2025-09-01T20:52:00.000Z',
        updatedAt: '2025-09-01T20:52:00.000Z',
      },
      {
        id: 2,
        name: 'user',
        status: true,
        createdAt: '2025-09-01T20:53:00.000Z',
        updatedAt: '2025-09-01T20:53:00.000Z',
      },
    ],
  })
  findAll() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get role by ID',
    description:
      'Retrieves a specific role by its ID. Example: Get admin role details by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role found',
    type: Role,
    example: {
      id: 1,
      name: 'admin',
      status: true,
      createdAt: '2025-09-01T20:52:00.000Z',
      updatedAt: '2025-09-01T20:52:00.000Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOneRole(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update role',
    description:
      'Updates an existing role. Example: Change admin role status or name.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID to update',
    example: 1,
  })
  @ApiBody({
    type: UpdateRoleDto,
    description: 'Role data to update',
    examples: {
      deactivateAdmin: {
        summary: 'Deactivate Admin Role',
        description: 'Example of deactivating an admin role',
        value: {
          status: false,
        },
      },
      renameAdmin: {
        summary: 'Rename Admin Role',
        description: 'Example of renaming admin role to super-admin',
        value: {
          name: 'super-admin',
        },
      },
      completeUpdate: {
        summary: 'Complete Admin Update',
        description: 'Example of updating both name and status',
        value: {
          name: 'system-admin',
          status: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: Role,
    example: {
      id: 1,
      name: 'admin',
      status: false,
      createdAt: '2025-09-01T20:52:00.000Z',
      updatedAt: '2025-09-01T20:55:00.000Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete role (soft delete)',
    description:
      'Soft deletes a role by setting its status to false. Example: Deactivate admin role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
    example: {
      message: 'Role with ID 1 has been removed',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  remove(@Param('id') id: string) {
    return this.rolesService.deleteRole(+id);
  }
}
