import mockHotels from '../data/mockHotels.js';

// GET /api/hotels
export const getAll = (req, res) => {
  const { city } = req.query;
  let hotels = mockHotels;

  if (city) {
    hotels = hotels.filter(h => h.city.toLowerCase() === city.toLowerCase());
  }

  res.json({ hotels, total: hotels.length });
};

// GET /api/hotels/:id
export const getById = (req, res) => {
  const hotel = mockHotels.find((_, i) => i === parseInt(req.params.id));
  if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
  res.json({ hotel });
};

// GET /api/hotels/search
export const search = (req, res) => {
  const { city, type, minPrice, maxPrice, minRating, sort } = req.query;
  let hotels = [...mockHotels];

  if (city) hotels = hotels.filter(h => h.city.toLowerCase() === city.toLowerCase());
  if (type) hotels = hotels.filter(h => h.type === type);
  if (minPrice) hotels = hotels.filter(h => h.pricePerNight >= Number(minPrice));
  if (maxPrice) hotels = hotels.filter(h => h.pricePerNight <= Number(maxPrice));
  if (minRating) hotels = hotels.filter(h => h.rating >= Number(minRating));

  if (sort === 'price-asc') hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sort === 'price-desc') hotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sort === 'rating') hotels.sort((a, b) => b.rating - a.rating);

  res.json({ hotels, total: hotels.length });
};
