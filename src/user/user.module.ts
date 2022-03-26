import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [JwtModule.register({})],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
