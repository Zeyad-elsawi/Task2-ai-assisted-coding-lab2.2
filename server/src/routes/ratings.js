import express from 'express';
import {
  createRating,
  getAllRatings,
  getRating,
  getRatingSummary,
} from '../controllers/ratingController.js';

const router = express.Router();

// Order is important: /summary must come before /:id
router.get('/summary', getRatingSummary);
router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/:id', getRating);

export default router;
