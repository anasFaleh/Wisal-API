import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import {
  AssignRolesDto,
  ChangePasswordDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtGuard } from '../auth/guards';
import { Roles } from '../common/decorators/roles.decorator';
import { Emp } from '../common/enums';

@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtGuard, RolesGuard)
@ApiSecurity('bearer')
export class EmployeeController {
  constructor(private readonly employeesService: EmployeeService) {}

  @Post()
  @Roles(Emp.ADMIN)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles(Emp.ADMIN)
  @ApiOperation({ summary: 'Get all employees for an institution' })
  @ApiResponse({ status: 200, description: 'List of employees returned' })
  findAll(@GetUser('institutionId') institutionId: string) {
    return this.employeesService.findAll(institutionId);
  }

  @Get('stats')
  @Roles(Emp.ADMIN)
  @ApiOperation({ summary: 'Get statistics about employees in an institution' })
  @ApiResponse({ status: 200, description: 'Statistics returned successfully' })
  getStats(@GetUser('institutionId') institutionId: string) {
    return this.employeesService.getEmployeeStats(institutionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiResponse({ status: 200, description: 'Employee returned successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiParam({ name: 'id', description: 'Employee ID (UUID)' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.employeesService.findOne(id);
  }

  @Roles(Emp.ADMIN)
  @Get('email/:email')
  @ApiOperation({ summary: 'Get employee by email (مش عارف اذا رح تحتاجها)' })
  @ApiResponse({ status: 200, description: 'Employee returned successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  findByEmail(@Param('email') email: string) {
    return this.employeesService.findByEmail(email);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiParam({ name: 'id', description: 'Employee ID (UUID)' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Put(':id/change-password')
  @ApiOperation({ summary: 'Change employee password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid old password or validation failed',
  })
  @ApiParam({ name: 'id', description: 'Employee ID (UUID)' })
  changePassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.employeesService.changePassword(id, changePasswordDto);
  }

  @Roles(Emp.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee' })
  @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiParam({ name: 'id', description: 'Employee ID (UUID)' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.employeesService.remove(id);
  }

  @Roles(Emp.ADMIN)
  @ApiOperation({ summary: 'Assign Role For Employee' })
  @ApiParam({ name: 'id', description: 'Employee ID (UUID)' })
  @Patch(':id')
  async assignRoles(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AssignRolesDto,
  ) {
    return await this.employeesService.assignRole(id, dto);
  }

  @Patch(':id/active')
  @ApiOperation({ summary: 'Active Employee' })
  @ApiParam({ name: 'id', description: 'Employee ID (UUID)' })
  active(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('id') adminId: string,
  ) {
    return this.employeesService.activeEmp(id, adminId);
  }

  @Patch(':id/disActive')
  @ApiOperation({ summary: 'DisActive Employee' })
  @ApiParam({ name: 'id', description: 'Employee ID (UUID)' })
  disActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('id') adminId: string,
  ) {
    return this.employeesService.disActiveEmp(id, adminId);
  }
}
