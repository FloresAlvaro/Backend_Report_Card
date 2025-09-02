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
  it('should create an admin role with proper data structure', () => {
    // Arrange: Prepare the admin role data
    const createAdminDto: CreateRoleDto = {
      name: 'admin',
      status: true, // Admin role should be active by default
    };

    // Act: Create the admin role using the controller
    const result = controller.create(createAdminDto);

    // Assert: Verify the admin role was created with expected properties
    expect(result).toBeDefined();
    expect(result.name).toBe('admin');
    expect(result.status).toBe(true);
    expect(result.id).toBeDefined(); // Should have auto-generated ID
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });
});
