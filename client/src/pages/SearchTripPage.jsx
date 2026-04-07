import TripSearchForm from '../components/TripSearchForm';

export default function SearchTripPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="section">
        <div className="text-center mb-12">
          <span className="badge-primary mb-4 inline-block">Plan Your Trip</span>
          <h1 className="section-title mx-auto">Where Do You Want to Go?</h1>
          <p className="section-subtitle mx-auto mt-4">
            Fill in your travel details and let AI find the best routes, hotels, and activities.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card">
            <TripSearchForm />
          </div>
        </div>
      </div>
    </div>
  );
}
