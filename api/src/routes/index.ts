import { Router } from 'express';
import { authRouter } from './auth';
import { organizationsRouter } from './organizations';
import { educatorsRouter } from './educators';
import { leadsRouter } from './leads';
import { childrenRouter } from './children';
import { reviewsRouter } from './reviews';
import { servicesRouter } from './services';
import { uploadRouter } from './upload';
import { adminRouter } from './admin';

export const router = Router();

router.use('/auth', authRouter);
router.use('/organizations', organizationsRouter);
router.use('/educators', educatorsRouter);
router.use('/leads', leadsRouter);
router.use('/children', childrenRouter);
router.use('/reviews', reviewsRouter);
router.use('/services', servicesRouter);
router.use('/upload', uploadRouter);
router.use('/admin', adminRouter);
