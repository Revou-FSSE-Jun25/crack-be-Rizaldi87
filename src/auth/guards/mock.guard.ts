import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = { userId: 1, role: 'STUDENT' };
    return true;
  }
}
