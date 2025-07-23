import { Router } from 'express';
import AuthenticationUtils from '../utils/authenticationUtils.js';
import FeedbackUtils from '../utils/feedbackUtils.js';
const router = Router();

router.post('/login', async (req, res) => {
    FeedbackUtils.logRouteCallStart('/users/login', 'POST');
    
    if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with username and password required!', 400);

    const { username, password } = req.body;
    if (!username || !password) return FeedbackUtils.throwHTTPResConsoleError(res, 'Username and Password required!', 400);

    var r = AuthenticationUtils.login(username, password)
    if ('err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

    res.json({token: r.token});
    FeedbackUtils.logRouteCallEndSuccess();
});

router.post('/add-user', async (req, res) => {
    FeedbackUtils.logRouteCallStart('/users/add-user', 'POST');
    
    if (!req.body) return FeedbackUtils.throwHTTPResConsoleError(res, 'Request body with username and password required!', 400);

    const { username, password } = req.body;
    if (!username || !password) return FeedbackUtils.throwHTTPResConsoleError(res, 'Username and Password required!', 400);

    var r = await AuthenticationUtils.addUser(req, username, password);
    if (r && 'err' in r) return FeedbackUtils.throwHTTPResConsoleError(res, r.err.message, 500);

    FeedbackUtils.returnHTTPResSuccess(res, {message: 'Successfully added user ' + username + '.'});
});

export default router;