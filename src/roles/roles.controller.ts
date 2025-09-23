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
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
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
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get roles filtered by status',
    description:
      'Retrieves roles filtered by status. If no status is provided, returns all roles (active and inactive)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: Boolean,
    description:
      'Filter by status: true for active, false for inactive. If omitted, returns all roles',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of roles retrieved successfully',
    type: [Role],
  })
  async findAllRoles(
    @Query('status', new ParseBoolPipe({ optional: true })) status?: boolean,
  ): Promise<Role[]> {
    return this.rolesService.findAllRolesByStatus(status);
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
  async findOneRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
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
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
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
  async deleteRole(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.rolesService.deleteRole(id);
  }
}
