import DatabaseController from '../controllers/databaseController.js';
import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import AuthenticationUtils from '../utils/authenticationUtils.js';
import ConfigFileHelper from '../models/configFileHelper.js';
import path from 'path';

const router = express.Router();

router.post('/init-db', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/db-utils/init-db', 'POST');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with databaseLocation required!', 400);

  const dir = req.body.databaseLocation;
  if (!dir) return FeedbackUtils.throwHTTPResConsoleError(res, 'DatabaseLocation required!', 400);

  var r = await DatabaseController.firstTimeInitDatabase(dir);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  FeedbackUtils.returnHTTPResSuccess(res, { message: 'Database initialized at' + dir });
});

router.get('/get-default-db-location', (req, res) => {
  FeedbackUtils.logRouteCallStart('/db-utils/get-default-db-location', 'GET');

  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var databaseLocation = path.join(process.cwd(), 'data');

  res.json({databaseLocation})
  FeedbackUtils.logRouteCallEndSuccess();
});

router.get('/get-db-location', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/db-utils/get-db-location', 'GET');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var r = ConfigFileHelper.getDatabaseLocation();
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json({databaseLocation: r.databaseLocation});
  FeedbackUtils.logRouteCallEndSuccess();
})

export default router;