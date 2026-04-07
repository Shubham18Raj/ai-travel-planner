import mockActivities from '../data/mockActivities.js';

// GET /api/activities
export const getAll = (req, res) => {
  const { city } = req.query;
  let activities = mockActivities;

  if (city) {
    activities = activities.filter(a => a.city.toLowerCase() === city.toLowerCase());
  }

  res.json({ activities, total: activities.length });
};

// GET /api/activities/:id
export const getById = (req, res) => {
  const activity = mockActivities.find((_, i) => i === parseInt(req.params.id));
  if (!activity) return res.status(404).json({ message: 'Activity not found' });
  res.json({ activity });
};

// GET /api/activities/search
export const search = (req, res) => {
  const { city, type, maxPrice, difficulty, sort } = req.query;
  let activities = [...mockActivities];

  if (city) activities = activities.filter(a => a.city.toLowerCase() === city.toLowerCase());
  if (type) activities = activities.filter(a => a.type === type);
  if (maxPrice) activities = activities.filter(a => a.price <= Number(maxPrice));
  if (difficulty) activities = activities.filter(a => a.difficulty === difficulty);

  if (sort === 'price-asc') activities.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') activities.sort((a, b) => b.price - a.price);
  if (sort === 'rating') activities.sort((a, b) => b.rating - a.rating);

  res.json({ activities, total: activities.length });
};
