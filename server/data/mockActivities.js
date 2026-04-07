const mockActivities = [
  // Manali
  { name: 'Solang Valley Paragliding', city: 'manali', type: 'adventure', price: 2500, duration: '30 minutes', description: 'Soar over the stunning Solang Valley with panoramic Himalayan views.', difficulty: 'moderate', rating: 4.7, image: '' },
  { name: 'Old Manali Cafe Hopping', city: 'manali', type: 'food', price: 800, duration: '3-4 hours', description: 'Explore the quirky cafes of Old Manali — Italian, Israeli, and Himachali cuisine.', difficulty: 'easy', rating: 4.3, image: '' },
  { name: 'Rohtang Pass Excursion', city: 'manali', type: 'nature', price: 1500, duration: 'Full day', description: 'Drive to the legendary Rohtang Pass at 13,050ft — snow, glaciers, and breathtaking views.', difficulty: 'moderate', rating: 4.8, image: '' },
  { name: 'River Rafting in Beas', city: 'manali', type: 'adventure', price: 1200, duration: '2 hours', description: 'White-water rafting through rapids on the Beas River.', difficulty: 'moderate', rating: 4.5, image: '' },
  { name: 'Hadimba Temple Visit', city: 'manali', type: 'cultural', price: 0, duration: '1-2 hours', description: 'Ancient cave temple surrounded by cedar forest — a must-visit landmark.', difficulty: 'easy', rating: 4.4, image: '' },

  // Goa
  { name: 'Scuba Diving at Grande Island', city: 'goa', type: 'adventure', price: 3500, duration: '3-4 hours', description: 'Discover underwater coral reefs and marine life at Grande Island.', difficulty: 'moderate', rating: 4.6, image: '' },
  { name: 'Dudhsagar Falls Trek', city: 'goa', type: 'nature', price: 1800, duration: 'Full day', description: 'Trek through lush forests to one of India\'s tallest waterfalls.', difficulty: 'hard', rating: 4.8, image: '' },
  { name: 'Old Goa Heritage Walk', city: 'goa', type: 'cultural', price: 500, duration: '3 hours', description: 'Explore Portuguese-era churches including the Basilica of Bom Jesus.', difficulty: 'easy', rating: 4.2, image: '' },
  { name: 'Sunset Cruise on Mandovi', city: 'goa', type: 'relaxation', price: 1200, duration: '2 hours', description: 'Cruise along the Mandovi River with live music and Goan snacks at sunset.', difficulty: 'easy', rating: 4.4, image: '' },
  { name: 'Night Market Shopping', city: 'goa', type: 'shopping', price: 200, duration: '2-3 hours', description: 'Shop for handicrafts, spices, and souvenirs at the famous Saturday Night Market.', difficulty: 'easy', rating: 4.1, image: '' },

  // Jaipur
  { name: 'Amber Fort & Elephant Ride', city: 'jaipur', type: 'cultural', price: 1500, duration: '3-4 hours', description: 'Explore the magnificent Amber Fort complex with an optional elephant ride.', difficulty: 'easy', rating: 4.7, image: '' },
  { name: 'Hot Air Balloon Safari', city: 'jaipur', type: 'adventure', price: 8000, duration: '1 hour', description: 'Float over Jaipur\'s palaces and forts in a hot air balloon at sunrise.', difficulty: 'easy', rating: 4.9, image: '' },
  { name: 'Rajasthani Cooking Class', city: 'jaipur', type: 'food', price: 1200, duration: '3 hours', description: 'Learn to cook authentic Dal Baati Churma and other Rajasthani dishes.', difficulty: 'easy', rating: 4.5, image: '' },
  { name: 'Johari Bazaar Shopping', city: 'jaipur', type: 'shopping', price: 100, duration: '2-3 hours', description: 'Browse centuries-old jewelry bazaar for gems, silver, and traditional Kundan jewelry.', difficulty: 'easy', rating: 4.3, image: '' },
  { name: 'Nahargarh Fort Sunset Trek', city: 'jaipur', type: 'sightseeing', price: 200, duration: '2-3 hours', description: 'Trek to Nahargarh Fort for the most spectacular sunset view of Jaipur.', difficulty: 'moderate', rating: 4.6, image: '' },

  // Kerala
  { name: 'Alleppey Houseboat Stay', city: 'kerala', type: 'relaxation', price: 6000, duration: 'Overnight', description: 'Cruise through Kerala\'s famous backwaters on a traditional kettuvallam houseboat.', difficulty: 'easy', rating: 4.9, image: '' },
  { name: 'Ayurvedic Spa Treatment', city: 'kerala', type: 'relaxation', price: 3000, duration: '2 hours', description: 'Traditional Panchakarma Ayurvedic treatment with herbal oils and therapies.', difficulty: 'easy', rating: 4.6, image: '' },
  { name: 'Munnar Tea Plantation Tour', city: 'kerala', type: 'nature', price: 800, duration: '3-4 hours', description: 'Walk through emerald tea gardens and learn the art of tea making.', difficulty: 'easy', rating: 4.5, image: '' },
  { name: 'Kathakali Dance Show', city: 'kerala', type: 'cultural', price: 400, duration: '2 hours', description: 'Watch the mesmerizing classical Kathakali dance form with elaborate costumes and makeup.', difficulty: 'easy', rating: 4.4, image: '' },

  // Rishikesh
  { name: 'Bungee Jumping (83m)', city: 'rishikesh', type: 'adventure', price: 3500, duration: '1 hour', description: 'India\'s highest bungee jump at Mohan Chatti — 83 meters of pure adrenaline.', difficulty: 'hard', rating: 4.8, image: '' },
  { name: 'White Water Rafting', city: 'rishikesh', type: 'adventure', price: 1500, duration: '3-4 hours', description: 'Navigate Grade III-IV rapids on the Ganges with professional guides.', difficulty: 'moderate', rating: 4.7, image: '' },
  { name: 'Yoga Retreat (3-day)', city: 'rishikesh', type: 'relaxation', price: 5000, duration: '3 days', description: 'Immersive yoga and meditation retreat at authentic Rishikesh ashram.', difficulty: 'easy', rating: 4.6, image: '' },
  { name: 'Triveni Ghat Aarti', city: 'rishikesh', type: 'cultural', price: 0, duration: '1 hour', description: 'Experience the spiritual Ganga Aarti ceremony at Triveni Ghat every evening.', difficulty: 'easy', rating: 4.5, image: '' },

  // Varanasi
  { name: 'Morning Boat Ride on Ganges', city: 'varanasi', type: 'sightseeing', price: 300, duration: '1-2 hours', description: 'Witness the magical sunrise and ancient rituals along the ghats from a boat.', difficulty: 'easy', rating: 4.8, image: '' },
  { name: 'Street Food Walk', city: 'varanasi', type: 'food', price: 600, duration: '3 hours', description: 'Taste legendary Banarasi chaat, lassi, paan, and kachori with a local guide.', difficulty: 'easy', rating: 4.6, image: '' },
  { name: 'Silk Weaving Workshop', city: 'varanasi', type: 'cultural', price: 800, duration: '2 hours', description: 'Learn about the famous Banarasi silk weaving tradition from master weavers.', difficulty: 'easy', rating: 4.3, image: '' },

  // Ladakh
  { name: 'Pangong Lake Day Trip', city: 'ladakh', type: 'nature', price: 2500, duration: 'Full day', description: 'Visit the stunning Pangong Tso lake — its colors shift between blue, green, and purple.', difficulty: 'moderate', rating: 4.9, image: '' },
  { name: 'Nubra Valley ATV Ride', city: 'ladakh', type: 'adventure', price: 2000, duration: '2 hours', description: 'ATV ride through the sand dunes of Nubra Valley — the cold desert.', difficulty: 'moderate', rating: 4.5, image: '' },
  { name: 'Monastery Tour', city: 'ladakh', type: 'cultural', price: 600, duration: 'Half day', description: 'Visit ancient Buddhist monasteries — Thiksey, Hemis, and Diskit.', difficulty: 'easy', rating: 4.6, image: '' },
];

export default mockActivities;
