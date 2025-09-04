import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { GetUser } from "src/common/decorators/getUser.decorator";
import { JwtGuard, RtGuard } from "../guards";
import { GetRefreshToken } from "src/common/decorators/getRt.decorator";
import { BeneficiaryAuthService } from "../Services/beneficiaryAuth.service";
import { ConfigService } from "@nestjs/config";
import { BeneficiaryLoginDto, BeneficiarySignupDto } from "../dto";
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from "@nestjs/swagger";

@ApiTags('Beneficiary Authentication')
@Controller('beneficiaryAuth')
export class BeneficiaryAuthController {
    constructor(
        private authService: BeneficiaryAuthService,
        private configService: ConfigService,
    ) { }

    @Post('Signup')
    @ApiOperation({ summary: 'Register a new beneficiary' })
    @ApiBody({ type: BeneficiarySignupDto })
    @ApiResponse({ status: 201, description: 'Beneficiary registered successfully with tokens.' })
    @ApiResponse({ status: 400, description: 'Validation error.' })
    async signup(@Body() dto: BeneficiarySignupDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.signup(dto);
        this.setRefreshCookie(res, tokens.refreshToken);
        return tokens;
    }

    @Post('Login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login a beneficiary' })
    @ApiBody({ type: BeneficiaryLoginDto })
    @ApiResponse({ status: 200, description: 'Login successful. Returns access and refresh tokens.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async employeeLogin(@Body() dto: BeneficiaryLoginDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.login(dto);
        this.setRefreshCookie(res, tokens.refreshToken);
        return tokens;
    }

    @ApiSecurity('cookieAuth')
    @UseGuards(RtGuard)
    @Post('Refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token using refresh token (from cookie)' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
    async refreshTokens(
        @GetUser('id') benId: string,
        @GetRefreshToken() rt: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.refreshTokens(benId, rt);
        this.setRefreshCookie(res, tokens.refreshToken);
        return tokens;
    }
    @ApiSecurity('bearer')
    @UseGuards(JwtGuard)
    @Post('Logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout beneficiary and clear refresh token cookie' })
    @ApiResponse({ status: 200, description: 'Logged out successfully.' })
    async logout(@GetUser('id') empId: string, @Res({ passthrough: true }) res: Response) {
        await this.authService.logout(empId);
        res.clearCookie('refresh_token', {
            path: '/beneficiaryAuth/Refresh',
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
            secure: false, //this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            path: '/', // important for cookie availability
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    }
}
