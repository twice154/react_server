import express from 'express';
import account from './account';
import stream from './stream';
import moonlight from './moonlight';

const router = express.Router();

router.use('/*', (req, res, next) => {
    res.setHeader("Expires", "-1");
    res.setHeader("Cache-Control", "must-revalidate, private");
    next();
});


router.use('/account', account);
router.use('/stream', stream);
router.use('/moonlight', moonlight);

export default router;

