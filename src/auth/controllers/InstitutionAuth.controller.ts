import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { RtGuard } from '../guards/rt.guard';
import { GetUser } from 'src/common/decorators/getUser.decorator';
import { GetRefreshToken } from 'src/common/decorators/getRt.decorator';
import { ConfigService } from '@nestjs/config';
import { EmployeeLoginDto, InstitutionSignupDto } from '../dto';
import { InstitutionAuthService } from '../Services/institutionAuth.service';

@Controller('InstitutionAuth')
export class InstitutionAuthController {
  constructor(
    private authService: InstitutionAuthService,
    private configService: ConfigService,
  ) {}


  
  @Post('Signup')
  async signup(@Body() dto: InstitutionSignupDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signup(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return tokens;
  }



  @Post('Login')
  @HttpCode(HttpStatus.OK)
  async employeeLogin(@Body() dto: EmployeeLoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refreshToken);
    return tokens;
  }



  @UseGuards(RtGuard)
  @Post('Refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetUser('id') empId: string,
    @GetRefreshToken() rt: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(empId, rt);
    this.setRefreshCookie(res, tokens.refreshToken);
    return tokens;
  }



  @UseGuards(JwtGuard)
  @Post('Logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser('id') empId: string, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(empId);
    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
      httpOnly: true,
      sameSite: 'strict',
      secure: false // this.configService.get<string>('NODE_ENV') === 'production',
    });
    return { message: 'You logged out successfully' };  
  }



  // Helper method to set refresh token cookie
  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
