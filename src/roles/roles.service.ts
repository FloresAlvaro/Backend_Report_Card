import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verify that the name is not already in use
    const existingRole = await this.prisma.role.findFirst({
      where: {
        roleName: {
          equals: createRoleDto.name,
          mode: 'insensitive',
        },
        roleStatus: true,
      },
    });

    if (existingRole) {
      throw new ConflictException(
        `Role with name '${createRoleDto.name}' already exists`,
      );
    }

    const role = await this.prisma.role.create({
      data: {
        roleName: createRoleDto.name,
        roleStatus: createRoleDto.status ?? true,
      },
    });

    return new Role(role);
  }

  async findAllRoles(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      where: { roleStatus: true },
    });
    return roles.map((role) => new Role(role));
  }

  async findAllRolesByStatus(status?: boolean): Promise<Role[]> {
    const whereCondition = status !== undefined ? { roleStatus: status } : {};

    const roles = await this.prisma.role.findMany({
      where: whereCondition,
    });
    return roles.map((role) => new Role(role));
  }

  async findAllRolesWithStatus(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((role) => new Role(role));
  }

  async findOneRole(id: number): Promise<Role> {
    const role = await this.prisma.role.findFirst({
      where: { roleId: id, roleStatus: true },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return new Role(role);
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Verify that the role exists
    await this.findOneRole(id);

    // Verify duplicate name if updating name
    if (updateRoleDto.name) {
      const existingRole = await this.prisma.role.findFirst({
        where: {
          roleName: {
            equals: updateRoleDto.name,
            mode: 'insensitive',
          },
          roleStatus: true,
          NOT: { roleId: id },
        },
      });

      if (existingRole) {
        throw new ConflictException(
          `Role with name '${updateRoleDto.name}' already exists`,
        );
      }
    }

    const updateData: Partial<{
      roleName: string;
      roleStatus: boolean;
    }> = {};
    if (updateRoleDto.name) updateData.roleName = updateRoleDto.name;
    if (updateRoleDto.status !== undefined)
      updateData.roleStatus = updateRoleDto.status;

    const role = await this.prisma.role.update({
      where: { roleId: id },
      data: updateData,
    });

    return new Role(role);
  }

  async deleteRole(id: number): Promise<{ message: string }> {
    await this.findOneRole(id);

    await this.prisma.role.update({
      where: { roleId: id },
      data: { roleStatus: false },
    });

    return { message: `Role with ID ${id} has been removed` };
  }
}
