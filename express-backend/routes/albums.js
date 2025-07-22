import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import DatabaseController from '../controllers/databaseController.js';

const router = express.Router();

router.get('/list-albums', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/list-albums', 'GET');

  var r = await DatabaseController.listAlbums();
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

export default router;