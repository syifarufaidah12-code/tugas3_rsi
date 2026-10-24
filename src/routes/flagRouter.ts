import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.tags = ['Flags']
  // #swagger.parameters['status'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']   = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']  = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar laporan review beserta pelapor dan review (JOIN)' }
  return flagController.getFlags(req, res);
});

flagRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['Flags']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail laporan' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return flagController.getFlagById(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.tags = ['Flags']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { type: 'object' },
           example: { status: 'resolved' }
         }
       }
     }
  */
  // #swagger.responses[200] = { description: 'Status laporan ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return flagController.updateFlagStatus(req, res);
});

export { flagRouter };
