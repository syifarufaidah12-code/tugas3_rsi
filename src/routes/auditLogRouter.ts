import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';

const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.get('/', (req, res) => {
  // #swagger.tags = ['Audit Logs']
  // #swagger.parameters['userId']      = { in: 'query', type: 'integer' }
  // #swagger.parameters['action']      = { in: 'query', type: 'string' }
  // #swagger.parameters['targetTable'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']        = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']       = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar audit log beserta data user (JOIN)' }
  return auditLogController.getAuditLogs(req, res);
});

auditLogRouter.get('/:id', (req, res) => {
  // #swagger.tags = ['Audit Logs']
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail audit log' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return auditLogController.getAuditLogById(req, res);
});

auditLogRouter.post('/', (req, res) => {
  // #swagger.tags = ['Audit Logs']
  /* #swagger.requestBody = {
       required: true,
       content: {
         'application/json': {
           schema: { type: 'object' },
           example: { userId: 1, action: 'UPDATE', targetTable: 'STALLS', targetId: 1, metadata: { note: 'ubah nama warung' } }
         }
       }
     }
  */
  // #swagger.responses[201] = { description: 'Audit log dibuat' }
  return auditLogController.createAuditLog(req, res);
});

export { auditLogRouter };
