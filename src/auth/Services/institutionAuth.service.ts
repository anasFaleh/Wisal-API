import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { EmployeeLoginDto, InstitutionSignupDto } from '../dto';
import { PayloadInterface } from '../interfaces/payload.interface';

@Injectable()
export class InstitutionAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,

  ) { }


  /**
   * 1.institution exists
   * 2.employee exists
   * 3.employee password hash
   * 4.create institution with admin employee
   * 5.generate tokens
   * 6.update RT
   * @param dto 
   * @returns tokens
   */
  async signup(dto: InstitutionSignupDto) {
    const exists = await this.prisma.institution.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Istitution Already Exists');

    const empExists = await this.prisma.employee.findUnique({ where: { email: dto.adminEmail } });
    if (empExists) throw new ConflictException('This User Is Already an Employee');

    const hashedPass = await hash(dto.adminPassword, 10)

    const institution = await this.prisma.institution.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        employees: {
          create: {
            fullName: dto.adminFullName,
            email: dto.adminEmail,
            password: hashedPass,
            role: 'ADMIN',
            isActive: true
          }
        }
      },
      include: {
        employees: {
          where: { role: 'ADMIN' },
          select: { id: true }
        }
      }
    });
    const tokens = await this.getTokens({ sub: institution.employees[0].id, role: 'ADMIN' ,institutionId: institution.id});
    await this.updateEmpRT(institution.employees[0].id, tokens.refreshToken);
    return tokens;
  }



  /**
   * 1.employee exists
   * 2.password matchs
   * 3. generate tokens
   * 4.update RT
   * @param dto 
   * @returns tokens
   */
  async login(dto: EmployeeLoginDto) {
    const emp = await this.prisma.employee.findUnique({ where: { email: dto.email } });
    if (!emp) throw new NotFoundException('Employee Not Found');

    const isMatch = await compare(dto.password, emp.password);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({ sub: emp.id, role: emp.role, institutionId: emp.institutionId });
    await this.updateEmpRT(emp.id, tokens.refreshToken);
    return tokens;
  }




  /**
   * set RT to null
   * @param empId 
   * @returns message
   */
  async logout(empId: string) {
    await this.prisma.employee.update({
      where: { id: empId },
      data: { RT: null },
    });

  }



  /**
   * 1.employee exists
   * 2.RT matchs
   * 3.generate tokens
   * 4.update RT
   * @param empId 
   * @param refreshToken 
   * @returns tokens
   */
  async refreshTokens(empId: string, refreshToken: string) {
    const emp = await this.prisma.employee.findUnique({ where: { id: empId } });
    if (!emp || !refreshToken || !emp.RT) {
      throw new ForbiddenException('Access Denied');
    }

    const isMatch = await compare(refreshToken, emp.RT);
    if (!isMatch) throw new ForbiddenException('Invalid Refresh Token');


    const tokens = await this.getTokens({ sub: empId, role: emp.role, institutionId:emp.institutionId });

    await this.updateEmpRT(empId, tokens.refreshToken);

    return tokens;
  }



  // // =====================
  // //   Helper Functions
  // // =====================


  /**
   * generate Access and Refresh Tokens
   * @param payload: PayloadInterface
   * @returns tokens
   */
  private async getTokens(payload: PayloadInterface) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }



  /**
   * Update & Hash refresh token for employee
   * @param empId 
   * @param refreshToken 
   */
  private async updateEmpRT(empId: string, refreshToken: string) {
    const hashedRt = await hash(refreshToken, 10);
    await this.prisma.employee.update({
      where: { id: empId },
      data: { RT: hashedRt },
    });
  }












}
