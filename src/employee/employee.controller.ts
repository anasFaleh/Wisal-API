// employees.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { ChangePasswordDto, CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { GetUser } from 'src/common/decorators/getUser.decorator';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeesService: EmployeeService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(@GetUser('institutionId') institutionId: string) {
    return this.employeesService.findAll(institutionId);
  }

  @Get('stats')
  getStats(@GetUser('institutionId') institutionId: string) {
    return this.employeesService.getEmployeeStats(institutionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.employeesService.findByEmail(email);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Put(':id/change-password')
  changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return this.employeesService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}