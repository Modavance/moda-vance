# Modavance Backend — NestJS Implementation Plan

## Tech Stack

| Layer | Library | Version | Purpose |
|---|---|---|---|
| Framework | NestJS | 11 | Core framework |
| Language | TypeScript | 5 | Strict mode enabled |
| ORM | Prisma | 6 | DB access + migrations |
| Database | MySQL | 8 | Primary data store |
| Auth | @nestjs/jwt + @nestjs/passport | latest | JWT strategy |
| Password | bcrypt | 5 | Password hashing |
| Validation | class-validator + class-transformer | latest | DTO validation + serialization |
| Config | @nestjs/config + joi | latest | Env vars + validation schema |
| Security | @nestjs/helmet | latest | HTTP security headers |
| Rate limiting | @nestjs/throttler | latest | Brute-force protection |
| Docs | @nestjs/swagger | latest | OpenAPI / Swagger UI |
| Health | @nestjs/terminus | latest | Health check endpoint |
| Compression | compression + @types/compression | latest | Response compression |
| Tests | Jest + supertest | latest | Unit + e2e tests |

---

## Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts        ← @Public() — skip global JWT guard
│   │   │   └── get-user.decorator.ts      ← @GetUser() — extract user from req
│   │   ├── dto/
│   │   │   ├── pagination-query.dto.ts    ← shared page/limit/search params
│   │   │   └── paginated-response.dto.ts  ← generic paginated response wrapper
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts          ← global guard, respects @Public()
│   │   │   └── admin-jwt.guard.ts         ← AuthGuard('admin-jwt') wrapper
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   ← uniform error shape
│   │   └── interceptors/
│   │       └── transform.interceptor.ts   ← wraps responses in { data, meta? }
│   ├── prisma/
│   │   ├── prisma.module.ts               ← @Global() module
│   │   └── prisma.service.ts              ← extends PrismaClient, lifecycle hooks
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts            ← PassportStrategy(Strategy, 'jwt')
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       ├── update-profile.dto.ts
│   │       └── auth-response.dto.ts       ← response: { token, user }
│   ├── admin-auth/
│   │   ├── admin-auth.module.ts
│   │   ├── admin-auth.controller.ts
│   │   ├── admin-auth.service.ts
│   │   ├── strategies/
│   │   │   └── admin-jwt.strategy.ts      ← PassportStrategy(Strategy, 'admin-jwt')
│   │   └── dto/
│   │       ├── admin-login.dto.ts
│   │       ├── update-admin-profile.dto.ts
│   │       └── change-password.dto.ts
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts         ← public routes, @Public()
│   │   ├── products.controller.admin.ts   ← /admin/products, @UseGuards(AdminJwtGuard)
│   │   ├── products.service.ts            ← single service used by both controllers
│   │   └── dto/
│   │       ├── product-filter.dto.ts
│   │       ├── create-product.dto.ts
│   │       ├── update-product.dto.ts
│   │       └── product-response.dto.ts
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts           ← public + JWT routes
│   │   ├── orders.controller.admin.ts     ← /admin/orders, @UseGuards(AdminJwtGuard)
│   │   ├── orders.service.ts
│   │   └── dto/
│   │       ├── create-order.dto.ts
│   │       ├── order-filter.dto.ts
│   │       ├── update-order-status.dto.ts
│   │       └── order-response.dto.ts
│   ├── coupons/
│   │   ├── coupons.module.ts
│   │   ├── coupons.controller.ts          ← public validate
│   │   ├── coupons.controller.admin.ts    ← /admin/coupons CRUD
│   │   ├── coupons.service.ts
│   │   └── dto/
│   │       ├── validate-coupon.dto.ts
│   │       ├── create-coupon.dto.ts
│   │       └── update-coupon.dto.ts
│   ├── reviews/
│   │   ├── reviews.module.ts
│   │   ├── reviews.controller.ts
│   │   ├── reviews.service.ts
│   │   └── dto/
│   │       └── create-review.dto.ts
│   ├── blog/
│   │   ├── blog.module.ts
│   │   ├── blog.controller.ts
│   │   ├── blog.controller.admin.ts
│   │   ├── blog.service.ts
│   │   └── dto/
│   │       ├── create-post.dto.ts
│   │       └── update-post.dto.ts
│   ├── faq/
│   │   ├── faq.module.ts
│   │   ├── faq.controller.ts
│   │   ├── faq.controller.admin.ts
│   │   ├── faq.service.ts
│   │   └── dto/
│   │       ├── create-faq.dto.ts
│   │       └── update-faq.dto.ts
│   ├── contact/
│   │   ├── contact.module.ts
│   │   ├── contact.controller.ts
│   │   ├── contact.controller.admin.ts
│   │   ├── contact.service.ts
│   │   └── dto/
│   │       └── create-contact.dto.ts
│   ├── settings/
│   │   ├── settings.module.ts
│   │   ├── settings.controller.ts
│   │   ├── settings.controller.admin.ts
│   │   ├── settings.service.ts
│   │   └── dto/
│   │       └── update-settings.dto.ts
│   ├── analytics/
│   │   ├── analytics.module.ts
│   │   ├── analytics.controller.ts        ← /admin/analytics, AdminJwtGuard
│   │   └── analytics.service.ts
│   └── health/
│       └── health.controller.ts           ← GET /health
├── test/
│   ├── products.e2e-spec.ts
│   └── orders.e2e-spec.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json                          ← strict: true
└── nest-cli.json
```

> **Architecture rule:** Each feature module has **one service** shared by both the public controller and the admin controller. Admin controllers live in `*.controller.admin.ts` and are decorated with `@UseGuards(AdminJwtGuard)` at the class level. This avoids duplicating service logic while keeping routing and authorization clean.

---

## Bootstrap — `src/main.ts`

```typescript
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Response compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // strip unknown properties
      forbidNonWhitelisted: true,   // throw on unknown properties
      transform: true,              // auto-transform to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter — uniform error shape
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),   // respects @Exclude() / @Expose()
    new TransformInterceptor(),                  // wraps in { data, meta? }
  );

  // Global JWT guard — all routes protected unless @Public()
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Swagger — only in non-production
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Modavance API')
      .setDescription('E-commerce API for modafinil/armodafinil products')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'user-jwt')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'admin-jwt')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

---

## Core Infrastructure Patterns

### `prisma/prisma.service.ts`
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### `prisma/prisma.module.ts`
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()   // ← PrismaService available in all modules without re-importing
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### `app.module.ts`
```typescript
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
        PORT:                 Joi.number().default(3000),
        NODE_ENV:             Joi.string().valid('development', 'production', 'test').required(),
        FRONTEND_URL:         Joi.string().uri().required(),
        ADMIN_EMAIL:          Joi.string().email().required(),
        ADMIN_PASSWORD:       Joi.string().min(6).required(),
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),  // 60 req/min default
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
  ],
})
export class AppModule {}
```

### `common/decorators/public.decorator.ts`
```typescript
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### `common/decorators/get-user.decorator.ts`
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
```

### `common/guards/jwt-auth.guard.ts`
```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```

### `common/guards/admin-jwt.guard.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminJwtGuard extends AuthGuard('admin-jwt') {}
```

### `auth/strategies/jwt.strategy.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: { sub: string; email: string; type: string }) {
    // Returned object is attached to req.user
    return { userId: payload.sub, email: payload.email };
  }
}
```

### `admin-auth/strategies/admin-jwt.strategy.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ADMIN_JWT_SECRET'),
    });
  }

  validate(payload: { sub: string; email: string; type: string }) {
    return { adminId: payload.sub, email: payload.email };
  }
}
```

### `auth/auth.module.ts` — pattern for all auth modules
```typescript
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### `common/filters/http-exception.filter.ts`
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? (exception.getResponse() as any).message ?? exception.message
      : 'Internal server error';

    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
    });
  }
}
```

### `common/interceptors/transform.interceptor.ts`
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Paginated responses already have { data, meta } shape — pass through
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return data;
        }
        return { data };
      }),
    );
  }
}
```

### Admin Controller Pattern
```typescript
// Every admin controller follows this pattern:
@Controller('admin/products')
@UseGuards(AdminJwtGuard)
@ApiBearerAuth('admin-jwt')
export class ProductsAdminController {
  constructor(private readonly productsService: ProductsService) {}
  // Same service as public controller — no duplication
}
```

### Pagination Pattern (service)
```typescript
// services always return PaginatedResult<T> for list endpoints
async findAll(query: ProductFilterDto): Promise<PaginatedResult<Product>> {
  const { page = 1, limit = 20 } = query;
  const where = buildWhereClause(query);

  const [data, total] = await Promise.all([
    this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { variants: { orderBy: { sortOrder: 'asc' } } },
    }),
    this.prisma.product.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
```

### Prisma Transaction for Order Creation
```typescript
const order = await this.prisma.$transaction(async (tx) => {
  // 1. Fetch prices from DB — NEVER trust client-provided prices
  const variants = await tx.productVariant.findMany({
    where: { id: { in: dto.items.map((i) => i.variantId) } },
    include: { product: true },
  });

  // 2. Validate all variants exist
  if (variants.length !== dto.items.length) {
    throw new BadRequestException('One or more products are invalid');
  }

  // 3. Calculate all amounts server-side
  const subtotal = /* sum of variant.price * quantity */;
  const shipping = subtotal >= 150 ? 0 : 9.99;
  const couponDiscount = /* validate and calculate */;
  const paymentDiscount = /* PAYMENT_DISCOUNTS[dto.paymentMethod] * subtotal */;
  const discount = couponDiscount + paymentDiscount;
  const total = subtotal - discount + shipping;

  // 4. Create order + items atomically
  const created = await tx.order.create({
    data: {
      id: generateOrderId(),
      ...dto,
      subtotal, shipping, discount, total,
      items: { create: buildOrderItems(dto.items, variants) },
    },
    include: { items: true },
  });

  // 5. Create initial status log
  await tx.orderStatusLog.create({
    data: { orderId: created.id, fromStatus: null, toStatus: 'CONFIRMED' },
  });

  return created;
});
```

### Json Field Type Casting
```typescript
// images and effects are Json in MySQL — always cast in services:
const images = product.images as string[];
const effects = product.effects as string[];
```

### Logger Usage
```typescript
// Every service uses NestJS Logger (not console.log):
private readonly logger = new Logger(ProductsService.name);

this.logger.log(`Product created: ${id}`);
this.logger.warn(`Product not found: ${slug}`);
this.logger.error('DB error', error.stack);
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Brand {
  SUN_PHARMA
  HAB_PHARMA
}

enum Category {
  MODAFINIL
  ARMODAFINIL
  MIX           // Nootropic Starter Pack
}

enum ProductBadge {
  BESTSELLER
  NEW
  SALE
  POPULAR
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  BITCOIN
  ETHEREUM
  ZELLE
  BILL
}

enum CouponType {
  PERCENT
  FIXED
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  firstName    String
  lastName     String
  passwordHash String
  savedAddress Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  orders  Order[]
  reviews Review[]
}

model Product {
  id               String        @id @default(cuid())
  name             String
  slug             String        @unique
  brand            Brand
  category         Category
  strength         String
  pillsPerStrip    Int
  description      String        @db.LongText
  shortDescription String        @db.Text
  image            String
  images           Json          // String[] — cast in service: product.images as string[]
  effects          Json          // String[] — cast in service: product.effects as string[]
  ingredients      String        @db.Text
  manufacturer     String
  rating           Float         @default(0)
  reviewCount      Int           @default(0)
  badge            ProductBadge?
  inStock          Boolean       @default(true)
  featured         Boolean       @default(false)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  variants   ProductVariant[]
  reviews    Review[]
  orderItems OrderItem[]
}

model ProductVariant {
  id            String  @id @default(cuid())
  productId     String
  quantity      Int
  price         Float
  originalPrice Float?
  savings       Float?
  label         String?
  sortOrder     Int     @default(0)

  product    Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]
}

model Order {
  id                String        @id   // ORD-{Date.now()}-{RANDOM5} — generated in service
  userId            String?
  status            OrderStatus   @default(CONFIRMED)
  subtotal          Float
  shipping          Float
  discount          Float         @default(0)
  total             Float
  paymentMethod     PaymentMethod
  trackingNumber    String?
  estimatedDelivery DateTime?
  shippingAddress   Json          // Address snapshot
  couponCode        String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  user       User?            @relation(fields: [userId], references: [id])
  items      OrderItem[]
  statusLogs OrderStatusLog[]
}

model OrderItem {
  id          String @id @default(cuid())
  orderId     String
  productId   String
  variantId   String
  productName String
  quantity    Int
  pillCount   Int
  price       Float
  image       String

  order   Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product        @relation(fields: [productId], references: [id])
  variant ProductVariant @relation(fields: [variantId], references: [id])
}

model OrderStatusLog {
  id         String       @id @default(cuid())
  orderId    String
  fromStatus OrderStatus?   // null = initial creation
  toStatus   OrderStatus
  note       String?
  changedAt  DateTime     @default(now())

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}

model Review {
  id        String   @id @default(cuid())
  productId String
  userId    String?  // null for seeded reviews
  userName  String
  rating    Int
  title     String
  body      String   @db.LongText
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User?   @relation(fields: [userId], references: [id])
}

model Coupon {
  code      String     @id
  discount  Float
  type      CouponType
  minOrder  Float      @default(0)
  expiresAt DateTime
  createdAt DateTime   @default(now())
}

model BlogPost {
  id        String   @id @default(cuid())
  slug      String   @unique
  title     String
  excerpt   String
  body      String   @db.LongText
  image     String
  author    String
  category  String
  readTime  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model FaqItem {
  id        String   @id @default(cuid())
  section   String
  question  String
  answer    String   @db.LongText
  order     Int      @default(0)  // Prisma auto-quotes reserved SQL keywords
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String   @db.LongText
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Setting {
  key       String   @id
  value     String   @db.Text
  updatedAt DateTime @updatedAt
}

model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## API Endpoints

All success responses: `{ data: T }` or `{ data: T[], meta: PaginationMeta }`
All error responses: `{ statusCode, message, error }`

### Auth — `/api/auth`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| POST | `/auth/register` | Public | 201 | Create user account |
| POST | `/auth/login` | Public | 200 | Returns `{ token, user }` |
| GET | `/auth/me` | JWT | 200 | Current user profile |
| PUT | `/auth/me` | JWT | 200 | Update saved address |
| POST | `/auth/logout` | JWT | 200 | Client-side token removal |

### Admin Auth — `/api/admin/auth`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| POST | `/admin/auth/login` | Public | 200 | Returns `{ token, admin }` |
| GET | `/admin/auth/me` | AdminJWT | 200 | Current admin profile |
| PUT | `/admin/auth/profile` | AdminJWT | 200 | Change email |
| PUT | `/admin/auth/password` | AdminJWT | 200 | Change password |

### Products — `/api/products`

| Method | Path | Auth | Status | Query | Description |
|---|---|---|---|---|---|
| GET | `/products` | Public | 200 | `?category=&search=&sort=&page=&limit=` | Paginated products |
| GET | `/products/featured` | Public | 200 | — | Featured products |
| GET | `/products/:slug` | Public | 200 | — | Single product |

### Orders — `/api/orders`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| POST | `/orders` | Public | 201 | Create order (guest or authenticated) |
| GET | `/orders/mine` | JWT | 200 | Logged-in user's orders |
| GET | `/orders/:id` | Public | 200 | Track by order ID |
| GET | `/orders/:id/logs` | Public | 200 | Status change timeline |

> `GET /orders/mine` **must be declared before** `GET /orders/:id` in the controller file to prevent NestJS routing engine from matching `"mine"` as an orderId parameter.

### Coupons — `/api/coupons`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| POST | `/coupons/validate` | Public | 200 | Validate coupon against subtotal |

### Reviews — `/api/reviews`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| GET | `/reviews` | Public | 200 | `?productId=` |
| POST | `/reviews` | JWT | 201 | Submit review |

### Blog — `/api/blog`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| GET | `/blog` | Public | 200 | All posts |
| GET | `/blog/:slug` | Public | 200 | Single post |

### FAQ — `/api/faq`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| GET | `/faq` | Public | 200 | All items grouped by section |

### Contact — `/api/contact`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| POST | `/contact` | Public | 201 | Submit contact form |

### Settings — `/api/settings`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| GET | `/settings` | Public | 200 | All public settings |
| GET | `/settings/payment` | Public | 200 | Payment config (wallets, discounts) |

### Health — `/api/health`

| Method | Path | Auth | Status | Description |
|---|---|---|---|---|
| GET | `/health` | Public | 200 | DB connectivity check |

---

### Admin Endpoints — `/api/admin/*` (all require AdminJWT)

#### Orders
| Method | Path | Status | Query/Body | Description |
|---|---|---|---|---|
| GET | `/admin/orders` | 200 | `?status=&page=&limit=&search=` | All orders paginated |
| GET | `/admin/orders/:id` | 200 | — | Single order with items |
| PATCH | `/admin/orders/:id/status` | 200 | `UpdateOrderStatusDto` | Change status + optional note |
| GET | `/admin/orders/:id/logs` | 200 | — | Status log timeline |

#### Products
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/products` | 200 | All products |
| POST | `/admin/products` | 201 | Create product + variants |
| PATCH | `/admin/products/:id` | 200 | Update product |
| DELETE | `/admin/products/:id` | 204 | Delete product |

#### Customers
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/customers` | 200 | `?page=&limit=&search=` |
| GET | `/admin/customers/:id` | 200 | User profile |
| GET | `/admin/customers/:id/orders` | 200 | User's order history |

#### Coupons
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/coupons` | 200 | All coupons |
| POST | `/admin/coupons` | 201 | Create coupon |
| PATCH | `/admin/coupons/:code` | 200 | Update coupon |
| DELETE | `/admin/coupons/:code` | 204 | Delete coupon |

#### Blog
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/blog` | 200 | All posts |
| POST | `/admin/blog` | 201 | Create post |
| PATCH | `/admin/blog/:id` | 200 | Update post |
| DELETE | `/admin/blog/:id` | 204 | Delete post |

#### FAQ
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/faq` | 200 | All items |
| POST | `/admin/faq` | 201 | Create item |
| PATCH | `/admin/faq/:id` | 200 | Update item |
| DELETE | `/admin/faq/:id` | 204 | Delete item |

#### Contact
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/contact` | 200 | All submissions (`?read=false`) |
| GET | `/admin/contact/:id` | 200 | Single submission |
| PATCH | `/admin/contact/:id` | 200 | Mark read/unread |
| DELETE | `/admin/contact/:id` | 204 | Delete |

#### Settings
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/settings` | 200 | All settings |
| PUT | `/admin/settings` | 200 | Bulk update `{ key: value }` |

#### Analytics
| Method | Path | Status | Description |
|---|---|---|---|
| GET | `/admin/analytics/overview` | 200 | Revenue, orders, customers, avg order |
| GET | `/admin/analytics/monthly` | 200 | Monthly revenue + orders (12 months) |
| GET | `/admin/analytics/payment` | 200 | Breakdown by payment method |
| GET | `/admin/analytics/products` | 200 | Top products by revenue |

---

## Business Logic

### Order Creation
```
1. Validate all productIds + variantIds exist in DB
   → If any missing: throw BadRequestException
2. Calculate subtotal from DB variant prices × quantities (NEVER trust client prices)
3. Calculate shipping: subtotal >= 150 → 0, else 9.99
4. Validate coupon (if provided):
   → Not found: throw NotFoundException
   → expiresAt < now: throw BadRequestException('Coupon has expired')
   → subtotal < minOrder: throw BadRequestException('Minimum order $X required')
5. Calculate discount:
   → Coupon (PERCENT): subtotal * (discount / 100)
   → Coupon (FIXED): discount value
   → Payment (BITCOIN/ETHEREUM): subtotal * 0.15
   → Payment (ZELLE): subtotal * 0.10
   → Payment (BILL): 0
   → Both stack: totalDiscount = couponDiscount + paymentDiscount
6. total = subtotal - totalDiscount + shipping
7. Generate ID: ORD-{Date.now()}-{Math.random().toString(36).slice(2,7).toUpperCase()}
8. Prisma $transaction: create Order + OrderItems + initial OrderStatusLog
9. Return full order with items
```

### Order Status Transitions
```
PENDING    → CONFIRMED, CANCELLED
CONFIRMED  → PROCESSING, CANCELLED
PROCESSING → SHIPPED, CANCELLED
SHIPPED    → DELIVERED, CANCELLED
DELIVERED  → (terminal)
CANCELLED  → (terminal)

Invalid transition → throw BadRequestException('Invalid status transition')
```

### Password Hashing
```typescript
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, hash);
```

### JWT Payloads
```typescript
// User:  { sub: user.id, email: user.email, type: 'user' }  — secret: JWT_SECRET,       expires: 7d
// Admin: { sub: admin.id, email: admin.email, type: 'admin' } — secret: ADMIN_JWT_SECRET, expires: 8h
```

### Exception Types by Context
```
NotFoundException    (404) — product/order/user/coupon not found
BadRequestException  (400) — validation, expired coupon, invalid transition
ConflictException    (409) — email already registered, duplicate coupon code
UnauthorizedException (401) — invalid/missing JWT (thrown by Passport automatically)
ForbiddenException   (403) — accessing admin route with user token
```

---

## DTOs

### Shared — `common/dto/`

```typescript
// pagination-query.dto.ts
export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

// paginated-response.dto.ts
export class PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Address DTO (shared, used in auth + orders)

```typescript
export class AddressDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail()                email: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() street: string;
  @IsString() @IsOptional() apt?: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() state: string;
  @IsString() @IsNotEmpty() zip: string;
  @IsString() @IsNotEmpty() country: string;
}
```

### Auth DTOs

```typescript
// register.dto.ts
export class RegisterDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;

  @IsString() @IsNotEmpty() @MaxLength(50) firstName: string;
  @IsString() @IsNotEmpty() @MaxLength(50) lastName: string;
}

// login.dto.ts
export class LoginDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString() @IsNotEmpty() password: string;
}

// update-profile.dto.ts
export class UpdateProfileDto {
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  savedAddress?: AddressDto;
}
```

### Admin Auth DTOs

```typescript
// admin-login.dto.ts
export class AdminLoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
}

// change-password.dto.ts
export class ChangePasswordDto {
  @IsString() @IsNotEmpty() currentPassword: string;
  @IsString() @MinLength(6) @MaxLength(64) newPassword: string;
}

// update-admin-profile.dto.ts
export class UpdateAdminProfileDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;
}
```

### Order DTOs

```typescript
// create-order.dto.ts
// NOTE: subtotal, discount, total are NOT accepted — server calculates from DB prices
export class CreateOrderItemDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() variantId: string;
  @IsInt() @Min(1) quantity: number;
}

export class CreateOrderDto {
  @IsString() @IsOptional() userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items: CreateOrderItemDto[];

  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @IsEnum(PaymentMethod) paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  couponCode?: string;
}

// update-order-status.dto.ts
export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
  @IsString() @IsOptional() note?: string;
}

// order-filter.dto.ts
export class OrderFilterDto extends PaginationQueryDto {
  @IsEnum(OrderStatus) @IsOptional() status?: OrderStatus;
  @IsString() @IsOptional() search?: string;
}
```

### Product DTOs

```typescript
// product-filter.dto.ts
export class ProductFilterDto extends PaginationQueryDto {
  @IsEnum(Category) @IsOptional() category?: Category;
  @IsString() @IsOptional() search?: string;
  @IsIn(['price_asc', 'price_desc', 'rating', 'newest']) @IsOptional() sort?: string;
}

// create-product.dto.ts — variants required
export class CreateProductVariantDto {
  @IsInt() @Min(1) quantity: number;
  @IsNumber() @Min(0) price: number;
  @IsNumber() @Min(0) @IsOptional() originalPrice?: number;
  @IsNumber() @Min(0) @IsOptional() savings?: number;
  @IsString() @IsOptional() label?: string;
  @IsInt() @Min(0) @IsOptional() sortOrder?: number;
}

export class CreateProductDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() @Matches(/^[a-z0-9-]+$/) slug: string;
  @IsEnum(Brand) brand: Brand;
  @IsEnum(Category) category: Category;
  @IsString() @IsNotEmpty() strength: string;
  @IsInt() @Min(1) pillsPerStrip: number;
  @IsString() @IsNotEmpty() description: string;
  @IsString() @IsNotEmpty() shortDescription: string;
  @IsUrl() image: string;
  @IsArray() @IsUrl({}, { each: true }) images: string[];
  @IsArray() @IsString({ each: true }) effects: string[];
  @IsString() @IsNotEmpty() ingredients: string;
  @IsString() @IsNotEmpty() manufacturer: string;
  @IsEnum(ProductBadge) @IsOptional() badge?: ProductBadge;
  @IsBoolean() inStock: boolean;
  @IsBoolean() featured: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  @ArrayMinSize(1)
  variants: CreateProductVariantDto[];
}
```

### Coupon DTOs

```typescript
// validate-coupon.dto.ts
export class ValidateCouponDto {
  @IsString() @IsNotEmpty() code: string;
  @IsNumber() @Min(0) subtotal: number;
}

// create-coupon.dto.ts
export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]+$/, { message: 'Code must be uppercase alphanumeric' })
  code: string;

  @IsNumber() @Min(0) discount: number;
  @IsEnum(CouponType) type: CouponType;
  @IsNumber() @Min(0) minOrder: number;
  @IsISO8601() expiresAt: string;
}

// update-coupon.dto.ts
export class UpdateCouponDto {
  @IsNumber() @Min(0) @IsOptional() discount?: number;
  @IsEnum(CouponType) @IsOptional() type?: CouponType;
  @IsNumber() @Min(0) @IsOptional() minOrder?: number;
  @IsISO8601() @IsOptional() expiresAt?: string;
}
```

### Other DTOs

```typescript
// create-contact.dto.ts
export class CreateContactDto {
  @IsString() @IsNotEmpty() @MaxLength(100) name: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() @MaxLength(200) subject: string;
  @IsString() @IsNotEmpty() @MaxLength(2000) message: string;
}

// create-review.dto.ts
export class CreateReviewDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() body: string;
  @IsInt() @Min(1) @Max(5) rating: number;
}

// update-settings.dto.ts
export class UpdateSettingsDto {
  @IsObject()
  @IsNotEmpty()
  settings: Record<string, string>;
}
```

---

## Rate Limiting

Auth and contact endpoints are rate-limited with `@nestjs/throttler`:

```typescript
// Default (ThrottlerModule): 60 requests / 60 seconds

// Stricter limits on sensitive endpoints:
@Throttle({ default: { limit: 5, ttl: 60_000 } })
@Post('/auth/login')
login() {}

@Throttle({ default: { limit: 5, ttl: 60_000 } })
@Post('/admin/auth/login')
adminLogin() {}

@Throttle({ default: { limit: 3, ttl: 60_000 } })
@Post('/contact')
submit() {}
```

---

## Environment Variables

```env
# .env.example

DATABASE_URL="mysql://user:password@localhost:3306/modavance"

JWT_SECRET="your-user-jwt-secret-min-32-chars"
JWT_EXPIRES_IN="7d"
ADMIN_JWT_SECRET="your-admin-jwt-secret-min-32-chars-different-from-user"
ADMIN_JWT_EXPIRES_IN="8h"

PORT=3000
NODE_ENV=development

FRONTEND_URL="http://localhost:5173"

ADMIN_EMAIL="admin@modavance.com"
ADMIN_PASSWORD="admin123"
```

All variables are validated at startup via Joi in `ConfigModule.forRoot()`. If any required variable is missing, the app fails to boot.

---

## Seed Data

### prisma/seed.ts — run with `npx prisma db seed`

**Products** (5) — 5 variants each for main products, 2 for starter pack:

- **Modalert 200mg** (SUN_PHARMA, MODAFINIL, featured=true, badge=BESTSELLER)
  - 30/$89 (orig $100) · 50/$119 (orig $159) · 100/$179 (orig $239)
  - 200/$279 (orig $349, "Bulk Deal", savings $71) · 300/$359 (orig $409, "Bulk Deal", savings $71)

- **Modvigil 200mg** (HAB_PHARMA, MODAFINIL, featured=true, badge=POPULAR)
  - 30/$79 (orig $99) · 50/$99 (orig $139) · 100/$159 (orig $199)
  - 200/$259 (orig $309, "Bulk Deal", savings $61) · 300/$359 (orig $409, "Bulk Deal", savings $61)

- **Waklert 150mg** (SUN_PHARMA, ARMODAFINIL, featured=true, badge=NEW)
  - 30/$89 (orig $100) · 50/$119 (orig $159) · 100/$179 (orig $239)
  - 200/$279 (orig $349, "Bulk Deal", savings $71) · 300/$359 (orig $409, "Bulk Deal", savings $71)

- **Artvigil 150mg** (HAB_PHARMA, ARMODAFINIL, featured=false, badge=SALE)
  - 30/$79 (orig $99) · 50/$99 (orig $139) · 100/$159 (orig $199)
  - 200/$259 (orig $309, "Bulk Deal", savings $91) · 300/$359 (orig $409, "Bulk Deal", savings $91)

- **Nootropic Starter Pack** (SUN_PHARMA, MIX, featured=true, badge=POPULAR)
  - 20 pills/$59 (orig $79, "20 Pills (10 of each)") · 40 pills/$99 (orig $149, "40 Pills (10 of each)")

**Reviews** (8): verified reviews across products. Seeded `userId` values (u1–u8) are display-only identifiers, not real DB user IDs — stored with `userId: null` in MySQL.

**Blog Posts** (4):
- `modafinil-vs-armodafinil-complete-guide` — "Modafinil vs Armodafinil: The Complete 2025 Guide" (Education, 8 min, Dr. Alexandra Chen)
- `optimal-modafinil-dosing-protocol` — "The Optimal Modafinil Dosing Protocol for Maximum Results" (Guides, 6 min, Marcus Webb)
- `sun-pharma-vs-hab-pharma-comparison` — "Sun Pharma vs HAB Pharma: Which Manufacturer Is Better?" (Product Reviews, 5 min, ModaVance Research Team)
- `productivity-stack-2025` — "The Ultimate Productivity Stack for 2025: Nootropics, Habits & Tools" (Lifestyle, 10 min, Tyler Nordmann)

**Coupons** (3):
- `WELCOME10`: 10% off, no minimum, expires 2026-12-31
- `BULK20`: 20% off, min $150, expires 2026-12-31
- `SAVE30`: $30 fixed, min $100, expires 2026-12-31

**FAQ** (20 items, 5 sections):
- About Our Products (5): Modafinil + how it works, Modafinil vs Armodafinil, Modalert vs Modvigil, Is it safe, Genuine pharmaceutical grade
- Ordering & Payment (4): Payment methods accepted, Prescription required, Personal info security, Coupon codes
- Shipping & Delivery (5): Shipping time, Discreet packaging, International shipping, Reshipment policy, How to track
- Usage & Dosing (3): Recommended dose, How often, What to avoid
- Support (3): How to contact, Refund policy, Missing confirmation email

**Settings** (11):
- `contact.email` → `support@modavance.com`
- `contact.response_time` → `Within 24 hours, 7 days a week`
- `contact.phone` → `''`
- `payment.bitcoin.wallet` → `''`
- `payment.bitcoin.discount` → `15`
- `payment.ethereum.wallet` → `''`
- `payment.ethereum.discount` → `15`
- `payment.zelle.recipient` → `''`
- `payment.zelle.discount` → `10`
- `payment.bill.address` → `''`
- `payment.bill.instructions` → `''`

**Admin** (1): `admin@modavance.com` / `admin123` (bcrypt hashed, rounds=12)

---

## Testing Structure

```
src/
  products/
    products.service.spec.ts     ← unit tests (mock PrismaService)
    products.controller.spec.ts  ← controller unit tests
  orders/
    orders.service.spec.ts
  auth/
    auth.service.spec.ts
test/
  products.e2e-spec.ts           ← supertest e2e (real DB or test DB)
  orders.e2e-spec.ts
  auth.e2e-spec.ts
```

Unit test module setup:
```typescript
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ProductsService,
      { provide: PrismaService, useValue: mockPrismaService },
    ],
  }).compile();

  service = module.get<ProductsService>(ProductsService);
});
```

E2E test setup:
```typescript
beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
});

it('GET /api/products returns 200', () =>
  request(app.getHttpServer()).get('/api/products').expect(200)
);
```

---

## Implementation Order

1. **Setup** — `nest new backend`, install all deps, configure `tsconfig.json` (`strict: true`), `nest-cli.json`
2. **Prisma** — write schema, `prisma migrate dev --name init`, write seed, run `npx prisma db seed`
3. **PrismaModule** — `@Global()` module with `onModuleInit` / `onModuleDestroy`
4. **AppModule** — `ConfigModule` with Joi validation, `ThrottlerModule`, all feature modules
5. **main.ts** — helmet, CORS, ValidationPipe, filters, interceptors, global JWT guard, Swagger
6. **Common** — `@Public()`, `@GetUser()`, `JwtAuthGuard`, `AdminJwtGuard`, `HttpExceptionFilter`, `TransformInterceptor`
7. **Auth** — `PassportModule`, `JwtModule.registerAsync`, `JwtStrategy`, register/login/me endpoints
8. **AdminAuth** — `AdminJwtStrategy` (name: `'admin-jwt'`), separate ADMIN_JWT_SECRET, login/me/profile/password
9. **Products** — public read + admin CRUD, single service, two controllers
10. **Orders** — create with server-side price calculation, `/mine`, track, admin status change
11. **Coupons** — validate (public) + admin CRUD with update
12. **Blog** — public read + admin CRUD
13. **FAQ** — public read + admin CRUD
14. **Contact** — public submit + admin read/mark-read
15. **Settings** — public read + admin write
16. **Reviews** — public read + auth submit
17. **Analytics** — aggregate queries over orders/users
18. **Health** — `GET /api/health` using `@nestjs/terminus`
19. **Tests** — unit tests for services, e2e for critical flows

---

## Frontend Integration Notes

When migrating frontend from IndexedDB to this API:

1. Replace all `db.*` Dexie calls with `fetch('/api/...')` or axios
2. Replace `authStore` login/register with JWT API calls — store token in `localStorage`
3. Replace `adminStore` with admin JWT token from `POST /api/admin/auth/login`
4. `cartStore` stays client-side (no cart persistence on backend)
5. `modavance-recently-viewed` localStorage stays client-side
6. `modavance-orders-seen-at` localStorage stays client-side (notification bell)
7. All React Query `queryFn` functions call the API instead of Dexie
8. `VITE_API_URL=http://localhost:3000` in `frontend/.env`
9. Backend `FRONTEND_URL=http://localhost:5173` for CORS
10. Update `frontend/src/db/seed.ts` to add the 4 missing settings: `payment.zelle.recipient`, `payment.zelle.discount`, `payment.bill.address`, `payment.bill.instructions`
11. Checkout fetch no longer sends `subtotal` or `discount` — backend calculates from DB prices
12. `/orders/my` renamed to `/orders/mine` — update all frontend references
13. All API calls use `/api/` prefix — set base URL in a single axios instance or fetch wrapper
