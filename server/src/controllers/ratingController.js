import Joi from 'joi';
import { Rating } from '../models/Rating.js';

const createRatingSchema = Joi.object({
  movieCode: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  note: Joi.string().optional(),
  ratedBy: Joi.string().hex().length(24).optional(),
});

export const createRating = async (req, res, next) => {
  try {
    const { error } = createRatingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const rating = await Rating.create(req.body);
    res.status(201).json({ rating });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'User has already rated this movie' });
    }
    next(err);
  }
};

export const getAllRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find().lean();
    res.status(200).json({ ratings });
  } catch (err) {
    next(err);
  }
};

export const getRating = async (req, res, next) => {
  try {
    const rating = await Rating.findById(req.params.id).lean();
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    res.status(200).json({ rating });
  } catch (err) {
    next(err);
  }
};

export const getRatingSummary = async (req, res, next) => {
  try {
    const { movieCode } = req.query;
    if (!movieCode) {
      return res.status(400).json({ message: 'movieCode is required' });
    }

    const summary = await Rating.aggregate([
      { $match: { movieCode: movieCode } },
      {
        $group: {
          _id: '$movieCode',
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        movieCode,
        averageRating: 0,
        ratingCount: 0,
      });
    }

    const { _id, averageRating, ratingCount } = summary[0];
    res.status(200).json({
      movieCode: _id,
      averageRating,
      ratingCount,
    });
  } catch (err) {
    next(err);
  }
};
