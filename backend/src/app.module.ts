import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CouponsModule } from './coupons/coupons.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BlogModule } from './blog/blog.module';
import { FaqModule } from './faq/faq.module';
import { ContactModule } from './contact/contact.module';
import { SettingsModule } from './settings/settings.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { CustomersModule } from './customers/customers.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        DATABASE_URL:         Joi.string().required(),
        JWT_SECRET:           Joi.string().min(32).required(),
        JWT_EXPIRES_IN:       Joi.string().required(),
        ADMIN_JWT_SECRET:     Joi.string().min(32).required(),
        ADMIN_JWT_EXPIRES_IN: Joi.string().required(),
        PORT:                 Joi.number().default(3001),
        NODE_ENV:             Joi.string().valid('development', 'production', 'test').required(),
        FRONTEND_URL:         Joi.string().uri().required(),
        ADMIN_EMAIL:          Joi.string().email().required(),
        ADMIN_PASSWORD:       Joi.string().min(6).required(),
        SENDGRID_API_KEY:     Joi.string().optional(),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    AdminAuthModule,
    ProductsModule,
    OrdersModule,
    CouponsModule,
    ReviewsModule,
    BlogModule,
    FaqModule,
    ContactModule,
    SettingsModule,
    AnalyticsModule,
    HealthModule,
    CustomersModule,
    EmailModule,
  ],
})
export class AppModule {}
