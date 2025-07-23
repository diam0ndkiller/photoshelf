import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import DatabaseController from '../controllers/databaseController.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/list-all-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/list-all-photos', 'GET');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var r = await DatabaseController.listAllPhotos();
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/scan-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/scan-photos', 'POST');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);
  
  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with directory required!', 400);

  const dir = req.body.directory;
  if (!dir) return FeedbackUtils.throwHTTPResConsoleError(res, 'Directory required!', 400);

  console.log('Starting scan in ' + dir + '...');

  var r = await DatabaseController.scanPhotos(dir, false);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json({message: 'Sucessfully scanned files in ' + dir});

  FeedbackUtils.logRouteCallEndSuccess();
});

router.post('/force-rescan-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/force-rescan-photos', 'POST');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);
  
  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with directory required!', 400);

  const dir = req.body.directory;
  if (!dir) return FeedbackUtils.throwHTTPResConsoleError(res, 'Directory required!', 400);


  console.log('Starting forced rescan in ' + dir + '...');

  var r = await DatabaseController.scanPhotos(dir, true);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json({message: 'Sucessfully scanned files in ' + dir});

  FeedbackUtils.logRouteCallEndSuccess();
});

router.get('/get-file', (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/get-file', 'GET');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const filename = req.query.filename;
  if (!filename) return FeedbackUtils.throwHTTPResConsoleError(res, 'Filename required!', 400);

  fs.access(filename, fs.constants.R_OK, (err) => {
    if (err) {
      return FeedbackUtils.throwHTTPResConsoleError(res, 'File not found: "' + filename + '"!', 404);
    }
    res.sendFile(filename);
  });
});

export default router;