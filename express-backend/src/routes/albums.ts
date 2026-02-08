import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import DatabaseController from '../controllers/databaseController.js';
import AuthenticationUtils from '../utils/authenticationUtils.js';

const router = express.Router();

router.get('/list-albums', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/list-albums', 'GET');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var r = await DatabaseController.listAlbums();
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.get('/album-information', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/album-information', 'GET');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const id = req.query.id;
  if (!id || typeof id !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'ID required!', 400);

  var r = await DatabaseController.getAlbumInformation(id);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/create-album', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/create-album', 'POST');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const name = req.body.name;
  if (!name || typeof name !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'Name required!', 400);

  var r = await DatabaseController.createAlbum(name);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/delete-album', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/delete-album', 'POST');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const id = req.body.id;
  if (!id || typeof id !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'ID required!', 400);

  var r = await DatabaseController.deleteAlbum(id);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/add-to-album', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/add-to-album', 'POST');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const photoId = req.body.photoId;
  if (!photoId || typeof photoId !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'Photo ID required!', 400);

  const albumId = req.body.albumId;
  if (!albumId || typeof albumId !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'Album ID required!', 400);

  var r = await DatabaseController.addPhotoToAlbum(photoId, albumId);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

export default router;