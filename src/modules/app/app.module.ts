import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { ConfigurationModule } from 'src/config/app/app-config.module';
import { OrmConfigModulePostgres } from 'src/config/database/common-type-orm.config';
import { TranslateModule } from 'src/utility/translate/translate.module';
import { SwaggerModule } from '../../config/swagger/swagger.module';
import { AuthModule } from '../auth/auth.module';
import { InqueryCoreModule } from '../inquery/inquery-core/inquery-core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    SwaggerModule,
    TranslateModule,
    ConfigurationModule,
    InqueryCoreModule,
    AuthModule,
    TypeOrmModule.forRootAsync(OrmConfigModulePostgres),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('');
    }
}
