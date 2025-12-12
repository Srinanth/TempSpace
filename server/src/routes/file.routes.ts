import { Router } from 'express';
import { getUploadUrl, confirmUpload, listFiles,downloadFile } from '../controller/file.controller.js';
import { requirePerms } from '../middleware/perms.js';
import { Perms } from '../types/perms.js';
import { validate } from '../middleware/validate.js';
import { uploadUrlSchema, confirmUploadSchema, downloadSchema } from '../schema/file.schema.js';

const router = Router();

router.post('/upload-url',requirePerms(Perms.UPLOAD),validate(uploadUrlSchema),getUploadUrl);
router.post('/confirm',requirePerms(Perms.UPLOAD),validate(confirmUploadSchema),confirmUpload);
router.get('/', requirePerms(Perms.READ), listFiles);
router.get('/:fileId/download',requirePerms(Perms.READ),validate(downloadSchema),downloadFile);

export default router;