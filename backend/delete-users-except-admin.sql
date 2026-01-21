-- Delete users except admin
SET QUOTED_IDENTIFIER ON;
GO

-- First, get the admin user ID
DECLARE @AdminId INT;
DECLARE @AdminEmail NVARCHAR(256);
SELECT @AdminId = Id, @AdminEmail = Email FROM AspNetUsers WHERE Email = 'admin@gmail.com';

-- Delete related data for non-admin users
-- Delete OTP verifications for non-admin users
DELETE FROM OtpVerifications 
WHERE Email != @AdminEmail;

-- Delete refresh tokens for non-admin users
DELETE FROM RefreshTokens 
WHERE UserId != @AdminId;

-- Delete reviews from non-admin users
DELETE FROM Reviews 
WHERE UserId != @AdminId;

-- Delete order items for orders of non-admin users
DELETE FROM OrderItems 
WHERE OrderId IN (SELECT Id FROM Orders WHERE UserId != @AdminId);

-- Delete orders of non-admin users
DELETE FROM Orders 
WHERE UserId != @AdminId;

-- Delete watches sold by non-admin users
DELETE FROM WatchImages 
WHERE WatchId IN (SELECT Id FROM Watches WHERE SellerId != @AdminId AND SellerId IS NOT NULL);

DELETE FROM Watches 
WHERE SellerId != @AdminId AND SellerId IS NOT NULL;

-- Delete user roles for non-admin users
DELETE FROM AspNetUserRoles 
WHERE UserId != @AdminId;

-- Delete user claims for non-admin users
DELETE FROM AspNetUserClaims 
WHERE UserId != @AdminId;

-- Delete user logins for non-admin users
DELETE FROM AspNetUserLogins 
WHERE UserId != @AdminId;

-- Delete user tokens for non-admin users
DELETE FROM AspNetUserTokens 
WHERE UserId != @AdminId;

-- Finally, delete non-admin users
DELETE FROM AspNetUsers 
WHERE Id != @AdminId;

-- Show remaining users
SELECT Id, Email, UserName, FullName FROM AspNetUsers;
