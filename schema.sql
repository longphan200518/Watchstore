IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [AspNetRoles] (
    [Id] int NOT NULL IDENTITY,
    [CreatedAt] datetime2 NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id] int NOT NULL IDENTITY,
    [FullName] nvarchar(max) NOT NULL,
    [DateOfBirth] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [IsDeleted] bit NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);

CREATE TABLE [Brands] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Logo] nvarchar(max) NOT NULL,
    [Country] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Brands] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] int NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] int NOT NULL,
    [RoleId] int NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] int NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [Status] int NOT NULL,
    [ShippingAddress] nvarchar(max) NOT NULL,
    [PhoneNumber] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Watches] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(300) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [StockQuantity] int NOT NULL,
    [BrandId] int NOT NULL,
    [Status] int NOT NULL,
    [CaseSize] nvarchar(max) NOT NULL,
    [Movement] nvarchar(max) NOT NULL,
    [WaterResistance] nvarchar(max) NOT NULL,
    [SellerId] int NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Watches] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Watches_AspNetUsers_SellerId] FOREIGN KEY ([SellerId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL,
    CONSTRAINT [FK_Watches_Brands_BrandId] FOREIGN KEY ([BrandId]) REFERENCES [Brands] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [WatchId] int NOT NULL,
    [Quantity] int NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_Watches_WatchId] FOREIGN KEY ([WatchId]) REFERENCES [Watches] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [WatchImages] (
    [Id] int NOT NULL IDENTITY,
    [WatchId] int NOT NULL,
    [ImageUrl] nvarchar(max) NOT NULL,
    [IsPrimary] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_WatchImages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_WatchImages_Watches_WatchId] FOREIGN KEY ([WatchId]) REFERENCES [Watches] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);

CREATE INDEX [IX_OrderItems_WatchId] ON [OrderItems] ([WatchId]);

CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);

CREATE INDEX [IX_Watches_BrandId] ON [Watches] ([BrandId]);

CREATE INDEX [IX_Watches_SellerId] ON [Watches] ([SellerId]);

CREATE INDEX [IX_WatchImages_WatchId] ON [WatchImages] ([WatchId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251205194751_InitialCreate', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
DECLARE @var nvarchar(max);
SELECT @var = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Brands]') AND [c].[name] = N'Logo');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [Brands] DROP CONSTRAINT ' + @var + ';');
ALTER TABLE [Brands] DROP COLUMN [Logo];

DECLARE @var1 nvarchar(max);
SELECT @var1 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Orders]') AND [c].[name] = N'PhoneNumber');
IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Orders] DROP CONSTRAINT ' + @var1 + ';');
ALTER TABLE [Orders] ALTER COLUMN [PhoneNumber] nvarchar(max) NULL;

ALTER TABLE [Orders] ADD [Notes] nvarchar(max) NULL;

DECLARE @var2 nvarchar(max);
SELECT @var2 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Brands]') AND [c].[name] = N'Description');
IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Brands] DROP CONSTRAINT ' + @var2 + ';');
ALTER TABLE [Brands] ALTER COLUMN [Description] nvarchar(max) NULL;

DECLARE @var3 nvarchar(max);
SELECT @var3 = QUOTENAME([d].[name])
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Brands]') AND [c].[name] = N'Country');
IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Brands] DROP CONSTRAINT ' + @var3 + ';');
ALTER TABLE [Brands] ALTER COLUMN [Country] nvarchar(max) NULL;

ALTER TABLE [Brands] ADD [LogoUrl] nvarchar(max) NULL;

ALTER TABLE [AspNetUsers] ADD [Address] nvarchar(max) NULL;

CREATE INDEX [IX_Watches_BrandId_Status] ON [Watches] ([BrandId], [Status]);

CREATE INDEX [IX_Watches_Name] ON [Watches] ([Name]);

CREATE INDEX [IX_Watches_Price] ON [Watches] ([Price]);

CREATE INDEX [IX_Watches_Status] ON [Watches] ([Status]);

CREATE INDEX [IX_Orders_CreatedAt] ON [Orders] ([CreatedAt]);

CREATE INDEX [IX_Orders_Status] ON [Orders] ([Status]);

CREATE INDEX [IX_Brands_Name] ON [Brands] ([Name]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251205203918_UpdateEntitiesSchema', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
DROP INDEX [IX_Watches_BrandId_Status] ON [Watches];

DROP INDEX [IX_Watches_Name] ON [Watches];

DROP INDEX [IX_Watches_Price] ON [Watches];

DROP INDEX [IX_Watches_Status] ON [Watches];

DROP INDEX [IX_Orders_CreatedAt] ON [Orders];

DROP INDEX [IX_Orders_Status] ON [Orders];

DROP INDEX [IX_Brands_Name] ON [Brands];

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251206072150_UpdateModels', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [AspNetUsers] ADD [EmailConfirmedAt] datetime2 NULL;

ALTER TABLE [AspNetUsers] ADD [PasswordResetToken] nvarchar(max) NULL;

ALTER TABLE [AspNetUsers] ADD [PasswordResetTokenExpiry] datetime2 NULL;

CREATE TABLE [OtpVerifications] (
    [Id] int NOT NULL IDENTITY,
    [Email] nvarchar(255) NOT NULL,
    [Otp] nvarchar(10) NOT NULL,
    [ExpiresAt] datetime2 NOT NULL,
    [Attempts] int NOT NULL,
    [MaxAttempts] int NOT NULL,
    [IsVerified] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [Type] nvarchar(50) NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_OtpVerifications] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_OtpVerifications_Email] ON [OtpVerifications] ([Email]);

CREATE INDEX [IX_OtpVerifications_Email_Type] ON [OtpVerifications] ([Email], [Type]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251206175826_AddEmailVerificationAndPasswordReset', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [RefreshTokens] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Token] nvarchar(512) NOT NULL,
    [ExpiresAt] datetime2 NOT NULL,
    [IsRevoked] bit NOT NULL,
    [RevokedAt] datetime2 NULL,
    [RememberMe] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id])
);

CREATE UNIQUE INDEX [IX_RefreshTokens_Token] ON [RefreshTokens] ([Token]);

CREATE INDEX [IX_RefreshTokens_UserId] ON [RefreshTokens] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251206182706_AddRefreshTokens', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [Reviews] (
    [Id] int NOT NULL IDENTITY,
    [WatchId] int NOT NULL,
    [UserId] int NOT NULL,
    [Rating] int NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Content] nvarchar(2000) NOT NULL,
    [IsVerified] bit NOT NULL,
    [HelpfulCount] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reviews_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reviews_Watches_WatchId] FOREIGN KEY ([WatchId]) REFERENCES [Watches] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);

CREATE INDEX [IX_Reviews_WatchId] ON [Reviews] ([WatchId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251207113442_AddReviewTable', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Watches] ADD [BandMaterial] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Watches] ADD [BandWidth] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Watches] ADD [CaseMaterial] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Watches] ADD [Crystal] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Watches] ADD [Functions] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Watches] ADD [Thickness] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Watches] ADD [Warranty] nvarchar(max) NOT NULL DEFAULT N'';

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251207195232_AddWatchSpecificationFields', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [WebsiteSettings] (
    [Id] int NOT NULL IDENTITY,
    [Key] nvarchar(100) NOT NULL,
    [Value] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Category] nvarchar(50) NOT NULL,
    [DataType] nvarchar(20) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_WebsiteSettings] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_WebsiteSettings_Category] ON [WebsiteSettings] ([Category]);

CREATE UNIQUE INDEX [IX_WebsiteSettings_Key] ON [WebsiteSettings] ([Key]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251226050839_AddWebsiteSettings', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [Coupons] (
    [Id] int NOT NULL IDENTITY,
    [Code] nvarchar(50) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [DiscountType] int NOT NULL,
    [DiscountValue] decimal(18,2) NOT NULL,
    [MinimumOrderValue] decimal(18,2) NULL,
    [MaximumDiscountAmount] decimal(18,2) NULL,
    [MaxUsageCount] int NULL,
    [MaxUsagePerUser] int NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [IsActive] bit NOT NULL,
    [UsageCount] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_Coupons] PRIMARY KEY ([Id])
);

CREATE TABLE [CouponUsages] (
    [Id] int NOT NULL IDENTITY,
    [CouponId] int NOT NULL,
    [UserId] int NOT NULL,
    [OrderId] int NOT NULL,
    [DiscountAmount] decimal(18,2) NOT NULL,
    [UsedAt] datetime2 NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [IsDeleted] bit NOT NULL,
    CONSTRAINT [PK_CouponUsages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CouponUsages_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_CouponUsages_Coupons_CouponId] FOREIGN KEY ([CouponId]) REFERENCES [Coupons] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_CouponUsages_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE NO ACTION
);

CREATE UNIQUE INDEX [IX_Coupons_Code] ON [Coupons] ([Code]);

CREATE INDEX [IX_Coupons_IsActive] ON [Coupons] ([IsActive]);

CREATE INDEX [IX_CouponUsages_CouponId_UserId] ON [CouponUsages] ([CouponId], [UserId]);

CREATE INDEX [IX_CouponUsages_OrderId] ON [CouponUsages] ([OrderId]);

CREATE INDEX [IX_CouponUsages_UserId] ON [CouponUsages] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260102184339_AddCouponSystem', N'10.0.0');

COMMIT;
GO

