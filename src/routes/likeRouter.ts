import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  // #swagger.tags = ['Likes']
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { type: 'object' },
           example: { reviewId: 1, userId: 2 }
         }
       }
     }
  */
  // #swagger.responses[201] = { description: 'Like dibuat' }
  // #swagger.responses[409] = { description: 'User sudah menyukai review ini' }
  return likeController.createLike(req, res);
});

likeRouter.delete('/:id', (req, res) => {
  // #swagger.tags = ['Likes']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Like terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return likeController.deleteLike(req, res);
});

export { likeRouter };
