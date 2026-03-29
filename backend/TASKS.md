# Modavance Backend — Implementation Tasks

> Checkboxes: `[ ]` = not started · `[x]` = done
> Work top-to-bottom. Each phase depends on the previous one being complete.

---

## Phase 1 — Project Setup

- [ ] Run `nest new backend --skip-git --package-manager npm` inside `moda-vance/`
- [ ] Delete generated `src/app.controller.ts`, `src/app.service.ts`, `src/app.controller.spec.ts`
- [ ] Update `tsconfig.json` — set `"strict": true`, `"strictNullChecks": true`, `"noImplicitAny": true`
- [ ] Update `nest-cli.json` — confirm `sourceRoot: "src"`, `entryFile: "main"`
- [ ] Create `.env` from `.env.example` and fill in values:
  - `DATABASE_URL`
  - `JWT_SECRET` (min 32 chars)
  - `JWT_EXPIRES_IN=7d`
  - `ADMIN_JWT_SECRET` (min 32 chars, different from JWT_SECRET)
  - `ADMIN_JWT_EXPIRES_IN=8h`
  - `PORT=3000`
  - `NODE_ENV=development`
  - `FRONTEND_URL=http://localhost:5173`
  - `ADMIN_EMAIL=admin@modavance.com`
  - `ADMIN_PASSWORD=admin123`
- [ ] Add `backend/.env` to `.gitignore` (root `.gitignore` only has `node_modules/`)
- [ ] Install all production dependencies:
  ```
  npm i @nestjs/config @nestjs/jwt @nestjs/passport @nestjs/swagger @nestjs/terminus @nestjs/throttler
  npm i passport passport-jwt bcrypt class-validator class-transformer helmet compression joi
  npm i @prisma/client
  ```
- [ ] Install all dev dependencies:
  ```
  npm i -D prisma @types/passport-jwt @types/bcrypt @types/compression @types/supertest supertest
  ```
- [ ] Verify `npm run build` compiles without errors

---

## Phase 2 — Prisma & Database

- [ ] Run `npx prisma init` — creates `prisma/schema.prisma` and adds `DATABASE_URL` to `.env`
- [ ] Write `prisma/schema.prisma` — all models and enums:
  - [ ] Enums: `Brand`, `Category` (with `MIX`), `ProductBadge`, `OrderStatus`, `PaymentMethod`, `CouponType`
  - [ ] Model: `User` (id, email, firstName, lastName, passwordHash, savedAddress Json?, createdAt, updatedAt)
  - [ ] Model: `Product` (all fields, images Json, effects Json)
  - [ ] Model: `ProductVariant` (id, productId, quantity, price, originalPrice?, savings?, label?, sortOrder)
  - [ ] Model: `Order` (id custom format, userId?, status, subtotal, shipping, discount, total, paymentMethod, shippingAddress Json, couponCode?, tracking?, estimatedDelivery?, createdAt, updatedAt)
  - [ ] Model: `OrderItem` (snapshot fields: productName, pillCount, price, image)
  - [ ] Model: `OrderStatusLog` (fromStatus nullable, toStatus, note?, changedAt)
  - [ ] Model: `Review` (userId nullable for seeded reviews)
  - [ ] Model: `Coupon` (code as @id primary key)
  - [ ] Model: `BlogPost`
  - [ ] Model: `FaqItem` (field named `order` — Prisma quotes reserved SQL keywords automatically)
  - [ ] Model: `ContactSubmission`
  - [ ] Model: `Setting` (key as @id, value @db.Text, updatedAt @updatedAt)
  - [ ] Model: `Admin`
- [ ] Run `npx prisma migrate dev --name init` — generates migration + creates tables
- [ ] Verify all tables created in MySQL with correct columns
- [ ] Write `prisma/seed.ts`:
  - [ ] **Products** (5 total):
    - [ ] Modalert 200mg — SUN_PHARMA, MODAFINIL, featured, BESTSELLER, 5 variants (30/50/100/200/300 pills)
    - [ ] Modvigil 200mg — HAB_PHARMA, MODAFINIL, featured, POPULAR, 5 variants
    - [ ] Waklert 150mg — SUN_PHARMA, ARMODAFINIL, featured, NEW, 5 variants
    - [ ] Artvigil 150mg — HAB_PHARMA, ARMODAFINIL, not featured, SALE, 5 variants
    - [ ] Nootropic Starter Pack — SUN_PHARMA, MIX, featured, POPULAR, 2 variants (20/40 pills)
  - [ ] **Reviews** (8) — seeded with `userId: null` (seeded IDs are not real DB users)
  - [ ] **Blog Posts** (4) — correct slugs and titles from frontend seed
  - [ ] **Coupons** (3): `WELCOME10`, `BULK20`, `SAVE30`
  - [ ] **FAQ** (20 items, 5 sections):
    - [ ] About Our Products (5 items)
    - [ ] Ordering & Payment (4 items)
    - [ ] Shipping & Delivery (5 items)
    - [ ] Usage & Dosing (3 items)
    - [ ] Support (3 items)
  - [ ] **Settings** (11 keys):
    - [ ] `contact.email`, `contact.response_time`, `contact.phone`
    - [ ] `payment.bitcoin.wallet`, `payment.bitcoin.discount`
    - [ ] `payment.ethereum.wallet`, `payment.ethereum.discount`
    - [ ] `payment.zelle.recipient`, `payment.zelle.discount`
    - [ ] `payment.bill.address`, `payment.bill.instructions`
  - [ ] **Admin** (1) — hash password with `bcrypt.hash('admin123', 12)`
- [ ] Add `"prisma": { "seed": "ts-node prisma/seed.ts" }` to `package.json`
- [ ] Run `npx prisma db seed` — verify all data in DB

---

## Phase 3 — Prisma Module

- [ ] Create `src/prisma/prisma.service.ts`:
  - [ ] `extends PrismaClient`
  - [ ] Implements `OnModuleInit` → `this.$connect()`
  - [ ] Implements `OnModuleDestroy` → `this.$disconnect()`
- [ ] Create `src/prisma/prisma.module.ts`:
  - [ ] Decorated with `@Global()` — no need to re-import in every module
  - [ ] Exports `PrismaService`
- [ ] Verify `PrismaService` can be injected in a test service without errors

---

## Phase 4 — Common / Shared Infrastructure

### Decorators
- [ ] Create `src/common/decorators/public.decorator.ts` — `@Public()` sets `isPublic: true` metadata
- [ ] Create `src/common/decorators/get-user.decorator.ts` — `@GetUser()` extracts `req.user`

### Shared DTOs
- [ ] Create `src/common/dto/pagination-query.dto.ts`:
  - [ ] `page?: number` — `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@IsOptional()`, default 1
  - [ ] `limit?: number` — `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`, `@IsOptional()`, default 20
- [ ] Create `src/common/dto/paginated-response.dto.ts` — generic `PaginatedResponse<T>` with `data` + `meta`
- [ ] Create `src/common/dto/address.dto.ts` — all Address fields with class-validator decorators

### Guards
- [ ] Create `src/common/guards/jwt-auth.guard.ts`:
  - [ ] Extends `AuthGuard('jwt')`
  - [ ] Constructor injects `Reflector`
  - [ ] `canActivate` checks `@Public()` metadata first — skips JWT if found
- [ ] Create `src/common/guards/admin-jwt.guard.ts`:
  - [ ] Extends `AuthGuard('admin-jwt')`
  - [ ] No special logic needed — Passport handles it

### Filter
- [ ] Create `src/common/filters/http-exception.filter.ts`:
  - [ ] `@Catch()` — catches all exceptions (not just HttpException)
  - [ ] Extracts status from `HttpException` or defaults to 500
  - [ ] Formats response as `{ statusCode, message, error }`
  - [ ] Logs 5xx errors with `Logger`

### Interceptor
- [ ] Create `src/common/interceptors/transform.interceptor.ts`:
  - [ ] Implements `NestInterceptor`
  - [ ] `map` operator wraps response in `{ data }` unless already paginated shape `{ data, meta }`

---

## Phase 5 — App Module & Bootstrap

- [ ] Write `src/app.module.ts`:
  - [ ] `ConfigModule.forRoot({ isGlobal: true, validationSchema: Joi.object({...}) })`
  - [ ] `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }])`
  - [ ] `PrismaModule`
  - [ ] All feature modules imported (add each as they are created)
- [ ] Write `src/main.ts`:
  - [ ] `app.use(helmet())`
  - [ ] `app.use(compression())`
  - [ ] `app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true, ... })`
  - [ ] `app.setGlobalPrefix('api')`
  - [ ] `app.useGlobalPipes(new ValidationPipe({ whitelist, forbidNonWhitelisted, transform, ... }))`
  - [ ] `app.useGlobalFilters(new HttpExceptionFilter())`
  - [ ] `app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector), new TransformInterceptor())`
  - [ ] `app.useGlobalGuards(new JwtAuthGuard(reflector))`
  - [ ] Swagger setup (only when `NODE_ENV !== 'production'`) at `/api/docs`
  - [ ] `app.listen(process.env.PORT ?? 3000)`
- [ ] Run `npm run start:dev` — verify server starts on port 3000 without errors
- [ ] Verify `GET /api/docs` returns Swagger UI in browser

---

## Phase 6 — Auth Module (User)

### Strategy & Module
- [ ] Create `src/auth/strategies/jwt.strategy.ts`:
  - [ ] `PassportStrategy(Strategy, 'jwt')`
  - [ ] `jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()`
  - [ ] `secretOrKey` from `ConfigService` (`JWT_SECRET`)
  - [ ] `validate()` returns `{ userId: payload.sub, email: payload.email }`
- [ ] Create `src/auth/auth.module.ts`:
  - [ ] Imports `PassportModule.register({ defaultStrategy: 'jwt' })`
  - [ ] Imports `JwtModule.registerAsync(...)` with `JWT_SECRET` + `JWT_EXPIRES_IN` from `ConfigService`
  - [ ] Provides `AuthService`, `JwtStrategy`

### DTOs
- [ ] Create `src/auth/dto/register.dto.ts` — email (lowercase transform), password (MinLength 6), firstName, lastName
- [ ] Create `src/auth/dto/login.dto.ts` — email (lowercase transform), password
- [ ] Create `src/auth/dto/update-profile.dto.ts` — optional `savedAddress: AddressDto`
- [ ] Create `src/auth/dto/auth-response.dto.ts` — `{ token: string, user: { id, email, firstName, lastName } }`

### Service
- [ ] Create `src/auth/auth.service.ts`:
  - [ ] `register(dto)` — check email unique (throw `ConflictException` if taken), hash password, create user, return token + user
  - [ ] `login(dto)` — find user by email (throw `UnauthorizedException` if not found), compare password, return token + user
  - [ ] `getMe(userId)` — find by id, return user without `passwordHash`
  - [ ] `updateAddress(userId, dto)` — update `savedAddress` JSON field

### Controller
- [ ] Create `src/auth/auth.controller.ts`:
  - [ ] `POST /auth/register` → `@Public()`, `@HttpCode(201)`, calls `register()`
  - [ ] `POST /auth/login` → `@Public()`, `@HttpCode(200)`, calls `login()`
  - [ ] `GET /auth/me` → JWT protected, calls `getMe()`
  - [ ] `PUT /auth/me` → JWT protected, calls `updateAddress()`
  - [ ] `POST /auth/logout` → JWT protected, returns `{ message: 'Logged out' }` (client-side)

### Tests
- [ ] Write `src/auth/auth.service.spec.ts`:
  - [ ] register — happy path, duplicate email
  - [ ] login — happy path, wrong password, user not found

---

## Phase 7 — Admin Auth Module

### Strategy & Module
- [ ] Create `src/admin-auth/strategies/admin-jwt.strategy.ts`:
  - [ ] `PassportStrategy(Strategy, 'admin-jwt')` ← **different name is critical**
  - [ ] `secretOrKey` from `ConfigService` (`ADMIN_JWT_SECRET`)
  - [ ] `validate()` returns `{ adminId: payload.sub, email: payload.email }`
- [ ] Create `src/admin-auth/admin-auth.module.ts`:
  - [ ] Imports `JwtModule.registerAsync(...)` with `ADMIN_JWT_SECRET` + `ADMIN_JWT_EXPIRES_IN`
  - [ ] Provides `AdminAuthService`, `AdminJwtStrategy`

### DTOs
- [ ] Create `src/admin-auth/dto/admin-login.dto.ts`
- [ ] Create `src/admin-auth/dto/change-password.dto.ts` — `currentPassword`, `newPassword` (MinLength 6)
- [ ] Create `src/admin-auth/dto/update-admin-profile.dto.ts` — `email`

### Service
- [ ] Create `src/admin-auth/admin-auth.service.ts`:
  - [ ] `login(dto)` — find admin by email, compare password, return admin JWT token
  - [ ] `getMe(adminId)` — return admin without `passwordHash`
  - [ ] `changeEmail(adminId, dto)` — update email
  - [ ] `changePassword(adminId, dto)` — verify `currentPassword`, hash new, update

### Controller
- [ ] Create `src/admin-auth/admin-auth.controller.ts`:
  - [ ] `POST /admin/auth/login` → `@Public()`, rate-limited (`@Throttle({ default: { limit: 5, ttl: 60000 } })`)
  - [ ] `GET /admin/auth/me` → `@UseGuards(AdminJwtGuard)`
  - [ ] `PUT /admin/auth/profile` → `@UseGuards(AdminJwtGuard)`
  - [ ] `PUT /admin/auth/password` → `@UseGuards(AdminJwtGuard)`

---

## Phase 8 — Products Module

### DTOs
- [ ] Create `src/products/dto/product-filter.dto.ts` — extends `PaginationQueryDto`, adds `category?`, `search?`, `sort?`
- [ ] Create `src/products/dto/create-product.dto.ts` — all fields with `@ValidateNested`, `@ArrayMinSize(1)` on variants
- [ ] Create `src/products/dto/update-product.dto.ts` — `PartialType(CreateProductDto)`

### Service
- [ ] Create `src/products/products.service.ts`:
  - [ ] `findAll(query: ProductFilterDto)` — filter by category/search, sort, paginate, include variants
  - [ ] `findFeatured()` — filter where `featured = true`
  - [ ] `findBySlug(slug)` — include variants + reviews; throw `NotFoundException` if missing
  - [ ] `create(dto)` — create product + variants in one transaction
  - [ ] `update(id, dto)` — update product fields + upsert variants
  - [ ] `delete(id)` — cascade deletes variants (via Prisma `onDelete: Cascade`)
  - [ ] Cast `images` and `effects` as `string[]` in all returns

### Controllers
- [ ] Create `src/products/products.controller.ts`:
  - [ ] All routes `@Public()`
  - [ ] `GET /products` — calls `findAll()`
  - [ ] `GET /products/featured` — calls `findFeatured()` ← **must be before** `/:slug`
  - [ ] `GET /products/:slug` — calls `findBySlug()`
- [ ] Create `src/products/products.controller.admin.ts`:
  - [ ] `@UseGuards(AdminJwtGuard)` on class
  - [ ] `GET /admin/products`
  - [ ] `POST /admin/products` → `@HttpCode(201)`
  - [ ] `PATCH /admin/products/:id`
  - [ ] `DELETE /admin/products/:id` → `@HttpCode(204)`

### Module
- [ ] Create `src/products/products.module.ts` — declares both controllers, provides service

### Tests
- [ ] Write `src/products/products.service.spec.ts`:
  - [ ] `findAll` with filters
  - [ ] `findBySlug` — found, not found
  - [ ] `findFeatured`

---

## Phase 9 — Orders Module

### DTOs
- [ ] Create `src/orders/dto/create-order-item.dto.ts` — `productId`, `variantId`, `quantity`
- [ ] Create `src/orders/dto/create-order.dto.ts`:
  - [ ] `userId?: string`
  - [ ] `items: CreateOrderItemDto[]` with `@ValidateNested({ each: true })`, `@ArrayMinSize(1)`
  - [ ] `shippingAddress: AddressDto` with `@ValidateNested()`
  - [ ] `paymentMethod: PaymentMethod`
  - [ ] `couponCode?: string` with `@Transform` toUpperCase
  - [ ] **NO `subtotal`, `discount`, `total`** — server calculates from DB
- [ ] Create `src/orders/dto/update-order-status.dto.ts` — `status: OrderStatus`, `note?: string`
- [ ] Create `src/orders/dto/order-filter.dto.ts` — extends `PaginationQueryDto`, adds `status?`, `search?`

### Service
- [ ] Create `src/orders/orders.service.ts`:
  - [ ] `create(dto)` — full `$transaction`:
    - [ ] Fetch variant prices from DB (throw `BadRequestException` if any missing)
    - [ ] Calculate `subtotal` from DB prices × quantities
    - [ ] Apply coupon: validate existence, expiry, minOrder (correct exception types)
    - [ ] Apply payment discount: BITCOIN/ETHEREUM=15%, ZELLE=10%, BILL=0%
    - [ ] Stack discounts: `totalDiscount = couponDiscount + paymentDiscount`
    - [ ] Calculate `shipping`: subtotal >= 150 → 0, else 9.99
    - [ ] Calculate `total = subtotal - totalDiscount + shipping`
    - [ ] Generate ID: `ORD-${Date.now()}-${random5}`
    - [ ] `tx.order.create(...)` + `tx.orderStatusLog.create(fromStatus: null, toStatus: CONFIRMED)`
  - [ ] `findMine(userId)` — user's own orders sorted by `createdAt` desc
  - [ ] `findById(id)` — include items + statusLogs; public (no auth check)
  - [ ] `findAll(query)` — admin, paginated, filterable by status/search
  - [ ] `updateStatus(id, dto)` — validate transition rules, create `OrderStatusLog`, update order
  - [ ] Status transition validation helper — throw `BadRequestException` on invalid transition

### Controllers
- [ ] Create `src/orders/orders.controller.ts`:
  - [ ] `POST /orders` → `@Public()`, `@HttpCode(201)`
  - [ ] `GET /orders/mine` → JWT, **declared before** `/:id`
  - [ ] `GET /orders/:id` → `@Public()`
  - [ ] `GET /orders/:id/logs` → `@Public()`
- [ ] Create `src/orders/orders.controller.admin.ts`:
  - [ ] `@UseGuards(AdminJwtGuard)` on class
  - [ ] `GET /admin/orders`
  - [ ] `GET /admin/orders/:id`
  - [ ] `PATCH /admin/orders/:id/status`
  - [ ] `GET /admin/orders/:id/logs`

### Module
- [ ] Create `src/orders/orders.module.ts`

### Tests
- [ ] Write `src/orders/orders.service.spec.ts`:
  - [ ] `create` — price calculation, coupon discount, payment discount, discount stacking
  - [ ] `create` — expired coupon throws, minOrder not met throws, missing variant throws
  - [ ] `updateStatus` — valid transitions, invalid transition throws

---

## Phase 10 — Coupons Module

### DTOs
- [ ] Create `src/coupons/dto/validate-coupon.dto.ts` — `code`, `subtotal`
- [ ] Create `src/coupons/dto/create-coupon.dto.ts` — `code` (uppercase regex), `discount`, `type`, `minOrder`, `expiresAt` (ISO8601)
- [ ] Create `src/coupons/dto/update-coupon.dto.ts` — all optional fields

### Service
- [ ] Create `src/coupons/coupons.service.ts`:
  - [ ] `validate(dto)` — find by code, check expiry, check minOrder, return `{ valid, discountAmount, ... }`
  - [ ] `findAll()` — all coupons
  - [ ] `create(dto)` — throw `ConflictException` if code exists
  - [ ] `update(code, dto)` — throw `NotFoundException` if not found
  - [ ] `delete(code)` — throw `NotFoundException` if not found

### Controllers
- [ ] Create `src/coupons/coupons.controller.ts` — `POST /coupons/validate` → `@Public()`
- [ ] Create `src/coupons/coupons.controller.admin.ts` — full CRUD under `/admin/coupons`

### Module
- [ ] Create `src/coupons/coupons.module.ts`

### Tests
- [ ] Write `src/coupons/coupons.service.spec.ts`:
  - [ ] `validate` — valid coupon, expired, minOrder not met, not found
  - [ ] `validate` — PERCENT discount calculation
  - [ ] `validate` — FIXED discount calculation

---

## Phase 11 — Blog Module

### Service
- [ ] Create `src/blog/blog.service.ts`:
  - [ ] `findAll()` — all posts ordered by `createdAt` desc
  - [ ] `findBySlug(slug)` — throw `NotFoundException` if missing
  - [ ] `create(dto)` — throw `ConflictException` if slug exists
  - [ ] `update(id, dto)`
  - [ ] `delete(id)` — throw `NotFoundException` if missing

### Controllers + DTOs + Module
- [ ] Create `src/blog/dto/create-post.dto.ts` — all fields validated
- [ ] Create `src/blog/dto/update-post.dto.ts` — `PartialType(CreatePostDto)`
- [ ] Create `src/blog/blog.controller.ts` — `GET /blog`, `GET /blog/:slug` → `@Public()`
- [ ] Create `src/blog/blog.controller.admin.ts` — full CRUD under `/admin/blog`
- [ ] Create `src/blog/blog.module.ts`

---

## Phase 12 — FAQ Module

### Service
- [ ] Create `src/faq/faq.service.ts`:
  - [ ] `findAll()` — all items ordered by `section` + `order`
  - [ ] `findAllGrouped()` — group by section for public API response
  - [ ] `create(dto)` — `@HttpCode(201)`
  - [ ] `update(id, dto)`
  - [ ] `delete(id)` — throw `NotFoundException` if missing

### Controllers + DTOs + Module
- [ ] Create `src/faq/dto/create-faq.dto.ts` — `section`, `question`, `answer`, `order`
- [ ] Create `src/faq/dto/update-faq.dto.ts` — `PartialType(CreateFaqDto)`
- [ ] Create `src/faq/faq.controller.ts` — `GET /faq` (grouped) → `@Public()`
- [ ] Create `src/faq/faq.controller.admin.ts` — full CRUD under `/admin/faq`
- [ ] Create `src/faq/faq.module.ts`

---

## Phase 13 — Contact Module

### Service
- [ ] Create `src/contact/contact.service.ts`:
  - [ ] `create(dto)` — save submission with `read: false`
  - [ ] `findAll(readFilter?)` — optional `?read=false` filter
  - [ ] `findById(id)` — throw `NotFoundException` if missing
  - [ ] `markRead(id, read: boolean)` — toggle read status
  - [ ] `delete(id)` — throw `NotFoundException` if missing

### Controllers + DTOs + Module
- [ ] Create `src/contact/dto/create-contact.dto.ts` — name (MaxLength 100), email, subject (MaxLength 200), message (MaxLength 2000)
- [ ] Create `src/contact/contact.controller.ts` — `POST /contact` → `@Public()`, `@Throttle({ default: { limit: 3, ttl: 60000 } })`
- [ ] Create `src/contact/contact.controller.admin.ts` — GET/PATCH/DELETE under `/admin/contact`
- [ ] Create `src/contact/contact.module.ts`

---

## Phase 14 — Settings Module

### Service
- [ ] Create `src/settings/settings.service.ts`:
  - [ ] `findAll()` — all settings as key-value record
  - [ ] `findPayment()` — only `payment.*` settings
  - [ ] `bulkUpdate(dto)` — upsert each key-value pair in transaction

### Controllers + DTOs + Module
- [ ] Create `src/settings/dto/update-settings.dto.ts` — `settings: Record<string, string>`
- [ ] Create `src/settings/settings.controller.ts`:
  - [ ] `GET /settings` → `@Public()`
  - [ ] `GET /settings/payment` → `@Public()` ← **declared before** no-param route if needed
- [ ] Create `src/settings/settings.controller.admin.ts` — `GET /admin/settings`, `PUT /admin/settings`
- [ ] Create `src/settings/settings.module.ts`

---

## Phase 15 — Reviews Module

### Service
- [ ] Create `src/reviews/reviews.service.ts`:
  - [ ] `findByProduct(productId)` — ordered by `createdAt` desc
  - [ ] `create(dto, userId)` — create review, then update `product.rating` + `product.reviewCount` in transaction

### Controllers + DTOs + Module
- [ ] Create `src/reviews/dto/create-review.dto.ts` — `productId`, `title`, `body`, `rating` (Min 1, Max 5)
- [ ] Create `src/reviews/reviews.controller.ts`:
  - [ ] `GET /reviews?productId=` → `@Public()`
  - [ ] `POST /reviews` → JWT, `@HttpCode(201)`
- [ ] Create `src/reviews/reviews.module.ts`

---

## Phase 16 — Analytics Module

### Service
- [ ] Create `src/analytics/analytics.service.ts`:
  - [ ] `getOverview()` — total revenue (sum of `order.total`), total orders count, total customers count, avg order value
  - [ ] `getMonthly()` — group orders by month (last 12 months), return `{ month, revenue, orders }[]`
  - [ ] `getPaymentBreakdown()` — group by `paymentMethod`, count + revenue per method
  - [ ] `getTopProducts()` — group `orderItems` by `productId`, sum quantity + revenue, top 10

### Controller + Module
- [ ] Create `src/analytics/analytics.controller.ts`:
  - [ ] `@UseGuards(AdminJwtGuard)` on class
  - [ ] `GET /admin/analytics/overview`
  - [ ] `GET /admin/analytics/monthly`
  - [ ] `GET /admin/analytics/payment`
  - [ ] `GET /admin/analytics/products`
- [ ] Create `src/analytics/analytics.module.ts`

---

## Phase 17 — Health Module

- [ ] Create `src/health/health.controller.ts`:
  - [ ] `@Public()`
  - [ ] `GET /health` — runs `prisma.$queryRaw('SELECT 1')` to verify DB connectivity
  - [ ] Returns `{ status: 'ok', db: 'up' }` on success
- [ ] Create `src/health/health.module.ts`
- [ ] Verify `GET /api/health` returns 200

---

## Phase 18 — Rate Limiting Audit

- [ ] `POST /auth/register` — verify default 60 req/min applies
- [ ] `POST /auth/login` — add `@Throttle({ default: { limit: 5, ttl: 60000 } })`
- [ ] `POST /admin/auth/login` — add `@Throttle({ default: { limit: 5, ttl: 60000 } })`
- [ ] `POST /contact` — add `@Throttle({ default: { limit: 3, ttl: 60000 } })`
- [ ] Add `ThrottlerGuard` to `APP_GUARD` providers in `AppModule` or verify it's applied globally

---

## Phase 19 — Integration Testing

- [ ] Write `test/auth.e2e-spec.ts`:
  - [ ] `POST /api/auth/register` → 201, returns token
  - [ ] `POST /api/auth/register` duplicate → 409
  - [ ] `POST /api/auth/login` → 200, returns token
  - [ ] `POST /api/auth/login` wrong password → 401
  - [ ] `GET /api/auth/me` no token → 401
  - [ ] `GET /api/auth/me` with token → 200
- [ ] Write `test/products.e2e-spec.ts`:
  - [ ] `GET /api/products` → 200, has `data` + `meta`
  - [ ] `GET /api/products/featured` → 200
  - [ ] `GET /api/products/nonexistent-slug` → 404
  - [ ] `POST /api/admin/products` no token → 401
  - [ ] `POST /api/admin/products` with admin token → 201
- [ ] Write `test/orders.e2e-spec.ts`:
  - [ ] `POST /api/orders` valid body → 201, calculates prices server-side
  - [ ] `POST /api/orders` invalid variantId → 400
  - [ ] `GET /api/orders/:id` → 200
  - [ ] `GET /api/orders/mine` no token → 401
  - [ ] `PATCH /api/admin/orders/:id/status` invalid transition → 400

---

## Phase 20 — Final Checks

- [ ] Run `npm run build` — zero TypeScript errors
- [ ] Run `npm run test` — all unit tests pass
- [ ] Run `npm run test:e2e` — all e2e tests pass
- [ ] Test Swagger UI at `http://localhost:3000/api/docs` manually
- [ ] Test all public endpoints with a REST client (Postman/Insomnia/curl)
- [ ] Test all admin endpoints with admin JWT
- [ ] Verify `passwordHash` is never returned in any API response
- [ ] Verify order creation does NOT accept client-provided prices
- [ ] Verify `GET /orders/mine` works (not confused with `GET /orders/:id`)
- [ ] Verify invalid JWT returns 401, expired returns 401
- [ ] Verify admin JWT does NOT work on user endpoints and vice versa

---

## Phase 21 — Frontend Migration

- [ ] Update `frontend/src/db/seed.ts` — add 4 missing settings:
  - [ ] `payment.zelle.recipient`
  - [ ] `payment.zelle.discount` = `10`
  - [ ] `payment.bill.address`
  - [ ] `payment.bill.instructions`
- [ ] Create `frontend/src/services/api.ts` — axios instance with `baseURL: import.meta.env.VITE_API_URL`
- [ ] Add `VITE_API_URL=http://localhost:3000/api` to `frontend/.env`
- [ ] Migrate `authStore` — replace Dexie calls with `POST /auth/login`, `POST /auth/register`, store JWT in localStorage
- [ ] Migrate `adminStore` — replace with `POST /admin/auth/login`, store admin JWT
- [ ] Migrate `productService.ts` — replace all `db.products.*` calls with API calls
- [ ] Migrate `orderService.ts` — replace all `db.orders.*` calls with API calls
- [ ] Migrate `CheckoutPage.tsx` — remove `subtotal` and `discount` from order POST body
- [ ] Update all `GET /orders/my` → `GET /orders/mine`
- [ ] Migrate `BlogPage`, `FAQPage`, `ContactPage`, `SettingsPage` — replace Dexie with API
- [ ] Update React Query `queryFn` functions in all pages to call API
- [ ] Verify admin panel works end-to-end with real backend
- [ ] Remove all `import { db } from '@/db/database'` from non-seed files
- [ ] Run `npm run build` in frontend — zero TypeScript errors
- [ ] Run `npm run test:run` in frontend — all 70 tests still pass

---

## Progress Summary

| Phase | Description | Status |
|---|---|---|
| 1 | Project Setup | ⬜ |
| 2 | Prisma & Database | ⬜ |
| 3 | Prisma Module | ⬜ |
| 4 | Common Infrastructure | ⬜ |
| 5 | App Module & Bootstrap | ⬜ |
| 6 | Auth Module | ⬜ |
| 7 | Admin Auth Module | ⬜ |
| 8 | Products Module | ⬜ |
| 9 | Orders Module | ⬜ |
| 10 | Coupons Module | ⬜ |
| 11 | Blog Module | ⬜ |
| 12 | FAQ Module | ⬜ |
| 13 | Contact Module | ⬜ |
| 14 | Settings Module | ⬜ |
| 15 | Reviews Module | ⬜ |
| 16 | Analytics Module | ⬜ |
| 17 | Health Module | ⬜ |
| 18 | Rate Limiting Audit | ⬜ |
| 19 | Integration Testing | ⬜ |
| 20 | Final Checks | ⬜ |
| 21 | Frontend Migration | ⬜ |
