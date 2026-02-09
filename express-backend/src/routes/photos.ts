import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import DatabaseController from '../controllers/databaseController.js';
import AuthenticationUtils from '../utils/authenticationUtils.js';
import fs from 'fs';
import sharp from 'sharp';
import FilesystemPhotoHelper from 'src/models/filesystemPhotoHelper.js';

const router = express.Router();

router.get('/list-all-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/list-all-photos', 'GET');
  
  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var listAllPhotosResult = await DatabaseController.listAllPhotos();
  if ('err' in listAllPhotosResult) return FeedbackUtils.throwHTTPResConsoleError(res, listAllPhotosResult.err.message, 500);

  var updateValidLocationsResult = await FilesystemPhotoHelper.updateValidLocations();
  if ('err' in updateValidLocationsResult) return FeedbackUtils.throwHTTPResConsoleError(res, updateValidLocationsResult.err.message, 500);

  res.json(listAllPhotosResult);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/rescan-all-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/rescan-all-photos', 'POST');
  
  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  console.log('Rescanning files in all locations...');

  var r = await DatabaseController.rescanPhotos(true);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  console.log('Sucessfully rescanned files in all locations');

  res.json({message: 'Sucessfully rescanned files in all locations'});

  FeedbackUtils.logRouteCallEndSuccess();
});

router.post('/scan-new-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/rescan-all-photos', 'POST');
  
  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  console.log('Scanning for new files in all locations...');

  var r = await DatabaseController.rescanPhotos(false);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  console.log('Sucessfully scanned new files in all locations');

  res.json({message: 'Sucessfully scanned new files in all locations'});

  FeedbackUtils.logRouteCallEndSuccess();
});

router.get('/get-file', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/get-file', 'GET');

  const filename = req.query.filename;
  if (!filename || typeof filename !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'Filename required!', 400);

  if (!FilesystemPhotoHelper.checkPhotoValid(filename)) return FeedbackUtils.throwHTTPResConsoleError(res, 'File not in a tracked location.', 400);

  const width = req.query.width;
  const height = req.query.height;

  try {
    await fs.promises.access(filename, fs.constants.R_OK);

    res.setHeader('Content-Type', 'image/jpeg');

    var readStream = fs.createReadStream(filename).pipe(sharp().rotate());

    if (width) {
      readStream = readStream.pipe(
        sharp()
        .resize({
          width: Number(width),        // scale down
          withoutEnlargement: true
        })
        .jpeg({ quality: 75 }) // compress
      )
    }

    if (height) {
      readStream = readStream.pipe(
        sharp()
        .resize({
          height: Number(height),        // scale down
          withoutEnlargement: true
        })
        .jpeg({ quality: 75 }) // compress
      )
    }

    res.setHeader(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );

    readStream.pipe(res);

  } catch (err) {
    return FeedbackUtils.throwHTTPResConsoleError(
      res,
      err.message,
      404
    );
  }
});

router.get('/get-photo-locations', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/get-photo-locations', 'GET');
  
  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var r = await DatabaseController.getPhotoLocations();
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/add-photo-location', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/add-photo-location', 'POST');
  
  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with locationToAdd required!', 400);

  const locationToAdd = req.body.locationToAdd;
  if (!locationToAdd || typeof locationToAdd !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'locationToAdd required!', 400);

  var r = await DatabaseController.addPhotoLocation(locationToAdd);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/delete-photo-location', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/delete-photo-location', 'POST');
  
  var isAuthenticated = AuthenticationUtils.checkAuthentication(req);
  if ('err' in isAuthenticated) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with id required!', 400);

  const id = req.body.id;
  if (!id || typeof id !== 'string') return FeedbackUtils.throwHTTPResConsoleError(res, 'id required!', 400);

  var r = await DatabaseController.deletePhotoLocation(id);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

export default router;