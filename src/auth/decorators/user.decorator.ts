import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthDecorator = createParamDecorator(
  (data, req: ExecutionContext) => {
    const request = req.switchToHttp().getRequest();
    return request.user;
  },
);
