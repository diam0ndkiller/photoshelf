import DatabaseController from '../controllers/databaseController.js';
import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';

const router = express.Router();

router.post('/init-db', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/db-utils/init-db', 'POST');

  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with directory required!', 400);

  const dir = req.body.directory;
  if (!dir) return FeedbackUtils.throwHTTPResConsoleError(res, 'Directory required!', 400);

  var r = await DatabaseController.initializeDatabase(dir);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  FeedbackUtils.returnHTTPResSuccess(res, { message: 'Database initialized at' + dir });
});

export default router;