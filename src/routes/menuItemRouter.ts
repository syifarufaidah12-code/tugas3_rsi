import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.parameters['stallId']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['search']      = { in: 'query', type: 'string' }
  // #swagger.parameters['isAvailable'] = { in: 'query', type: 'boolean' }
  // #swagger.parameters['page']        = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']       = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu beserta data warung (JOIN)' }
  return menuItemController.getMenuItems(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail menu beserta data warung (JOIN)' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.getMenuItemById(req, res);
});

menuItemRouter.post('/', (req, res) => {
  // #swagger.tags = ['Menu Items']
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { type: 'object' },
           example: { stallId: 1, name: 'Nasi Goreng', price: 15000, isAvailable: true }
         }
       }
     }
  */
  // #swagger.responses[201] = { description: 'Menu dibuat' }
  return menuItemController.createMenuItem(req, res);
});

menuItemRouter.put('/:id', (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { type: 'object' },
           example: { name: 'Nasi Goreng Spesial', price: 18000, isAvailable: true }
         }
       }
     }
  */
  // #swagger.responses[200] = { description: 'Menu ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Menu terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };
