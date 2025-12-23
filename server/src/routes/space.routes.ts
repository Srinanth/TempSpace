import { Router } from 'express';
import { createSpace, getSpace, deleteSpace, updateSettings,createPublicLink, joinSpace, unlockSpaceProxy, trackVisit } from '../controller/space.controller.js';
import { requirePerms } from '../middleware/perms.js';
import { Perms } from '../types/perms.js';
import { createSpaceLimiter } from '../config/ratelimiter.js';
import { validate } from '../middleware/validate.js';
import { joinSpaceSchema, unlockSpaceSchema, updateSettingsSchema } from '../schema/space.schema.js';

const router = Router();

router.post('/', createSpaceLimiter, createSpace);

router.get('/', requirePerms(Perms.READ), getSpace);
router.delete('/', requirePerms(Perms.CONFIG), deleteSpace);
router.patch('/',requirePerms(Perms.CONFIG),validate(updateSettingsSchema),updateSettings);
router.post('/share', requirePerms(Perms.CONFIG), createPublicLink);
router.post('/join',validate(joinSpaceSchema), joinSpace);
router.post('/unlock', validate(unlockSpaceSchema), unlockSpaceProxy);
router.post('/visit', requirePerms(Perms.READ), trackVisit);
export default router;  