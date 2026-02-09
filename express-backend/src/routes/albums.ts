import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import DatabaseController from '../controllers/databaseController.js';
import AuthenticationUtils from '../utils/authenticationUtils.js';
import FilesystemPhotoHelper from 'src/models/filesystemPhotoHelper.js';
import { Album, JoinedAlbumContentLink } from '@shared/databasetypes.js';

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
  if (!id || typeof id !== 'number') return FeedbackUtils.throwHTTPResConsoleError(res, 'ID required!', 400);

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
  if (!photoId || typeof photoId !== 'number') return FeedbackUtils.throwHTTPResConsoleError(res, 'Photo ID required!', 400);

  const albumId = req.body.albumId;
  if (!albumId || typeof albumId !== 'number') return FeedbackUtils.throwHTTPResConsoleError(res, 'Album ID required!', 400);

  var r = await DatabaseController.addPhotoToAlbum(photoId, albumId);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.get('/get-album-contents', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/get-album-contents', 'GET');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const id = req.query.id;
  if (!id || typeof id !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'ID required!', 400);

  var r = await DatabaseController.getAlbumContents(id);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);
  
  var updateValidLocationsResult = await FilesystemPhotoHelper.updateValidLocations();
  if ('err' in updateValidLocationsResult) return FeedbackUtils.throwHTTPResConsoleError(res, updateValidLocationsResult.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/save-album-information', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/save-album-information', 'POST');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const reqInformation = req.body.information;
  if (!reqInformation) return FeedbackUtils.throwHTTPResConsoleError(res, 'Information required!', 400);

  var albumInformation: Album;

  try {
    albumInformation = reqInformation as Album;
  } catch (err) { return FeedbackUtils.throwHTTPResConsoleError(res, err.message, 400); }

  var r = await DatabaseController.saveAlbumInformation(albumInformation);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/save-album-contents', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/albums/save-album-contents', 'POST');

  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const albumId = req.body.albumId;
  if (!albumId || typeof albumId !== 'number') return FeedbackUtils.throwHTTPResConsoleError(res, 'Album ID required!', 400);

  const reqContents = req.body.contents;
  if (!reqContents) return FeedbackUtils.throwHTTPResConsoleError(res, 'Contents required!', 400);

  var albumContents: Array<JoinedAlbumContentLink>;

  try {
    albumContents = reqContents as Array<JoinedAlbumContentLink>;
  } catch (err) { return FeedbackUtils.throwHTTPResConsoleError(res, err.message, 400); }

  var r = await DatabaseController.saveAlbumContents(albumId, albumContents);

  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

export default router;