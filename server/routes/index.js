import express from 'express';
import account from './account';
import player from './player';

const router = express.Router();

router.use('/account', account);
router.use('/player', player);

export default router;

