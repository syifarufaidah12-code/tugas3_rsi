import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.parameters['role']  = { in: 'query', type: 'string', description: 'admin | owner | customer' }
  // #swagger.parameters['page']  = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit'] = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar user' }
  return userController.getUsers(req, res);
});

userRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail user' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return userController.getUserById(req, res);
});

userRouter.post('/', (req, res) => {
  // #swagger.tags = ['Users']
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { type: 'object' },
           example: { name: 'Budi Santoso', email: 'budi@example.com', password: 'rahasia123', role: 'customer' }
         }
       }
     }
  */
  // #swagger.responses[201] = { description: 'User dibuat' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return userController.createUser(req, res);
});

export { userRouter };
