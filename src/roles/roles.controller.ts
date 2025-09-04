import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
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

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Creates a new role in the system',
  })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: Role,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Role with this name already exists',
  })
  createRole(@Body() createRoleDto: CreateRoleDto): Role {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all active roles',
    description: 'Retrieves all active roles in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active roles retrieved successfully',
    type: [Role],
  })
  findAllRoles(): Role[] {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Retrieves a specific role by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: Role,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  findOneRole(@Param('id', ParseIntPipe) id: number): Role {
    return this.rolesService.findOneRole(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update role',
    description: 'Updates an existing role',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: Role,
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Role name already exists',
  })
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Role {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete role',
    description: 'Soft deletes a role (marks as inactive)',
  })
  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Role with ID 1 has been removed',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  deleteRole(@Param('id', ParseIntPipe) id: number): { message: string } {
    return this.rolesService.deleteRole(id);
  }
}
