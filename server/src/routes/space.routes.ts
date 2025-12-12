import { Router } from 'express';
import { createSpace, getSpace, deleteSpace, updateSettings,createPublicLink } from '../controller/space.controller.js';
import { requirePerms } from '../middleware/perms.js';
import { Perms } from '../types/perms.js';
import { createSpaceLimiter } from '../config/ratelimiter.js';
import { validate } from '../middleware/validate.js';
import { updateSettingsSchema } from '../schema/space.schema.js';

const router = Router();

router.post('/', createSpaceLimiter, createSpace);

router.get('/', requirePerms(Perms.READ), getSpace);
router.delete('/', requirePerms(Perms.CONFIG), deleteSpace);
router.patch('/',requirePerms(Perms.CONFIG),validate(updateSettingsSchema),updateSettings);
router.post('/share', requirePerms(Perms.CONFIG), createPublicLink);

export default router;