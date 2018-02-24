import express from 'express';
import stream from './stream';
import moonlight from './moonlight';
import speedtest from './speedtest';
import auth from './auth';
const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});
router.use('/account',auth);
//router.use('/account', account);
router.use('/stream', stream);
router.use('/moonlight', moonlight);
router.use('/speedtest', speedtest);

export default router;

