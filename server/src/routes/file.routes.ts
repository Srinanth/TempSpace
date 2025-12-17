import { Router } from 'express';
import { listFiles, downloadFile,deleteFile,previewFile, uploadFileProxy} from '../controller/file.controller.js';
import { requirePerms } from '../middleware/perms.js';
import { Perms } from '../types/perms.js';
import { validate } from '../middleware/validate.js';
import { fileIdSchema } from '../schema/file.schema.js'; 

const router = Router();


router.get('/', requirePerms(Perms.READ), listFiles);
router.get('/:fileId/download',requirePerms(Perms.READ),validate(fileIdSchema),downloadFile);
router.get('/:fileId/preview', requirePerms(Perms.READ), validate(fileIdSchema), previewFile);
router.post('/upload', requirePerms(Perms.UPLOAD), uploadFileProxy);
router.delete('/:fileId', requirePerms(Perms.DELETE),validate(fileIdSchema), deleteFile);

export default router;