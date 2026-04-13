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
import { GetUser } from '../../common/decorators/getUser.decorator';
import { JwtGuard, RtGuard } from '../guards';
import { CsrfGuard } from '../../common/guards/csrf.guard';
import { GetRefreshToken } from '../../common/decorators/getRt.decorator';
import { BeneficiaryAuthService } from '../Services/beneficiaryAuth.service';
import { ConfigService } from '@nestjs/config';
import { BeneficiaryLoginDto, BeneficiarySignupDto } from '../dto';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Beneficiary Authentication')
@Controller('auth/beneficiary')
export class BeneficiaryAuthController {
  constructor(
    private authService: BeneficiaryAuthService,
    private configService: ConfigService,
  ) {}

  @Throttle({ auth: { ttl: 900_000, limit: 5 } })
  @Post('signup')
  @ApiOperation({ summary: 'Register a new beneficiary' })
  @ApiBody({ type: BeneficiarySignupDto })
  @ApiResponse({
    status: 201,
    description: 'Beneficiary registered successfully with tokens.',
  })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async signup(
    @Body() dto: BeneficiarySignupDto,
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
  @ApiOperation({ summary: 'Login a beneficiary' })
  @ApiBody({ type: BeneficiaryLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns access token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(
    @Body() dto: BeneficiaryLoginDto,
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
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  @ApiResponse({ status: 403, description: 'Invalid CSRF token.' })
  async refreshTokens(
    @GetUser('id') benId: string,
    @GetRefreshToken() rt: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(benId, rt);
    this.setRefreshCookie(res, tokens.refreshToken);
    this.setCsrfCookie(res);
    return { accessToken: tokens.accessToken };
  }

  @ApiSecurity('bearer')
  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout beneficiary and clear refresh token cookie',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully.' })
  async logout(
    @GetUser('id') benId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(benId);
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    res.clearCookie('refresh_token', {
      path: '/auth/beneficiary/refresh',
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
      path: '/auth/beneficiary/refresh',
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
