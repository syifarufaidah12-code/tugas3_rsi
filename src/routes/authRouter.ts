import { Router } from 'express';
import { AuthController } from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { loginBodySchema, registerBodySchema } from '../schemas/authSchema.ts';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/register', validate(registerBodySchema, 'body'), (req, res) => {
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: {
             type: 'object',
             required: ['name', 'email', 'password'],
             properties: {
               name: { type: 'string', example: 'Budi Santoso' },
               email: { type: 'string', example: 'budi@student.test' },
               password: { type: 'string', example: 'rahasia123' }
             }
           }
         }
       }
     }
  */
  // #swagger.responses[201] = { description: 'Akun dibuat (role customer)' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return authController.register(req, res);
});

authRouter.post('/login', validate(loginBodySchema, 'body'), (req, res) => {
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: {
             type: 'object',
             required: ['email', 'password'],
             properties: {
               email: { type: 'string', example: 'admin@kantin.test' },
               password: { type: 'string', example: 'rahasia123' }
             }
           }
         }
       }
     }
  */
  // #swagger.responses[200] = { description: 'Login berhasil, mengembalikan token JWT' }
  // #swagger.responses[401] = { description: 'Email atau password salah' }
  return authController.login(req, res);
});

authRouter.get('/me', authenticate, (req, res) => {
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.responses[200] = { description: 'Data user yang sedang login' }
  // #swagger.responses[401] = { description: 'Token tidak ada / tidak valid' }
  return authController.me(req, res);
});

export { authRouter };