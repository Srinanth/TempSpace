import { Router } from 'express';
import { getUploadUrl, confirmUpload, listFiles,downloadFile } from '../controller/file.controller.js';
import { requirePerms } from '../middleware/perms.js';
import { Perms } from '../types/perms.js';

const router = Router();

router.post('/upload-url', requirePerms(Perms.UPLOAD), getUploadUrl);

router.post('/confirm', requirePerms(Perms.UPLOAD), confirmUpload);

router.get('/', requirePerms(Perms.READ), listFiles);

router.get('/:fileId/download', requirePerms(Perms.READ), downloadFile);

export default router;