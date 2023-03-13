import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from 'src/common/strategy/api-key.strategy';
import { AuthService } from './service/auth.service';
@Module({
imports: [PassportModule],
providers: [AuthService, ApiKeyStrategy],
})
export class AuthModule {}