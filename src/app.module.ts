import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './app/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import profileConfig from './app/modules/users/config/profile.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseExceptionFilter } from './app/common/errors/global.errors';
import { DataResponseInterceptor } from './app/common/interceptors/data-response/data-response.interceptor';
import { DataQueryModule } from './app/common/data-query/data-query.module';
import { MailModule } from './app/modules/mail/mail.module';
import { FileUploadsModule } from './app/common/file-uploads/file-uploads.modules';
import { HomeHeroSectionModule } from './app/modules/home-hero-section/home-hero-section.module';
import { HomeAboutSectionModule } from './app/modules/home-about-section/home-about-section.module';
import { HomeEducationModule } from './app/modules/home-education/home-education.module';
import { ExperienceModule } from './app/modules/experience/experience.module';
import { AboutMeModule } from './app/modules/about-me/about-me.module';
import { MyHobbiesModule } from './app/modules/my-hobbies/my-hobbies.module';
import { CollaborateModule } from './app/modules/collaborate/collaborate.module';
import { SnapshotsModule } from './app/modules/snapshots/snapshots.module';
import { SnapshotsCategoryModule } from './app/modules/snapshots-category/snapshots-category.module';
import { ProfessorsModule } from './app/modules/professors/professors.module';
import { ExtraCurriculumCategoryModule } from './app/modules/extra-curriculum-category/extra-curriculum-category.module';
import { ExtraCurriculumModule } from './app/modules/extra-curriculum/extra-curriculum.module';
import { SkillsCategoryModule } from './app/modules/skills-category/skills-category.module';
import { SkillsModule } from './app/modules/skills/skills.module';
import { CollaboratingModule } from './app/modules/collaborating/collaborating.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ArticlesModule } from './app/modules/articles/articles.module';
import { ArticleCategoriesModule } from './app/modules/article-categories/article-categories.module';
import { ArticleDetailsModule } from './app/modules/article-details/article-details.module';
import { ProjectsModule } from './app/modules/projects/projects.module';
import { ProjectCategoriesModule } from './app/modules/project-categories/project-categories.module';
import { ProjectDetailsModule } from './app/modules/project-details/project-details.module';
import { ResearchAndPublicationsModule } from './app/modules/research-and-publications/research-and-publications.module';
import { SectionDescriptionModule } from './app/modules/section-description/section-description.module';
import { SendMassageModule } from './app/modules/send-massage/send-massage.module';

/**
 * // Get environment (development/production/etc.)
 *
 */
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 1,
        },
      ],
    }),
    // Load environment variables and global configs
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig, profileConfig],
      validationSchema: environmentValidation,
    }),

    // Database connection with async configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('database.host'),
        port: +ConfigService.get('database.port'),
        username: ConfigService.get('database.user'),
        password: ConfigService.get('database.password'),
        database: ConfigService.get('database.name'),
        autoLoadEntities: ConfigService.get('database.autoLoadEntities'),
        synchronize: ConfigService.get('database.synchronize'),
      }),
    }),

    // Feature modules

    DataQueryModule,
    MailModule,
    FileUploadsModule,
    HomeHeroSectionModule,
    HomeAboutSectionModule,
    HomeEducationModule,
    ExperienceModule,
    AboutMeModule,
    MyHobbiesModule,
    CollaborateModule,
    SnapshotsModule,
    SnapshotsCategoryModule,
    ProfessorsModule,
    ExtraCurriculumCategoryModule,
    ExtraCurriculumModule,
    SkillsCategoryModule,
    SkillsModule,
    CollaboratingModule,
    ArticlesModule,
    ArticleCategoriesModule,
    ArticleDetailsModule,
    ProjectsModule,
    ProjectCategoriesModule,
    ProjectDetailsModule,
    ResearchAndPublicationsModule,
    SectionDescriptionModule,
    SendMassageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // For response serialization
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
    // Global Error Filter
    {
      provide: APP_FILTER,
      useClass: DatabaseExceptionFilter, // Custom database exception handling
    },
  ],
})
export class AppModule {}
