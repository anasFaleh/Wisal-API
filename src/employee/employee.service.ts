import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  AssignRolesDto,
  ChangePasswordDto,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './dto';
import { Emp } from '../common/enums';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  //Check if Institution Exists
  async create(createEmployeeDto: CreateEmployeeDto) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: createEmployeeDto.institutionId },
    });

    if (!institution) throw new NotFoundException('Institution Not Found');

    // Check if Existing Email
    const existingEmployee = await this.prisma.employee.findUnique({
      where: { email: createEmployeeDto.email },
    });
    if (existingEmployee)
      throw new ConflictException('This Email Is Already Exists');

    // Hashing passwrod
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

    return this.prisma.employee.create({
      data: {
        ...createEmployeeDto,
        password: hashedPassword,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(institutionId: string) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: institutionId },
    });

    if (!institution) throw new NotFoundException('Institution Not Found');

    return this.prisma.employee.findMany({
      where: { institutionId },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!employee) throw new NotFoundException('Employee Not Found');
    return employee;
  }

  async findByEmail(email: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
      include: {
        institution: true,
      },
    });

    if (!employee) throw new NotFoundException('Employee Not Found');

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) throw new NotFoundException('Employee Not Found');

    // Check Email
    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmployee = await this.prisma.employee.findUnique({
        where: { email: updateEmployeeDto.email },
      });

      if (existingEmployee)
        throw new ConflictException('This Email Is Already Exists');
    }

    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) throw new NotFoundException('Employee Not Found');

    return this.prisma.employee.delete({
      where: { id },
    });
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) throw new NotFoundException('Employee Not Found');

    const isOldPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      employee.password,
    );
    if (!isOldPasswordValid)
      throw new BadRequestException('Invalid Old Password');

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10,
    );

    return this.prisma.employee.update({
      where: { id },
      data: { password: hashedNewPassword },
    });
  }

  async getEmployeeStats(institutionId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { institutionId },
      select: {
        status: true,
        role: true,
      },
    });
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'ACTIVE').length;
    const admins = employees.filter((e) => e.role === 'ADMIN').length;
    const distributers = employees.filter(
      (e) => e.role === 'DISTRIBUTER',
    ).length;
    const publishers = employees.filter((e) => e.role === 'PUBLISHER').length;

    return {
      total,
      active,
      inactive: total - active,
      admins,
      distributers,
      publishers,
    };
  }

  async assignRole(empId: string, dto: AssignRolesDto) {
    const emp = await this.prisma.employee.findUnique({
      where: { id: empId },
    });
    if (!emp) throw new NotFoundException('Employee Not Found');
    if (emp.role === Emp.ADMIN)
      throw new ConflictException('Can Not Assign Role To Admin');

    return this.prisma.employee.update({
      where: { id: empId },
      data: { role: dto.role },
    });
  }

  async activeEmp(empId: string, adminId: string) {
    const emp = await this.prisma.employee.findUnique({ where: { id: empId } });
    if (!emp) throw new NotFoundException('Employee Not Found');

    if (emp.role == Emp.ADMIN)
      throw new ConflictException('Cant Chanage Admin Status');

    const admin = await this.prisma.employee.findUnique({
      where: { id: adminId },
    });

    if (emp.institutionId !== admin?.institutionId) {
      throw new ConflictException(
        'This Employee Is Not From The Same Institution',
      );
    }

    return this.prisma.employee.update({
      where: { id: emp.id },
      data: { isActive: true },
    });
  }

  async disActiveEmp(empId: string, adminId: string) {
    const emp = await this.prisma.employee.findUnique({ where: { id: empId } });
    if (!emp) throw new NotFoundException('Employee Not Found');

    if (emp.role == Emp.ADMIN)
      throw new ConflictException('Cant Chanage Admin Status');

    const admin = await this.prisma.employee.findUnique({
      where: { id: adminId },
    });

    if (emp.institutionId !== admin?.institutionId) {
      throw new ConflictException(
        'This Employee Is Not From The Same Institution',
      );
    }

    return this.prisma.employee.update({
      where: { id: emp.id },
      data: { isActive: false },
    });
  }
}
