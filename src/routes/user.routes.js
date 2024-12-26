import express from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  validateUser,
  verifyRefreshToken,
} from "../controllers/user.controller.js";
import {
  createOrUpdateProfile,
  getProfile,
} from "../controllers/userProfile.controller.js";
import authentication from "../middlewares/authentication.middleware.js";

const userRouter = express.Router();

//User Authentication

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with provided details.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Jhon"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "jhondoe@example.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 */

userRouter.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns a token upon successful login.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *                 description: The registered email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: The user's account password.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: hsioashdjhaisjjw2147263y78whasjhfu
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Invalid credentials or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */

userRouter.post("/login", loginUser);

/**
 * @swagger
 * /users/forgot-password:
 *   get:
 *     summary: Request a password reset link
 *     description: Sends a password reset link to the user's registered email address.
 *     tags:
 *       - User Authentication
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The email address associated with the user's account.
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Password reset link has been sent to your email.
 *       400:
 *         description: Invalid email or missing email query parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email address
 *       404:
 *         description: User not found with the provided email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
userRouter.get("/forgot-password", forgotPassword);

/**
 * @swagger
 * /users/reset-password/{token}:
 *   post:
 *     summary: Reset the user's password
 *     description: Resets the user's password using the provided reset token.
 *     tags:
 *       - User Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset token sent to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newpassword123
 *                 description: The new password for the user account.
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: A password changed successfully!
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or expired reset token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */

userRouter.post("/reset-password/:token", resetPassword);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh the access token
 *     description: Refreshes the access token using the refresh token sent either in the request body or cookies.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         schema:
 *           type: string
 *         required: false
 *         description: The refresh token stored in a cookie.
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token successfully refreshed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *
 *                      accessToken:
 *                       type: string
 *                       description: The new access token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *                      refreshToken:
 *                       type: string
 *                       description: The new refresh token.
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 message:
 *                   type: string
 *                   example: "Token refreshed successfully."
 *       400:
 *         description: Bad request or missing refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Refresh token is required."
 *       401:
 *         description: Unauthorized or invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token."
 */

userRouter.post("/refresh-token", verifyRefreshToken);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Log out the user
 *     description: Logs out the authenticated user by invalidating their session or token.
 *     tags:
 *       - User Authentication
 *     security:
 *       - cookieAuth: [] # If using cookies for authentication
 *     responses:
 *       200:
 *         description: Successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Successfully logged out."
 *       401:
 *         description: Unauthorized request. User not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Authentication required."
 */

userRouter.get("/logout", authentication, logoutUser);

userRouter.get("/validate", authentication, validateUser);

// User Profile
/**
 * @swagger
 * /users/create-profile:
 *   post:
 *     summary: Create a new user profile
 *     description: This endpoint allows the user to create a profile with billing address and phone number.
 *     tags:
 *       - User Profile
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "403, Apt 4th Ave"
 *                   city:
 *                     type: string
 *                     example: "Mumbai"
 *                   state:
 *                     type: string
 *                     example: "Maharashtra"
 *                   country:
 *                     type: string
 *                     example: "India"
 *                   postalCode:
 *                     type: integer
 *                     example: 400065
 *               phoneNumber:
 *                 type: integer
 *                 example: 9635841361
 *     responses:
 *       200:
 *         description: User profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     phoneNumber:
 *                       type: string
 *                       example: "9635841361"
 *                     billingAddress:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "403, Apt 4th Ave"
 *                         city:
 *                           type: string
 *                           example: "Mumbai"
 *                         state:
 *                           type: string
 *                           example: "Maharashtra"
 *                         postalCode:
 *                           type: string
 *                           example: "400065"
 *                         country:
 *                           type: string
 *                           example: "India"
 *                         _id:
 *                           type: string
 *                           example: "672891142d40d60ff96d9aae"
 *                     owner:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     _id:
 *                       type: string
 *                       example: "672891142d40d60ff96d9aad"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-04T09:17:08.294Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-04T09:17:08.294Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 message:
 *                   type: string
 *                   example: "User profile created successfully!"
 */

userRouter.post("/create-profile", authentication, createOrUpdateProfile);

/**
 * @swagger
 * /users/update-profile:
 *   post:
 *     summary: Update a user profile
 *     description: Updates an existing user profile for the authenticated user.
 *     tags:
 *       - User Profile
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               billingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "403, Apt 4th Ave"
 *                   city:
 *                     type: string
 *                     example: "Mumbai"
 *                   state:
 *                     type: string
 *                     example: "Maharashtra"
 *                   country:
 *                     type: string
 *                     example: "India"
 *                   postalCode:
 *                     type: integer
 *                     example: 400065
 *               phoneNumber:
 *                 type: integer
 *                 example: 9635841361
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     phoneNumber:
 *                       type: string
 *                       example: "9635841361"
 *                     billingAddress:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "403, Apt 4th Ave"
 *                         city:
 *                           type: string
 *                           example: "Mumbai"
 *                         state:
 *                           type: string
 *                           example: "Maharashtra"
 *                         postalCode:
 *                           type: string
 *                           example: "400065"
 *                         country:
 *                           type: string
 *                           example: "India"
 *                         _id:
 *                           type: string
 *                           example: "672891142d40d60ff96d9aae"
 *                     owner:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     _id:
 *                       type: string
 *                       example: "672891142d40d60ff96d9aad"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-04T09:17:08.294Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-04T09:17:08.294Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 message:
 *                   type: string
 *                   example: "User profile updated successfully!"
 */
userRouter.put("/update-profile", authentication, createOrUpdateProfile);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile of the authenticated user.
 *     tags:
 *       - User Profile
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     phoneNumber:
 *                       type: string
 *                       example: "9635841361"
 *                     billingAddress:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "403, Apt 4th Ave"
 *                         city:
 *                           type: string
 *                           example: "Mumbai"
 *                         state:
 *                           type: string
 *                           example: "Maharashtra"
 *                         postalCode:
 *                           type: string
 *                           example: "400065"
 *                         country:
 *                           type: string
 *                           example: "India"
 *                         _id:
 *                           type: string
 *                           example: "672891142d40d60ff96d9aae"
 *                     owner:
 *                       type: string
 *                       example: "672880131e56545fdaec6bba"
 *                     _id:
 *                       type: string
 *                       example: "672891142d40d60ff96d9aad"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-04T09:17:08.294Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-11-04T09:17:08.294Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 message:
 *                   type: string
 *                   example: "User profile retrieved successfully!"
 */

userRouter.get("/profile", authentication, getProfile);

export default userRouter;


