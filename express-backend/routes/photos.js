import express from 'express';
import FeedbackUtils from '../utils/feedbackUtils.js';
import DatabaseController from '../controllers/databaseController.js';
import AuthenticationUtils from '../utils/authenticationUtils.js';
import fs from 'fs';
import sharp from 'sharp';

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

router.get('/rescan-all-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/rescan-all-photos', 'POST');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  console.log('Rescanning files in all locations...');

  var r = await DatabaseController.rescanPhotos(true);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  console.log('Sucessfully rescanned files in all locations');

  res.json({message: 'Sucessfully rescanned files in all locations'});

  FeedbackUtils.logRouteCallEndSuccess();
});

router.get('/scan-new-photos', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/rescan-all-photos', 'POST');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  console.log('Scanning for new files in all locations...');

  var r = await DatabaseController.rescanPhotos(false);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  console.log('Sucessfully scanned new files in all locations');

  res.json({message: 'Sucessfully scanned new files in all locations'});

  FeedbackUtils.logRouteCallEndSuccess();
});

/*
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
*/

router.get('/get-file', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/get-file', 'GET');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  const filename = req.query.filename;
  if (!filename) return FeedbackUtils.throwHTTPResConsoleError(res, 'Filename required!', 400);

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
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  var r = await DatabaseController.getPhotoLocations();
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/add-photo-location', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/add-photo-location', 'POST');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with locationToAdd required!', 400);

  const locationToAdd = req.body.locationToAdd;
  if (!locationToAdd) return FeedbackUtils.throwHTTPResConsoleError(res, 'locationToAdd required!', 400);

  var r = await DatabaseController.addPhotoLocation(locationToAdd);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

router.post('/delete-photo-location', async (req, res) => {
  FeedbackUtils.logRouteCallStart('/photos/delete-photo-location', 'POST');
  
  var isAuthenticated = AuthenticationUtils.isAuthenticated(req);
  if (isAuthenticated !== true) return FeedbackUtils.throwHTTPResConsoleError(res, isAuthenticated.err.message);

  if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with id required!', 400);

  const id = req.body.id;
  if (!id) return FeedbackUtils.throwHTTPResConsoleError(res, 'id required!', 400);

  var r = await DatabaseController.deletePhotoLocation(id);
  if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

  res.json(r);

  FeedbackUtils.logRouteCallEndSuccess();
})

export default router;