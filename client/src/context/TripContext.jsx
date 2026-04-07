import { createContext, useContext, useReducer } from 'react';

const TripContext = createContext(null);

const initialState = {
  searchParams: { source: '', destination: '', startDate: '', endDate: '', groupSize: 1, travelMode: 'train', budget: 'moderate' },
  routes: [],
  hotels: [],
  activities: [],
  selectedTrip: null,
  estimation: null,
  itinerary: null,
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      return { ...state, searchParams: { ...state.searchParams, ...action.payload } };
    case 'SET_ROUTES':
      return { ...state, routes: action.payload };
    case 'SET_HOTELS':
      return { ...state, hotels: action.payload };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'SET_SELECTED_TRIP':
      return { ...state, selectedTrip: action.payload };
    case 'SET_ESTIMATION':
      return { ...state, estimation: action.payload };
    case 'SET_ITINERARY':
      return { ...state, itinerary: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  const setSearchParams = (params) => dispatch({ type: 'SET_SEARCH_PARAMS', payload: params });
  const setRoutes = (routes) => dispatch({ type: 'SET_ROUTES', payload: routes });
  const setHotels = (hotels) => dispatch({ type: 'SET_HOTELS', payload: hotels });
  const setActivities = (activities) => dispatch({ type: 'SET_ACTIVITIES', payload: activities });
  const setSelectedTrip = (trip) => dispatch({ type: 'SET_SELECTED_TRIP', payload: trip });
  const setEstimation = (est) => dispatch({ type: 'SET_ESTIMATION', payload: est });
  const setItinerary = (itin) => dispatch({ type: 'SET_ITINERARY', payload: itin });
  const resetTrip = () => dispatch({ type: 'RESET' });

  return (
    <TripContext.Provider value={{
      ...state, setSearchParams, setRoutes, setHotels, setActivities,
      setSelectedTrip, setEstimation, setItinerary, resetTrip,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrip must be used within TripProvider');
  return context;
};

export default TripContext;
