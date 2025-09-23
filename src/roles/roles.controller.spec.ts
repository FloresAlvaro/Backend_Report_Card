import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [RolesService],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Example: Creating an admin role
  it('should create an admin role with proper data structure', async () => {
    // Arrange: Prepare the admin role data
    const createAdminDto: CreateRoleDto = {
      name: 'admin',
      status: true, // Admin role should be active by default
    };

    // Act: Create the admin role using the controller
    const result = await controller.createRole(createAdminDto);

    // Assert: Verify the admin role was created with expected properties
    expect(result).toBeDefined();
    expect(result.name).toBe('admin');
    expect(result.status).toBe(true);
    expect(result.id).toBeDefined(); // Should have auto-generated ID
  });

  // Test: Retrieve all active roles including admin
  it('should return all active roles including admin role', async () => {
    // Arrange: Create multiple roles including admin for testing
    const adminDto: CreateRoleDto = { name: 'admin', status: true };
    const userDto: CreateRoleDto = { name: 'user', status: true };
    const inactiveDto: CreateRoleDto = { name: 'inactive-role', status: false };

    await controller.createRole(adminDto);
    await controller.createRole(userDto);
    await controller.createRole(inactiveDto);

    // Act: Retrieve all active roles
    const result = await controller.findAllRoles();

    // Assert: Should return only active roles (admin and user, not inactive)
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2); // Only active roles
    expect(result.some((role) => role.name === 'admin')).toBe(true);
    expect(result.some((role) => role.name === 'user')).toBe(true);
    expect(result.every((role) => role.status === true)).toBe(true); // All returned roles should be active
  });

  // Test: Find specific admin role by ID
  it('should find admin role by ID with complete data structure', async () => {
    // Arrange: Create an admin role to find
    const createAdminDto: CreateRoleDto = {
      name: 'admin',
      status: true,
    };
    const createdAdmin = await controller.createRole(createAdminDto);

    // Act: Find the admin role by its ID
    const result = await controller.findOneRole(createdAdmin.id);

    // Assert: Verify the found admin role matches the created one
    expect(result).toBeDefined();
    expect(result.id).toBe(createdAdmin.id);
    expect(result.name).toBe('admin');
    expect(result.status).toBe(true);
  });

  // Test: Update admin role properties
  it('should update admin role properties and maintain data integrity', async () => {
    // Arrange: Create an admin role to update
    const createAdminDto: CreateRoleDto = {
      name: 'admin',
      status: true,
    };
    const createdAdmin = await controller.createRole(createAdminDto);

    const updateDto = { name: 'super-admin', status: true };

    // Act: Update the admin role
    const result = await controller.updateRole(createdAdmin.id, updateDto);

    // Assert: Verify the admin role was updated correctly
    expect(result).toBeDefined();
    expect(result.id).toBe(createdAdmin.id); // ID should remain the same
    expect(result.name).toBe('super-admin'); // Name should be updated
    expect(result.status).toBe(true); // Status should be updated
  });
});
