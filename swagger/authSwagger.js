/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: APIs for user Authentication
 */
/**
 * @swagger
 * tags:
 *   name: movie
 *   description: Movie Api's
 */
/**
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               contact_no:
 *                 type: integer
 *               address:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, admin] 
 *     responses:
 *       406:
 *        description: validation error
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal Server Error
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
  *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request      
 *       500:
 *         description: Internal Server Error
 * /forgotpassword:
 *   post:
 *     summary: for reset-password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: otp sended
 *       406:
 *         description: validation error
 *       400:
 *         description: Bad request
 * /resetpassword:
 *   post:
 *     summary: for reset-password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: password changed
 *       406:
 *         description: validation error
 *       500:
 *         description: Internal server Error
 *       400:
 *         description: otp is not match
 * 
 */
/**
 * @swagger
 * /movie:
 *   post:
 *     summary: add movie
 *     tags: [movie]
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Authorization header
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie_name:
 *                 type: string
 *               release_date:
 *                 type: string
 *                 format: date
 *               genre:
 *                 type: string
 *                 enum: ["Action", 'Drama', 'Horror', 'Thriller', 'Science fiction'] 
 *               movie_title:
 *                 type: string
 *                 format: binary
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     produces:
 *       - image/png
 *     responses:
 *       406:
 *        description: validation error
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * securityDefinitions:
 *   ApiKeyAuth:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 *     description: Bearer token for authentication. Add "Bearer " before the token.
 */
