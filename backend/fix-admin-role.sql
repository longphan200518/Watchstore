-- Script to assign Admin role to admin@gmail.com account

-- Step 1: Get User ID
DECLARE @UserId INT
DECLARE @RoleId INT

SELECT @UserId = Id FROM AspNetUsers WHERE Email = 'admin@gmail.com'
SELECT @RoleId = Id FROM AspNetRoles WHERE Name = 'Admin'

-- Step 2: Check if user-role mapping exists
IF NOT EXISTS (SELECT 1 FROM AspNetUserRoles WHERE UserId = @UserId AND RoleId = @RoleId)
BEGIN
    -- Step 3: Add Admin role to user
    INSERT INTO AspNetUserRoles (UserId, RoleId)
    VALUES (@UserId, @RoleId)
    
    PRINT 'Admin role assigned successfully to admin@gmail.com'
END
ELSE
BEGIN
    PRINT 'User already has Admin role'
END

-- Verify the result
SELECT 
    u.Email,
    u.FullName,
    r.Name as RoleName
FROM AspNetUsers u
INNER JOIN AspNetUserRoles ur ON u.Id = ur.UserId
INNER JOIN AspNetRoles r ON ur.RoleId = r.Id
WHERE u.Email = 'admin@gmail.com'
