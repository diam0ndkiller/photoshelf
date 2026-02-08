import { Router } from 'express';
const router = Router();

/**
 * Import controllers
 */

import { sayHello } from '../controllers/helloworldController.js';

// GET /helloworld
router.get('/', sayHello);

export default router;