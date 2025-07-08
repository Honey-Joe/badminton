import { Link } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { Clock, CreditCard, CalendarCheck, BadgeCheck, Users, Shield } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Book Your Badminton Court Online</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Reserve your court in seconds and enjoy seamless badminton experiences
          </p>
          <Link 
            to="/booking" 
            className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition duration-300 inline-flex items-center justify-center gap-2"
          >
            <CalendarCheck className="w-5 h-5" />
            Book Now
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Book With Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-red-600 mb-4 flex justify-center">
                <Clock className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-gray-600">
                Reserve your court in seconds with our easy-to-use online system. No more waiting in line!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-red-600 mb-4 flex justify-center">
                <CreditCard className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Payment</h3>
              <p className="text-gray-600">
                Multiple payment options including credit cards, mobile wallets, and cash on arrival.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-red-600 mb-4 flex justify-center">
                <BadgeCheck className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Facilities</h3>
              <p className="text-gray-600">
                Premium quality courts with professional-grade flooring and lighting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courts Section */}
      <div className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Courts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Court 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="/images/court1.jpg" 
                alt="Court 1" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Court 1</h3>
                <p className="text-gray-600 mb-4">
                  Professional-grade court with tournament-quality flooring and lighting.
                </p>
                <Link 
                  to="/booking" 
                  className="text-red-600 font-medium inline-flex items-center gap-1 hover:text-red-700"
                >
                  Book Now <CalendarCheck className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Court 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="/images/court2.jpg" 
                alt="Court 2" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Court 2</h3>
                <p className="text-gray-600 mb-4">
                  Olympic-standard court with perfect tension nets and boundary lines.
                </p>
                <Link 
                  to="/booking" 
                  className="text-red-600 font-medium inline-flex items-center gap-1 hover:text-red-700"
                >
                  Book Now <CalendarCheck className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Court 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src="/images/court3.jpg" 
                alt="Court 3" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Court 3</h3>
                <p className="text-gray-600 mb-4">
                  Training court with coaching facilities and equipment rental available.
                </p>
                <Link 
                  to="/booking" 
                  className="text-red-600 font-medium inline-flex items-center gap-1 hover:text-red-700"
                >
                  Book Now <CalendarCheck className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Players Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Rajesh Kumar</h4>
                  <p className="text-gray-500 text-sm">Regular Player</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The online booking system is so convenient! I can reserve a court during my lunch break and play right after work."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Priya Sharma</h4>
                  <p className="text-gray-500 text-sm">Tournament Player</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Court quality is excellent and the booking system makes it easy to schedule practice sessions with my team."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
          <p className="text-xl mb-8">
            Join hundreds of players who book with us every week for the best badminton experience.
          </p>
          <Link 
            to="/booking" 
            className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition duration-300 inline-flex items-center justify-center gap-2"
          >
            <CalendarCheck className="w-5 h-5" />
            Book Your Court Now
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;