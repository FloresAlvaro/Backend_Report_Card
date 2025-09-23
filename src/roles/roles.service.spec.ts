import { Test, TestingModule } from '@nestjs/testing';import { Test, TestingModule } from '@nestjs/testing';import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundException, ConflictException } from '@nestjs/common';

import { RolesService } from './roles.service';import { NotFoundException, ConflictException } from '@nestjs/common';import { NotFoundException, ConflictException } from '@nestjs/common';

import { CreateRoleDto } from './dto/create-role.dto';

import { UpdateRoleDto } from './dto/update-role.dto';import { RolesService } from './roles.service';import { RolesService } from './roles.service';

import { PrismaService } from '../prisma/prisma.service';

import { CreateRoleDto } from './dto/create-role.dto';import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesService', () => {

  let service: RolesService;import { UpdateRoleDto } from './dto/update-role.dto';import { UpdateRoleDto } from './dto/update-role.dto';

  let prismaService: PrismaService;

import { PrismaService } from '../prisma/prisma.service';

  beforeEach(async () => {

    const mockPrismaService = {describe('RolesService', () => {

      role: {

        findFirst: jest.fn(),describe('RolesService', () => {  let service: RolesService;

        create: jest.fn(),

        findMany: jest.fn(),  let service: RolesService;

        update: jest.fn(),

      },  let prismaService: PrismaService;  beforeEach(async () => {

    };

    const module: TestingModule = await Test.createTestingModule({

    const module: TestingModule = await Test.createTestingModule({

      providers: [  beforeEach(async () => {      providers: [RolesService],

        RolesService,

        {    const mockPrismaService = {    }).compile();

          provide: PrismaService,

          useValue: mockPrismaService,      role: {

        },

      ],        findFirst: jest.fn(),    service = module.get<RolesService>(RolesService);

    }).compile();

        create: jest.fn(),  });

    service = module.get<RolesService>(RolesService);

    prismaService = module.get<PrismaService>(PrismaService);        findMany: jest.fn(),

  });

        update: jest.fn(),  it('should be defined', () => {

  it('should be defined', () => {

    expect(service).toBeDefined();      },    expect(service).toBeDefined();

  });

    };  });

  describe('createRole', () => {

    it('should create an admin role successfully', async () => {

      const createAdminDto: CreateRoleDto = {

        name: 'admin',    const module: TestingModule = await Test.createTestingModule({  describe('create', () => {

        status: true,

      };      providers: [    it('should create an admin role successfully', async () => {



      const mockDbRole = {        RolesService,      // Arrange

        roleID: 1,

        roleName: 'admin',        {      const createAdminDto: CreateRoleDto = {

        roleStatus: true,

      };          provide: PrismaService,        name: 'admin',



      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);          useValue: mockPrismaService,        status: true,

      (prismaService.role.create as jest.Mock).mockResolvedValue(mockDbRole);

        },      };

      const result = await service.createRole(createAdminDto);

      ],

      expect(result).toBeDefined();

      expect(result.id).toBe(1);    }).compile();      // Act

      expect(result.name).toBe('admin');

      expect(result.status).toBe(true);      const result = await service.createRole(createAdminDto);

    });

    service = module.get<RolesService>(RolesService);

    it('should throw ConflictException for duplicate role names', async () => {

      const adminRole: CreateRoleDto = { name: 'admin', status: true };    prismaService = module.get<PrismaService>(PrismaService);      // Assert



      const mockExistingRole = {  });      expect(result).toBeDefined();

        roleID: 1,

        roleName: 'admin',      expect(result.id).toBe(1); // First role should have ID 1

        roleStatus: true,

      };  it('should be defined', () => {      expect(result.name).toBe('admin');



      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(    expect(service).toBeDefined();      expect(result.status).toBe(true);

        mockExistingRole,

      );  });    });



      await expect(service.createRole(adminRole)).rejects.toThrow(

        ConflictException,

      );  describe('createRole', () => {    it('should create role with default status when not provided', async () => {

    });

  });    it('should create an admin role successfully', async () => {      // Arrange



  describe('findAllRoles', () => {      // Arrange      const createRoleDto: CreateRoleDto = {

    it('should return empty array when no roles exist', async () => {

      (prismaService.role.findMany as jest.Mock).mockResolvedValue([]);      const createAdminDto: CreateRoleDto = {        name: 'user',



      const result = await service.findAllRoles();        name: 'admin',      };



      expect(result).toEqual([]);        status: true,

    });

  });      };      // Act



  describe('findOneRole', () => {      const result = await service.createRole(createRoleDto);

    it('should find and return an admin role by ID', async () => {

      const mockDbRole = {      const mockDbRole = {

        roleID: 1,

        roleName: 'admin',        roleID: 1,      // Assert

        roleStatus: true,

      };        roleName: 'admin',      expect(result.status).toBe(true); // Should default to true



      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(mockDbRole);        roleStatus: true,    });



      const result = await service.findOneRole(1);      };



      expect(result.id).toBe(1);    it('should auto-increment IDs for multiple roles', async () => {

      expect(result.name).toBe('admin');

      expect(result.status).toBe(true);      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);      // Arrange

    });

      (prismaService.role.create as jest.Mock).mockResolvedValue(mockDbRole);      const adminRole: CreateRoleDto = { name: 'admin', status: true };

    it('should throw NotFoundException when role does not exist', async () => {

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);      const userRole: CreateRoleDto = { name: 'user', status: true };



      await expect(service.findOneRole(999)).rejects.toThrow(      // Act      const moderatorRole: CreateRoleDto = { name: 'moderator', status: true };

        NotFoundException,

      );      const result = await service.createRole(createAdminDto);

    });

  });      // Act



  describe('updateRole', () => {      // Assert      const role1 = await service.createRole(adminRole);

    it('should update an admin role successfully', async () => {

      const updateDto: UpdateRoleDto = { name: 'super-admin', status: true };      expect(result).toBeDefined();      const role2 = await service.createRole(userRole);



      const mockExistingRole = {      expect(result.id).toBe(1);      const role3 = await service.createRole(moderatorRole);

        roleID: 1,

        roleName: 'admin',      expect(result.name).toBe('admin');

        roleStatus: true,

      };      expect(result.status).toBe(true);      // Assert



      const mockUpdatedRole = {    });      expect(role1.id).toBe(1);

        roleID: 1,

        roleName: 'super-admin',      expect(role2.id).toBe(2);

        roleStatus: true,

      };    it('should create role with default status when not provided', async () => {      expect(role3.id).toBe(3);



      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(      // Arrange    });

        mockExistingRole,

      );      const createRoleDto: CreateRoleDto = {

      (prismaService.role.update as jest.Mock).mockResolvedValue(

        mockUpdatedRole,        name: 'user',    it('should throw ConflictException for duplicate role names', async () => {

      );

      };      // Arrange

      const result = await service.updateRole(1, updateDto);

      const adminRole: CreateRoleDto = { name: 'admin', status: true };

      expect(result.id).toBe(1);

      expect(result.name).toBe('super-admin');      const mockDbRole = {      await service.createRole(adminRole);

      expect(result.status).toBe(true);

    });        roleID: 1,



    it('should throw NotFoundException when updating non-existent role', async () => {        roleName: 'user',      const duplicateAdminRole: CreateRoleDto = { name: 'ADMIN', status: true };

      const updateDto: UpdateRoleDto = { name: 'updated-role' };

        roleStatus: true,

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);

      };      // Act & Assert

      await expect(service.updateRole(999, updateDto)).rejects.toThrow(

        NotFoundException,      await expect(service.createRole(duplicateAdminRole)).rejects.toThrow(

      );

    });      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);        ConflictException,

  });

      (prismaService.role.create as jest.Mock).mockResolvedValue(mockDbRole);      );

  describe('deleteRole', () => {

    it('should soft delete a role successfully', async () => {    });

      const mockExistingRole = {

        roleID: 1,      // Act  });

        roleName: 'admin',

        roleStatus: true,      const result = await service.createRole(createRoleDto);

      };

  describe('findAllRoles', () => {

      const mockUpdatedRole = {

        roleID: 1,      // Assert    it('should return empty array when no roles exist', () => {

        roleName: 'admin',

        roleStatus: false,      expect(result.status).toBe(true);      // Act

      };

    });      const result = service.findAllRoles();

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(

        mockExistingRole,

      );

      (prismaService.role.update as jest.Mock).mockResolvedValue(    it('should throw ConflictException for duplicate role names', async () => {      // Assert

        mockUpdatedRole,

      );      // Arrange      expect(result).toEqual([]);



      const result = await service.deleteRole(1);      const adminRole: CreateRoleDto = { name: 'admin', status: true };    });



      expect(result.message).toBe('Role with ID 1 has been removed');

    });

      const mockExistingRole = {    it('should return only active roles', () => {

    it('should throw NotFoundException when deleting non-existent role', async () => {

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);        roleID: 1,      // Arrange



      await expect(service.deleteRole(999)).rejects.toThrow(        roleName: 'admin',      const activeAdminRole: CreateRoleDto = { name: 'admin', status: true };

        NotFoundException,

      );        roleStatus: true,      const inactiveUserRole: CreateRoleDto = { name: 'user', status: false };

    });

  });      };

});
      service.createRole(activeAdminRole);

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(mockExistingRole);      service.createRole(inactiveUserRole);



      // Act & Assert      // Act

      await expect(service.createRole(adminRole)).rejects.toThrow(      const result = service.findAllRoles();

        ConflictException,

      );      // Assert

    });      expect(result).toHaveLength(1);

  });      expect(result[0].name).toBe('admin');

      expect(result[0].status).toBe(true);

  describe('findAllRoles', () => {    });

    it('should return empty array when no roles exist', async () => {

      // Arrange    it('should return multiple active roles including admin', () => {

      (prismaService.role.findMany as jest.Mock).mockResolvedValue([]);      // Arrange

      const roles = [

      // Act        { name: 'admin', status: true },

      const result = await service.findAllRoles();        { name: 'user', status: true },

        { name: 'guest', status: false }, // This should not appear in results

      // Assert        { name: 'moderator', status: true },

      expect(result).toEqual([]);      ];

    });

      roles.forEach((role) => service.createRole(role));

    it('should return only active roles', async () => {

      // Arrange      // Act

      const mockDbRoles = [      const result = service.findAllRoles();

        {

          roleID: 1,      // Assert

          roleName: 'admin',      expect(result).toHaveLength(3); // Only active roles

          roleStatus: true,      expect(result.find((role) => role.name === 'admin')).toBeDefined();

        },      expect(result.find((role) => role.name === 'user')).toBeDefined();

      ];      expect(result.find((role) => role.name === 'moderator')).toBeDefined();

      expect(result.find((role) => role.name === 'guest')).toBeUndefined();

      (prismaService.role.findMany as jest.Mock).mockResolvedValue(mockDbRoles);    });

  });

      // Act

      const result = await service.findAllRoles();  describe('findOneRole', () => {

    it('should find admin role by ID', () => {

      // Assert      // Arrange

      expect(result).toHaveLength(1);      const adminRole: CreateRoleDto = { name: 'admin', status: true };

      expect(result[0].name).toBe('admin');      const createdRole = service.createRole(adminRole);

      expect(result[0].status).toBe(true);

    });      // Act

  });      const result = service.findOneRole(createdRole.id);



  describe('findOneRole', () => {      // Assert

    it('should find and return an admin role by ID', async () => {      expect(result).toBeDefined();

      // Arrange      expect(result.id).toBe(createdRole.id);

      const mockDbRole = {      expect(result.name).toBe('admin');

        roleID: 1,      expect(result.status).toBe(true);

        roleName: 'admin',    });

        roleStatus: true,

      };    it('should throw NotFoundException for non-existent role', () => {

      // Act & Assert

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(mockDbRole);      expect(() => service.findOneRole(999)).toThrow(NotFoundException);

      expect(() => service.findOneRole(999)).toThrow(

      // Act        'Role with ID 999 not found',

      const result = await service.findOneRole(1);      );

    });

      // Assert

      expect(result.id).toBe(1);    it('should throw NotFoundException for inactive role', () => {

      expect(result.name).toBe('admin');      // Arrange

      expect(result.status).toBe(true);      const inactiveRole: CreateRoleDto = {

    });        name: 'inactive-admin',

        status: false,

    it('should throw NotFoundException when role does not exist', async () => {      };

      // Arrange      const createdRole = service.createRole(inactiveRole);

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);

      // Act & Assert

      // Act & Assert      expect(() => service.findOneRole(createdRole.id)).toThrow(

      await expect(service.findOneRole(999)).rejects.toThrow(        NotFoundException,

        NotFoundException,      );

      );    });

    });  });

  });

  describe('updateRole', () => {

  describe('updateRole', () => {    it('should update admin role status', () => {

    it('should update an admin role successfully', async () => {      // Arrange

      // Arrange      const adminRole: CreateRoleDto = { name: 'admin', status: true };

      const updateDto: UpdateRoleDto = { name: 'super-admin', status: true };      const createdRole = service.createRole(adminRole);



      const mockExistingRole = {      const updateDto: UpdateRoleDto = { status: false };

        roleID: 1,

        roleName: 'admin',      // Act

        roleStatus: true,      const result = service.updateRole(createdRole.id, updateDto);

      };

      // Assert

      const mockUpdatedRole = {      expect(result.id).toBe(createdRole.id);

        roleID: 1,      expect(result.name).toBe('admin'); // Name should remain unchanged

        roleName: 'super-admin',      expect(result.status).toBe(false); // Status should be updated

        roleStatus: true,    });

      };

    it('should update admin role name', () => {

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(mockExistingRole);      // Arrange

      (prismaService.role.update as jest.Mock).mockResolvedValue(mockUpdatedRole);      const adminRole: CreateRoleDto = { name: 'admin', status: true };

      const createdRole = service.createRole(adminRole);

      // Act      const updateDto: UpdateRoleDto = { name: 'super-admin' };

      const result = await service.updateRole(1, updateDto);

      // Act

      // Assert      const result = service.updateRole(createdRole.id, updateDto);

      expect(result.id).toBe(1);

      expect(result.name).toBe('super-admin');      // Assert

      expect(result.status).toBe(true);      expect(result.id).toBe(createdRole.id);

    });      expect(result.name).toBe('super-admin'); // Name should be updated

      expect(result.status).toBe(true); // Status should remain unchanged

    it('should throw NotFoundException when updating non-existent role', async () => {    });

      // Arrange

      const updateDto: UpdateRoleDto = { name: 'updated-role' };    it('should update both name and status for admin role', () => {

      // Arrange

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);      const adminRole: CreateRoleDto = { name: 'admin', status: true };

      const createdRole = service.createRole(adminRole);

      // Act & Assert      const updateDto: UpdateRoleDto = { name: 'system-admin', status: false };

      await expect(service.updateRole(999, updateDto)).rejects.toThrow(

        NotFoundException,      // Act

      );      const result = service.updateRole(createdRole.id, updateDto);

    });

  });      // Assert

      expect(result.name).toBe('system-admin');

  describe('deleteRole', () => {      expect(result.status).toBe(false);

    it('should soft delete a role successfully', async () => {    });

      // Arrange

      const mockExistingRole = {    it('should throw NotFoundException when updating non-existent role', () => {

        roleID: 1,      // Arrange

        roleName: 'admin',      const updateDto: UpdateRoleDto = { status: false };

        roleStatus: true,

      };      // Act & Assert

      expect(() => service.updateRole(999, updateDto)).toThrow(

      const mockUpdatedRole = {        NotFoundException,

        roleID: 1,      );

        roleName: 'admin',      expect(() => service.updateRole(999, updateDto)).toThrow(

        roleStatus: false,        'Role with ID 999 not found',

      };      );

    });

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(mockExistingRole);

      (prismaService.role.update as jest.Mock).mockResolvedValue(mockUpdatedRole);    it('should throw NotFoundException when updating inactive role', () => {

      // Arrange

      // Act      const inactiveRole: CreateRoleDto = {

      const result = await service.deleteRole(1);        name: 'inactive-admin',

        status: false,

      // Assert      };

      expect(result.message).toBe('Role with ID 1 has been removed');      const createdRole = service.createRole(inactiveRole);

    });      const updateDto: UpdateRoleDto = { name: 'updated-admin' };



    it('should throw NotFoundException when deleting non-existent role', async () => {      // Act & Assert

      // Arrange      expect(() => service.updateRole(createdRole.id, updateDto)).toThrow(

      (prismaService.role.findFirst as jest.Mock).mockResolvedValue(null);        NotFoundException,

      );

      // Act & Assert    });

      await expect(service.deleteRole(999)).rejects.toThrow(

        NotFoundException,    it('should throw ConflictException when updating to duplicate name', () => {

      );      // Arrange

    });      const adminRole: CreateRoleDto = { name: 'admin', status: true };

  });      const userRole: CreateRoleDto = { name: 'user', status: true };

});      service.createRole(adminRole);
      const createdUserRole = service.createRole(userRole);

      const updateDto: UpdateRoleDto = { name: 'admin' };

      // Act & Assert
      expect(() => service.updateRole(createdUserRole.id, updateDto)).toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteRole', () => {
    it('should soft delete admin role (set status to false)', () => {
      // Arrange
      const adminRole: CreateRoleDto = { name: 'admin', status: true };
      const createdRole = service.createRole(adminRole);

      // Act
      const result = service.deleteRole(createdRole.id);

      // Assert
      expect(result).toEqual({
        message: `Role with ID ${createdRole.id} has been removed`,
      });

      // Verify the role is soft deleted (status = false)
      expect(() => service.findOneRole(createdRole.id)).toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when deleting non-existent role', () => {
      // Act & Assert
      expect(() => service.deleteRole(999)).toThrow(NotFoundException);
      expect(() => service.deleteRole(999)).toThrow(
        'Role with ID 999 not found',
      );
    });

    it('should throw NotFoundException when deleting already inactive role', () => {
      // Arrange
      const inactiveRole: CreateRoleDto = {
        name: 'inactive-admin',
        status: false,
      };
      const createdRole = service.createRole(inactiveRole);

      // Act & Assert
      expect(() => service.deleteRole(createdRole.id)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete admin role lifecycle', () => {
      // Create admin role
      const createAdminDto: CreateRoleDto = { name: 'admin', status: true };
      const createdRole = service.createRole(createAdminDto);
      expect(createdRole.name).toBe('admin');

      // Find the created admin role
      const foundRole = service.findOneRole(createdRole.id);
      expect(foundRole.name).toBe('admin');

      // Update admin role status
      const updateDto: UpdateRoleDto = { status: false };
      const updatedRole = service.updateRole(createdRole.id, updateDto);
      expect(updatedRole.status).toBe(false);

      // Try to find inactive admin role (should fail)
      expect(() => service.findOneRole(createdRole.id)).toThrow(
        NotFoundException,
      );
    });

    it('should handle multiple roles with admin having priority operations', () => {
      // Create multiple roles including admin
      const adminRole = service.createRole({ name: 'admin', status: true });
      const userRole = service.createRole({ name: 'user', status: true });
      const guestRole = service.createRole({ name: 'guest', status: true });

      // Verify all are created
      expect(service.findAllRoles()).toHaveLength(3);

      // Update admin role specifically
      const updatedAdmin = service.updateRole(adminRole.id, {
        name: 'system-admin',
      });
      expect(updatedAdmin.name).toBe('system-admin');

      // Verify other roles remain unchanged
      expect(service.findOneRole(userRole.id).name).toBe('user');
      expect(service.findOneRole(guestRole.id).name).toBe('guest');

      // Remove admin role
      service.deleteRole(adminRole.id);
      expect(service.findAllRoles()).toHaveLength(2); // Only user and guest remain active
    });

    it('should maintain data integrity during concurrent operations', () => {
      // Create initial admin role
      const adminRole = service.createRole({ name: 'admin', status: true });

      // Simulate concurrent reads
      const read1 = service.findOneRole(adminRole.id);
      const read2 = service.findOneRole(adminRole.id);
      const allRoles = service.findAllRoles();

      // Verify consistency
      expect(read1).toEqual(read2);
      expect(allRoles).toContain(read1);

      // Update during reads
      service.updateRole(adminRole.id, {
        name: 'updated-admin',
      });

      // Verify update is reflected
      const readAfterUpdate = service.findOneRole(adminRole.id);
      expect(readAfterUpdate.name).toBe('updated-admin');
      expect(readAfterUpdate.id).toBe(adminRole.id);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty role name gracefully', () => {
      // Arrange
      const emptyNameRole: CreateRoleDto = { name: '', status: true };

      // Act
      const result = service.createRole(emptyNameRole);

      // Assert
      expect(result.name).toBe('');
      expect(result.status).toBe(true);
    });

    it('should handle undefined status properly', () => {
      // Arrange
      const roleWithoutStatus: CreateRoleDto = { name: 'admin' };

      // Act
      const result = service.createRole(roleWithoutStatus);

      // Assert
      expect(result.status).toBe(true); // Should default to true
    });

    it('should handle negative ID lookups', () => {
      // Act & Assert
      expect(() => service.findOneRole(-1)).toThrow(NotFoundException);
      expect(() => service.updateRole(-1, { name: 'test' })).toThrow(
        NotFoundException,
      );
      expect(() => service.deleteRole(-1)).toThrow(NotFoundException);
    });

    it('should handle zero ID lookups', () => {
      // Act & Assert
      expect(() => service.findOneRole(0)).toThrow(NotFoundException);
      expect(() => service.updateRole(0, { name: 'test' })).toThrow(
        NotFoundException,
      );
      expect(() => service.deleteRole(0)).toThrow(NotFoundException);
    });
  });

  describe('business logic validation', () => {
    it('should allow multiple roles with different names', () => {
      // Arrange & Act
      const admin = service.createRole({ name: 'admin', status: true });
      const user = service.createRole({ name: 'user', status: true });
      const moderator = service.createRole({ name: 'moderator', status: true });

      // Assert
      expect(admin.name).toBe('admin');
      expect(user.name).toBe('user');
      expect(moderator.name).toBe('moderator');
      expect(service.findAllRoles()).toHaveLength(3);
    });

    it('should prevent duplicate role names with ConflictException', () => {
      // Arrange & Act
      const admin1 = service.createRole({ name: 'admin', status: true });

      // Assert
      expect(admin1.name).toBe('admin');
      expect(() => service.createRole({ name: 'admin', status: true })).toThrow(
        ConflictException,
      );
    });

    it('should handle partial updates correctly', () => {
      // Arrange
      const adminRole = service.createRole({ name: 'admin', status: true });

      // Act - Update only name first (while still active)
      const nameUpdate = service.updateRole(adminRole.id, {
        name: 'super-admin',
      });

      // Act - Update only status
      const statusUpdate = service.updateRole(adminRole.id, { status: false });

      // Assert
      expect(nameUpdate.name).toBe('super-admin');
      expect(nameUpdate.status).toBe(true);
      expect(statusUpdate.name).toBe('super-admin'); // Name should remain from previous update
      expect(statusUpdate.status).toBe(false);
    });
  });
});
