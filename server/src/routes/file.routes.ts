import { Router } from 'express';
import { listFiles, downloadFile,deleteFile,previewFile, uploadFileProxy} from '../controller/file.controller.js';
import { requirePerms } from '../middleware/perms.js';
import { Perms } from '../types/perms.js';
import { validate } from '../middleware/validate.js';
import { downloadSchema } from '../schema/file.schema.js'; 
import multer from 'multer';

const router = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.get('/', requirePerms(Perms.READ), listFiles);
router.get('/:fileId/download',requirePerms(Perms.READ),validate(downloadSchema),downloadFile);
router.get('/:fileId/preview', requirePerms(Perms.READ), previewFile);
router.post('/upload', requirePerms(Perms.UPLOAD), upload.single('file'), uploadFileProxy);
router.delete('/:fileId', requirePerms(Perms.DELETE), deleteFile);

export default router;