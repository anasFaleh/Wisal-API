import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActiveUserGuard implements CanActivate {
  // constructor(

  //   private readonly prisma: PrismaService

  // ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   const user = request.user; 

  //   if (!user) throw new ForbiddenException('User not authenticated');
 
  //   const dbUser = await this.prisma.user.findUnique({
  //     where: { id: user.sub },
  //     select: { id: true, isActive: true }, 
  //   });

  //   if (!dbUser || dbUser.isActive === false) {
  //     throw new ForbiddenException('Your account is deactivated');
  //   }

    return true;
   }
}
