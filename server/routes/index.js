import express from 'express';
import account from './account';
import stream from './stream';
import moonlight from './moonlight';
import speedtest from './speedtest';

const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});

router.use('/account', account);
router.use('/stream', stream);
router.use('/*/conneto', moonlight);
router.use('/speedtest', speedtest);

export default router;

