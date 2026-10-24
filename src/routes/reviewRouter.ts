import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.parameters['stallId'] = { in: 'query', type: 'integer' }
  // #swagger.parameters['userId']  = { in: 'query', type: 'integer' }
  // #swagger.parameters['page']    = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']   = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar review beserta data user (JOIN)' }
  return reviewController.getReviews(req, res);
});

reviewRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail review beserta data user (JOIN)' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return reviewController.getReviewById(req, res);
});

reviewRouter.post('/', (req, res) => {
  // #swagger.tags = ['Reviews']
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { type: 'object' },
           example: { stallId: 1, userId: 1, rating: 5, comment: 'Enak dan porsinya banyak' }
         }
       }
     }
  */
  // #swagger.responses[201] = { description: 'Review dibuat' }
  return reviewController.createReview(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Review terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return reviewController.deleteReview(req, res);
});

export { reviewRouter };
