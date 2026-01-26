import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import DatabaseController from '../controllers/databaseController.js';
import AuthenticationUtils from '../utils/authenticationUtils.js';

const router = express.Router();

router.get('/list-albums', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/list-albums', 'GET');

  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var r = await DatabaseController.listAlbums();
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.get('/album-information', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/album-information', 'GET');

  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const id = req.query.id;
  if (!id) return FeedbackUtils.throwHTTPResConsoleError(res, 'ID required!', 400);

  var r = await DatabaseController.getAlbumInformation(id);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/create-album', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/create-album', 'POST');

  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const name = req.body.name;
  if (!name) return FeedbackUtils.throwHTTPResConsoleError(res, 'Name required!', 400);

  var r = await DatabaseController.createAlbum(name);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/delete-album', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/delete-album', 'POST');

  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const id = req.body.id;
  if (!id) return FeedbackUtils.throwHTTPResConsoleError(res, 'ID required!', 400);

  var r = await DatabaseController.deleteAlbum(id);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

export default router;