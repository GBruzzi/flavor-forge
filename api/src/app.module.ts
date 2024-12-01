import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { RecipeModule } from './recipe/recipe.module'; 
import { ConfigModule } from '@nestjs/config'; 
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule acessível globalmente
    }),  
    TypeOrmModule.forRoot({
      type: 'postgres',  
      host: process.env.DB_HOST, 
      port: parseInt(process.env.DB_PORT, 10), 
      username: process.env.DB_USERNAME, 
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME, 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],  
      synchronize: true, 
    }),
    UserModule, 
    RecipeModule, AuthModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
