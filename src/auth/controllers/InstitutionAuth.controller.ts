import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { RtGuard } from '../guards/rt.guard';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { GetRefreshToken } from '../../common/decorators/getRt.decorator';
import { ConfigService } from '@nestjs/config';
import { EmployeeLoginDto, InstitutionSignupDto } from '../dto';
import { InstitutionAuthService } from '../Services/institutionAuth.service';
import {
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Institution Authentication')
@Controller('auth/institution')
export class InstitutionAuthController {
  constructor(
    private authService: InstitutionAuthService,
    private configService: ConfigService,
  ) {}

  @Throttle({ auth: { ttl: 900_000, limit: 5 } })
  @Post('signup')
  @ApiOperation({ summary: 'Register a new institution' })
  @ApiResponse({
    status: 201,
    description: 'Institution successfully registered',
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async signup(
    @Body() dto: InstitutionSignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signup(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    this.setCsrfCookie(res);
    return { accessToken: tokens.accessToken };
  }

  @Throttle({ auth: { ttl: 900_000, limit: 5 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login institution employee' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, access token returned',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: EmployeeLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    this.setCsrfCookie(res);
    return { accessToken: tokens.accessToken };
  }

  @ApiSecurity('cookieAuth')
  @ApiHeader({
    name: 'x-csrf-token',
    description: 'CSRF token (read from the csrf_token cookie after login)',
    required: true,
  })
  @UseGuards(CsrfGuard, RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token using refresh token cookie',
  })
  @ApiResponse({ status: 200, description: 'New access token issued' })
  @ApiResponse({ status: 401, description: 'Unauthorized or invalid refresh token' })
  @ApiResponse({ status: 403, description: 'Invalid CSRF token' })
  async refreshTokens(
    @GetUser('id') empId: string,
    @GetRefreshToken() rt: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(empId, rt);
    this.setRefreshCookie(res, tokens.refreshToken);
    this.setCsrfCookie(res);
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout institution employee and clear cookies',
  })
  @ApiSecurity('bearer')
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized, invalid or missing JWT' })
  async logout(
    @GetUser('id') empId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(empId);
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    res.clearCookie('refresh_token', {
      path: '/auth/institution/refresh',
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
    });
    res.clearCookie('csrf_token', {
      path: '/',
      httpOnly: false,
      sameSite: 'strict',
      secure: isProduction,
    });
    return { message: 'You logged out successfully' };
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/auth/institution/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private setCsrfCookie(res: Response) {
    res.cookie('csrf_token', randomBytes(32).toString('hex'), {
      httpOnly: false, // must be readable by JS so the client can send it as a header
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
