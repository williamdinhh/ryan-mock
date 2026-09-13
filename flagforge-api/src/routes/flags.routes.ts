import { Router } from 'express';
import * as controller from '../controllers/flags.controller';

const router = Router();

router.get('/', controller.listFlags);
router.get('/:key', controller.getFlag);
router.post('/', controller.createFlag);
router.patch('/:key', controller.updateFlag);
router.post('/:key/evaluate', controller.evaluateFlag);

export default router;
