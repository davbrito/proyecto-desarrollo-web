import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);

    if (canActivate) {
      await this.logIn(context.switchToHttp().getRequest());
      return true;
    }

    return false;
  }
}
