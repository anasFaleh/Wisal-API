import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BeneficiaryLoginDto, BeneficiarySignupDto } from "../dto";
import { compare, hash } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PayloadInterface } from "../interfaces";

@Injectable()
export class BeneficiaryAuthService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) { }


    /**
     * 1.beneficiary exists?
     * 2.hashing beneficiary passwrod
     * 3.creating beneficiary
     * 4.generate tokens
     * 5.update RT
     * @param dto 
     * @returns tokens
     */
    async signup(dto: BeneficiarySignupDto) {
        const ben = await this.prisma.beneficiary.findUnique({ where: { nationalId: dto.nationalId } });
        if (ben) throw new ConflictException('Beneficiary Already Exists');

        const hashed = await hash(dto.password, 10);

        const newBen = await this.prisma.beneficiary.create({
            data: {
                nationalId: dto.nationalId,
                password: hashed,
                phone: dto.phone,
                fullName: dto.fullName
            }
        });

        const tokens = await this.getTokens({ sub: newBen.id });
        await this.updateBenRT(newBen.id, tokens.refreshToken);
        return tokens;

    }



    /**
     * 1.beneficiary exists
     * 2.password matchs
     * 3.generate tokens
     * 4.update RT
     * @param dto 
     * @returns tokens
     */
    async login(dto: BeneficiaryLoginDto) {
        const ben = await this.prisma.beneficiary.findUnique({ where: { nationalId: dto.nationalId } });
        if (!ben || !ben.password) throw new NotFoundException('Beneficiary Not Found');

        const isMatch = await compare(dto.password, ben.password);
        if (!isMatch) throw new ForbiddenException('Access Denied Invalid Password');

        const tokens = await this.getTokens({ sub: ben.id });
        await this.updateBenRT(ben.id, tokens.refreshToken);
        return tokens;
    }



    /**
       * set RT to null
       * @param benId 
       * @returns message
       */
    async logout(benId: string) {
        await this.prisma.beneficiary.update({
            where: { id: benId },
            data: { RT: null },
        });

    }



    /**
     * 1.beneficiary exists
     * 2.RT matchs
     * 3.generate tokens
     * 4.update RT
     * @param benId 
     * @param refreshToken 
     * @returns tokens
     */
    async refreshTokens(benId: string, refreshToken: string) {
        const ben = await this.prisma.beneficiary.findUnique({ where: { id: benId } });
        if (!ben || !refreshToken || !ben.RT) {
            throw new ForbiddenException('Access Denied');
        }

        const isMatch = await compare(refreshToken, ben.RT);
        if (!isMatch) throw new ForbiddenException('Invalid Refresh Token');


        const tokens = await this.getTokens({ sub: benId });

        await this.updateBenRT(benId, tokens.refreshToken);

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
     * Update & Hash refresh token for beneficiary
     * @param benId 
     * @param refreshToken 
     */
    private async updateBenRT(benId: string, refreshToken: string) {
        const hashedRt = await hash(refreshToken, 10);
        await this.prisma.beneficiary.update({
            where: { id: benId },
            data: { RT: hashedRt },
        });
    }




}