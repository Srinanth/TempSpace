import { Router } from 'express';
import { createSpace, getSpace, deleteSpace } from '../controller/space.controller.js';
import { requirePerms } from '../middleware/perms.js';
import { Perms } from '../types/perms.js';

const router = Router();

router.post('/', createSpace);

router.get('/', requirePerms(Perms.READ), getSpace);
router.delete('/', requirePerms(Perms.CONFIG), deleteSpace);

export default router;