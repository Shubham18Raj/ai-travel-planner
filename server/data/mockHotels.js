const mockHotels = [
  // Manali
  { name: 'Snow Valley Resort', city: 'manali', type: '4-star', pricePerNight: 4500, rating: 4.5, amenities: ['WiFi', 'Spa', 'Restaurant', 'Parking', 'Room Service'], description: 'Luxury resort with stunning valley views and world-class spa facilities.', address: 'Mall Road, Manali', latitude: 32.2432, longitude: 77.1892, image: '' },
  { name: 'Backpacker\'s Hostel Manali', city: 'manali', type: 'hostel', pricePerNight: 600, rating: 4.0, amenities: ['WiFi', 'Common Kitchen', 'Lounge'], description: 'Cozy hostel perfect for budget travelers and backpackers.', address: 'Old Manali Road', latitude: 32.2466, longitude: 77.1856, image: '' },
  { name: 'Hotel Mountain Trail', city: 'manali', type: '3-star', pricePerNight: 2200, rating: 3.8, amenities: ['WiFi', 'Restaurant', 'Parking'], description: 'Comfortable mid-range hotel near Mall Road.', address: 'Near Mall Road, Manali', latitude: 32.2401, longitude: 77.1901, image: '' },
  { name: 'The Himalayan Grand', city: 'manali', type: '5-star', pricePerNight: 8500, rating: 4.8, amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant', 'Bar', 'Gym', 'Parking'], description: 'Ultra-luxury resort with heated pool and panoramic Himalayan views.', address: 'Log Huts Area, Manali', latitude: 32.2350, longitude: 77.1830, image: '' },
  { name: 'Budget Inn Manali', city: 'manali', type: 'budget', pricePerNight: 1200, rating: 3.5, amenities: ['WiFi', 'Parking'], description: 'Clean and affordable rooms in the heart of Manali.', address: 'Model Town, Manali', latitude: 32.2420, longitude: 77.1870, image: '' },

  // Goa
  { name: 'Radisson Blu Resort Goa', city: 'goa', type: '5-star', pricePerNight: 7500, rating: 4.6, amenities: ['WiFi', 'Pool', 'Spa', 'Beach Access', 'Restaurant', 'Bar', 'Gym'], description: 'Beachfront luxury with private pool villas and sunset views.', address: 'Cavelossim Beach, South Goa', latitude: 15.1700, longitude: 73.9400, image: '' },
  { name: 'Anjuna Beach Hostel', city: 'goa', type: 'hostel', pricePerNight: 500, rating: 4.1, amenities: ['WiFi', 'Common Kitchen', 'Beach Gear'], description: 'Vibrant hostel steps from Anjuna Beach with party vibes.', address: 'Anjuna Beach Road', latitude: 15.5740, longitude: 73.7410, image: '' },
  { name: 'Hotel Mandovi', city: 'goa', type: '3-star', pricePerNight: 2500, rating: 3.9, amenities: ['WiFi', 'Restaurant', 'Pool', 'Parking'], description: 'Well-located hotel overlooking the Mandovi River in Panjim.', address: 'Panjim Waterfront', latitude: 15.4910, longitude: 73.8280, image: '' },
  { name: 'Casa Goa Budget Stay', city: 'goa', type: 'budget', pricePerNight: 1000, rating: 3.6, amenities: ['WiFi', 'AC'], description: 'Simple, clean rooms close to Calangute Beach.', address: 'Calangute', latitude: 15.5437, longitude: 73.7553, image: '' },
  { name: 'The Leela Goa', city: 'goa', type: '5-star', pricePerNight: 12000, rating: 4.9, amenities: ['WiFi', 'Pool', 'Spa', 'Golf', 'Beach', 'Restaurant', 'Bar', 'Gym', 'Butler Service'], description: 'World-class luxury resort with private beach and championship golf course.', address: 'Mobor Beach, Cavelossim', latitude: 15.1560, longitude: 73.9500, image: '' },

  // Jaipur
  { name: 'Rambagh Palace', city: 'jaipur', type: '5-star', pricePerNight: 15000, rating: 4.9, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Heritage Walk'], description: 'Former royal residence turned luxury hotel — experience Rajasthani royalty.', address: 'Bhawani Singh Road', latitude: 26.8937, longitude: 75.8065, image: '' },
  { name: 'Zostel Jaipur', city: 'jaipur', type: 'hostel', pricePerNight: 450, rating: 4.2, amenities: ['WiFi', 'Common Area', 'Tours'], description: 'Award-winning backpacker hostel with rooftop views of Nahargarh Fort.', address: 'Near Hawa Mahal', latitude: 26.9240, longitude: 75.8267, image: '' },
  { name: 'Hotel Pearl Palace', city: 'jaipur', type: '3-star', pricePerNight: 1800, rating: 4.4, amenities: ['WiFi', 'Restaurant', 'Rooftop', 'Parking'], description: 'Award-winning heritage-style hotel with stunning rooftop restaurant.', address: 'Hathroi Fort, Ajmer Road', latitude: 26.9120, longitude: 75.7790, image: '' },
  { name: 'Pink City Budget Hotel', city: 'jaipur', type: 'budget', pricePerNight: 900, rating: 3.4, amenities: ['WiFi', 'AC'], description: 'Affordable base for exploring the Pink City.', address: 'MI Road', latitude: 26.9150, longitude: 75.8000, image: '' },

  // Kerala
  { name: 'Kumarakom Lake Resort', city: 'kerala', type: '5-star', pricePerNight: 9000, rating: 4.7, amenities: ['WiFi', 'Pool', 'Spa', 'Houseboat', 'Ayurveda', 'Restaurant'], description: 'Heritage lakeside resort with authentic Kerala houseboat experience.', address: 'Kumarakom, Kottayam', latitude: 9.5937, longitude: 76.4311, image: '' },
  { name: 'Backwater Breeze Hostel', city: 'kerala', type: 'hostel', pricePerNight: 550, rating: 4.0, amenities: ['WiFi', 'Kayaking', 'Common Kitchen'], description: 'Riverside hostel with free kayaking on the backwaters.', address: 'Alleppey Backwaters', latitude: 9.4981, longitude: 76.3388, image: '' },
  { name: 'Hotel Cochin Heritage', city: 'kerala', type: '3-star', pricePerNight: 2000, rating: 3.8, amenities: ['WiFi', 'Restaurant', 'Parking', 'Tours'], description: 'Charming heritage hotel in Fort Kochi with colonial architecture.', address: 'Fort Kochi', latitude: 9.9658, longitude: 76.2421, image: '' },

  // Shimla
  { name: 'The Oberoi Cecil', city: 'shimla', type: '5-star', pricePerNight: 11000, rating: 4.8, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Heritage'], description: 'Grand colonial-era luxury hotel on Mall Road with mountain views.', address: 'Mall Road, Shimla', latitude: 31.1044, longitude: 77.1710, image: '' },
  { name: 'Hotel Combermere', city: 'shimla', type: '3-star', pricePerNight: 2400, rating: 3.7, amenities: ['WiFi', 'Restaurant', 'Parking'], description: 'Heritage property near The Ridge with classic charm.', address: 'Near The Ridge, Shimla', latitude: 31.1060, longitude: 77.1725, image: '' },
  { name: 'Shimla Backpackers', city: 'shimla', type: 'hostel', pricePerNight: 500, rating: 4.1, amenities: ['WiFi', 'Common Area', 'Tours'], description: 'Friendly hostel with group treks and bonfire nights.', address: 'Lakkar Bazaar', latitude: 31.1080, longitude: 77.1680, image: '' },

  // Varanasi
  { name: 'BrijRama Palace', city: 'varanasi', type: '5-star', pricePerNight: 8000, rating: 4.6, amenities: ['WiFi', 'Ghat View', 'Spa', 'Restaurant', 'Heritage Walk', 'Boat Ride'], description: 'Restored 18th-century palace on the banks of the Ganges.', address: 'Darbhanga Ghat', latitude: 25.3076, longitude: 83.0107, image: '' },
  { name: 'Zostel Varanasi', city: 'varanasi', type: 'hostel', pricePerNight: 400, rating: 4.3, amenities: ['WiFi', 'Rooftop', 'Ghat Tours'], description: 'Rooftop hostel with views of Ganges and walking distance to ghats.', address: 'Near Assi Ghat', latitude: 25.2882, longitude: 82.9876, image: '' },
  { name: 'Hotel Ganges View', city: 'varanasi', type: '3-star', pricePerNight: 1500, rating: 3.9, amenities: ['WiFi', 'Restaurant', 'Ghat View'], description: 'Riverside hotel with balcony views of the morning Ganga Aarti.', address: 'Dashashwamedh Ghat', latitude: 25.3100, longitude: 83.0100, image: '' },

  // Rishikesh
  { name: 'Aloha On The Ganges', city: 'rishikesh', type: '4-star', pricePerNight: 5000, rating: 4.4, amenities: ['WiFi', 'Pool', 'Spa', 'Yoga', 'Restaurant', 'River View'], description: 'Riverside resort with yoga sessions and adventure sport packages.', address: 'Tapovan, Rishikesh', latitude: 30.1217, longitude: 78.3167, image: '' },
  { name: 'GoStops Rishikesh', city: 'rishikesh', type: 'hostel', pricePerNight: 500, rating: 4.2, amenities: ['WiFi', 'Cafe', 'Rafting Bookings'], description: 'Trendy hostel with cafe, games room, and rafting packages.', address: 'Laxman Jhula Road', latitude: 30.1240, longitude: 78.3210, image: '' },
];

export default mockHotels;
