import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    movieCode: {
      type: String,
      required: [true, 'Movie code is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    note: {
      type: String,
    },
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent a user from rating the same movie twice
ratingSchema.index({ movieCode: 1, ratedBy: 1 }, { unique: true });

export const Rating = mongoose.model('Rating', ratingSchema);
