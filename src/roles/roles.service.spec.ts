import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRole', () => {
    it('should create an admin role successfully', () => {
      // Arrange
      const createAdminDto: CreateRoleDto = {
        name: 'admin',
        status: true,
      };

      // Act
      const result = service.createRole(createAdminDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(1); // First role should have ID 1
      expect(result.name).toBe('admin');
      expect(result.status).toBe(true);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create role with default status when not provided', () => {
      // Arrange
      const createRoleDto: CreateRoleDto = {
        name: 'user',
      };

      // Act
      const result = service.createRole(createRoleDto);

      // Assert
      expect(result.status).toBe(true); // Should default to true
    });

    it('should auto-increment IDs for multiple roles', () => {
      // Arrange
      const adminRole: CreateRoleDto = { name: 'admin', status: true };
      const userRole: CreateRoleDto = { name: 'user', status: true };
      const moderatorRole: CreateRoleDto = { name: 'moderator', status: true };

      // Act
      const role1 = service.createRole(adminRole);
      const role2 = service.createRole(userRole);
      const role3 = service.createRole(moderatorRole);

      // Assert
      expect(role1.id).toBe(1);
      expect(role2.id).toBe(2);
      expect(role3.id).toBe(3);
    });
  });

  describe('findAllRoles', () => {
    it('should return empty array when no roles exist', () => {
      // Act
      const result = service.findAllRoles();

      // Assert
      expect(result).toEqual([]);
    });

    it('should return only active roles', () => {
      // Arrange
      const activeAdminRole: CreateRoleDto = { name: 'admin', status: true };
      const inactiveUserRole: CreateRoleDto = { name: 'user', status: false };

      service.createRole(activeAdminRole);
      service.createRole(inactiveUserRole);

      // Act
      const result = service.findAllRoles();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('admin');
      expect(result[0].status).toBe(true);
    });

    it('should return multiple active roles including admin', () => {
      // Arrange
      const roles = [
        { name: 'admin', status: true },
        { name: 'user', status: true },
        { name: 'guest', status: false }, // This should not appear in results
        { name: 'moderator', status: true },
      ];

      roles.forEach((role) => service.createRole(role));

      // Act
      const result = service.findAllRoles();

      // Assert
      expect(result).toHaveLength(3); // Only active roles
      expect(result.find((role) => role.name === 'admin')).toBeDefined();
      expect(result.find((role) => role.name === 'user')).toBeDefined();
      expect(result.find((role) => role.name === 'moderator')).toBeDefined();
      expect(result.find((role) => role.name === 'guest')).toBeUndefined();
    });
  });

  describe('findOneRole', () => {
    it('should find admin role by ID', () => {
      // Arrange
      const adminRole: CreateRoleDto = { name: 'admin', status: true };
      const createdRole = service.createRole(adminRole);

      // Act
      const result = service.findOneRole(createdRole.id);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(createdRole.id);
      expect(result.name).toBe('admin');
      expect(result.status).toBe(true);
    });

    it('should throw NotFoundException for non-existent role', () => {
      // Act & Assert
      expect(() => service.findOneRole(999)).toThrow(NotFoundException);
      expect(() => service.findOneRole(999)).toThrow(
        'Role with ID 999 not found',
      );
    });

    it('should throw NotFoundException for inactive role', () => {
      // Arrange
      const inactiveRole: CreateRoleDto = {
        name: 'inactive-admin',
        status: false,
      };
      const createdRole = service.createRole(inactiveRole);

      // Act & Assert
      expect(() => service.findOneRole(createdRole.id)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateRole', () => {
    it('should update admin role status', () => {
      // Arrange
      jest.useFakeTimers();
      const now = new Date();
      jest.setSystemTime(now);

      const adminRole: CreateRoleDto = { name: 'admin', status: true };
      const createdRole = service.createRole(adminRole);

      // Wait a moment before updating
      jest.advanceTimersByTime(100);
      const updateDto: UpdateRoleDto = { status: false };

      // Act
      const result = service.updateRole(createdRole.id, updateDto);

      // Assert
      expect(result.id).toBe(createdRole.id);
      expect(result.name).toBe('admin'); // Name should remain unchanged
      expect(result.status).toBe(false); // Status should be updated
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        result.createdAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should update admin role name', () => {
      // Arrange
      const adminRole: CreateRoleDto = { name: 'admin', status: true };
      const createdRole = service.createRole(adminRole);
      const updateDto: UpdateRoleDto = { name: 'super-admin' };

      // Act
      const result = service.updateRole(createdRole.id, updateDto);

      // Assert
      expect(result.id).toBe(createdRole.id);
      expect(result.name).toBe('super-admin'); // Name should be updated
      expect(result.status).toBe(true); // Status should remain unchanged
    });

    it('should update both name and status for admin role', () => {
      // Arrange
      const adminRole: CreateRoleDto = { name: 'admin', status: true };
      const createdRole = service.createRole(adminRole);
      const updateDto: UpdateRoleDto = { name: 'system-admin', status: false };

      // Act
      const result = service.updateRole(createdRole.id, updateDto);

      // Assert
      expect(result.name).toBe('system-admin');
      expect(result.status).toBe(false);
    });

    it('should throw NotFoundException when updating non-existent role', () => {
      // Arrange
      const updateDto: UpdateRoleDto = { status: false };

      // Act & Assert
      expect(() => service.updateRole(999, updateDto)).toThrow(
        NotFoundException,
      );
      expect(() => service.updateRole(999, updateDto)).toThrow(
        'Role with ID 999 not found',
      );
    });

    it('should throw NotFoundException when updating inactive role', () => {
      // Arrange
      const inactiveRole: CreateRoleDto = {
        name: 'inactive-admin',
        status: false,
      };
      const createdRole = service.createRole(inactiveRole);
      const updateDto: UpdateRoleDto = { name: 'updated-admin' };

      // Act & Assert
      expect(() => service.updateRole(createdRole.id, updateDto)).toThrow(
        NotFoundException,
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

    it('should update updatedAt timestamp when soft deleting', () => {
      // Arrange
      const adminRole: CreateRoleDto = { name: 'admin', status: true };
      const createdRole = service.createRole(adminRole);
      const originalUpdatedAt = createdRole.updatedAt;

      // Wait a small amount to ensure timestamp difference
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      // Act
      service.deleteRole(createdRole.id);

      // Assert - Check that the role in internal storage has updated timestamp
      // Verify that the role was actually soft deleted (status changed to false)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const roles = (service as any).roles as Role[]; // Access private property for testing
      const deletedRole = roles.find(
        (role: Role) => role.id === createdRole.id,
      );
      expect(deletedRole?.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );

      jest.useRealTimers();
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

    it('should preserve original timestamps when updating', () => {
      // Arrange
      const adminRole = service.createRole({ name: 'admin', status: true });
      const originalCreatedAt = adminRole.createdAt;

      // Act
      const updatedRole = service.updateRole(adminRole.id, {
        name: 'super-admin',
      });

      // Assert
      expect(updatedRole.createdAt).toEqual(originalCreatedAt); // Should not change
      expect(updatedRole.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalCreatedAt.getTime(),
      );
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

    it('should allow duplicate role names (no unique constraint)', () => {
      // Arrange & Act
      const admin1 = service.createRole({ name: 'admin', status: true });
      const admin2 = service.createRole({ name: 'admin', status: true });

      // Assert
      expect(admin1.id).not.toBe(admin2.id);
      expect(admin1.name).toBe('admin');
      expect(admin2.name).toBe('admin');
      expect(service.findAllRoles()).toHaveLength(2);
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
      expect(nameUpdate.status).toBe(true); // Status should remain unchanged
      expect(statusUpdate.name).toBe('super-admin'); // Name should remain from previous update
      expect(statusUpdate.status).toBe(false);
    });
  });
});
