import express from 'express';
import stream from './stream';
import moonlight from './moonlight';
import speedtest from './speedtest';
import users from './users';
import auth from './auth';
import checks from './check';
import recovery from './recovery';
const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});
router.use('/check', checks);
router.use('/users', users);
router.use('/auth', auth);
router.use('/recovery', recovery);

router.use('/stream', stream);
router.use('/moonlight', moonlight);
router.use('/speedtest', speedtest);

export default router;

