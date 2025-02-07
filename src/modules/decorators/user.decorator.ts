import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

export const UserDC = createParamDecorator(
  (userInfo: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;
    return !!userInfo ? user[userInfo] : user;
  },
);
