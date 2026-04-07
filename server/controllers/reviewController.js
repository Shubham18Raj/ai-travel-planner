import Review from '../models/Review.js';

// POST /api/reviews
export const create = async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body, userId: req.userId });
    const populated = await review.populate('userId', 'name avatar');
    res.status(201).json({ message: 'Review added', review: populated });
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/:destinationId
export const getByDestination = async (req, res, next) => {
  try {
    const reviews = await Review.find({ destination: req.params.destinationId.toLowerCase() })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    res.json({ reviews, total: reviews.length, averageRating: avgRating });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/reviews/:id
export const remove = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
