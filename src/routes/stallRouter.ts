import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';
import {
  createStallBodySchema,
  listStallsQuerySchema,
  stallIdParamsSchema,
  updateStallBodySchema,
} from '../schemas/stallSchema.ts';
import { createReviewBodySchema } from '../schemas/reviewSchema.ts';

const stallRouter = Router();
const stallController = new StallController();

// PUBLIK
stallRouter.get('/', validate(listStallsQuerySchema, 'query'), (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  return stallController.getStalls(req, res);
});

// owner, admin
stallRouter.post(
  '/',
  authenticate,
  authorize('owner', 'admin'),
  validate(createStallBodySchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    /* #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/StallInput' }
           }
         }
       }
    */
    // #swagger.responses[201] = { description: 'Warung dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada / tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak diizinkan' }
    return stallController.createStall(req, res);
  },
);

// PUBLIK
stallRouter.get('/:id', validate(stallIdParamsSchema, 'params'), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

// owner (hanya miliknya), admin
stallRouter.put(
  '/:id',
  authenticate,
  authorize('owner', 'admin'),
  validate(stallIdParamsSchema, 'params'),
  validate(updateStallBodySchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    /* #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/StallInput' }
           }
         }
       }
    */
    // #swagger.responses[200] = { description: 'Warung ter-update' }
    // #swagger.responses[401] = { description: 'Token tidak ada / tidak valid' }
    // #swagger.responses[403] = { description: 'Bukan pemilik warung / role tidak diizinkan' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.updateStall(req, res);
  },
);

// admin saja
stallRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(stallIdParamsSchema, 'params'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Warung terhapus' }
    // #swagger.responses[401] = { description: 'Token tidak ada / tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.deleteStall(req, res);
  },
);

stallRouter.get('/:id/menus', validate(stallIdParamsSchema, 'params'), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

// semua role yang login
stallRouter.post(
  '/:id/reviews',
  authenticate,
  validate(stallIdParamsSchema, 'params'),
  validate(createReviewBodySchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    /* #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: {
               type: 'object',
               required: ['rating'],
               properties: {
                 rating: { type: 'integer', example: 5 },
                 comment: { type: 'string', example: 'Enak dan murah' }
               }
             }
           }
         }
       }
    */
    // #swagger.responses[201] = { description: 'Review dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ada / tidak valid' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    return stallController.createReview(req, res);
  },
);

export { stallRouter };