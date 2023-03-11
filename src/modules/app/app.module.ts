import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from 'src/config/app/app-config.module';
import { OrmConfigModulePostgres } from 'src/config/database/common-type-orm.config';
import { TranslateModule } from 'src/utility/translate/translate.module';
import { SwaggerModule } from '../../config/swagger/swagger.module';
import { InqueryCoreModule } from '../inquery/inquery-core/inquery-core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    SwaggerModule,
    TranslateModule,
    ConfigurationModule,
    InqueryCoreModule,
    TypeOrmModule.forRootAsync(OrmConfigModulePostgres),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
