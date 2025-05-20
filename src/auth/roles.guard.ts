import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';

export function RolesGuardFactory(requiredRoles: string[]): Type<CanActivate> {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      return user && requiredRoles.includes(user.role);
    }
  }

  return mixin(RolesGuardMixin);
}
