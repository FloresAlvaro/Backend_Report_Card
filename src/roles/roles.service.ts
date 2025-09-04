import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private roles: Role[] = [];
  private nextId = 1;

  create(createRoleDto: CreateRoleDto): Role {
    // Verify that the name is not already in use
    const existingRole = this.roles.find(
      (role) =>
        role.name.toLowerCase() === createRoleDto.name.toLowerCase() &&
        role.status,
    );
    if (existingRole) {
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists`,
      );
    }

    const role = new Role({
      id: this.nextId++,
      ...createRoleDto,
    });

    this.roles.push(role);
    return role;
  }

  findAllRoles(): Role[] {
    return this.roles.filter((role) => role.status);
  }

  findOneRole(id: number): Role {
    const role = this.roles.find((role) => role.id === id && role.status);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  updateRole(id: number, updateRoleDto: UpdateRoleDto): Role {
    const roleIndex = this.roles.findIndex(
      (role) => role.id === id && role.status,
    );
    if (roleIndex === -1) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Verify duplicate name if updating name
    if (updateRoleDto.name) {
      const existingRole = this.roles.find(
        (role) =>
          role.name.toLowerCase() === updateRoleDto.name!.toLowerCase() &&
          role.status &&
          role.id !== id,
      );
      if (existingRole) {
        throw new ConflictException(
          `Role with name '${updateRoleDto.name}' already exists`,
        );
      }
    }

    this.roles[roleIndex] = {
      ...this.roles[roleIndex],
      ...updateRoleDto,
    };

    return this.roles[roleIndex];
  }

  deleteRole(id: number): { message: string } {
    const roleIndex = this.roles.findIndex(
      (role) => role.id === id && role.status,
    );
    if (roleIndex === -1) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Soft delete - just mark as inactive
    this.roles[roleIndex].status = false;

    return { message: `Role with ID ${id} has been removed` };
  }
}
