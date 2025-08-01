import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Home, Star, Users, Award, MapPin } from 'lucide-react'
import { useProperties, Property } from '../hooks/useProperties'
import PropertyCard from '../components/PropertyCard'
import SaleBanner from '../components/SaleBanner'

const HomePage: React.FC = () => {
  const { properties: featuredProperties, loading } = useProperties()
  
  // Fallback data for homepage if Supabase fails
  const fallbackFeaturedProperties: Property[] = [
    {
      id: '1',
      title: 'Luxury Estate in Frisco',
      address: '123 Highland Drive, Frisco, TX 75034',
      city: 'Frisco',
      state: 'TX',
      zip_code: '75034',
      price: 850000,
      bedrooms: 5,
      bathrooms: 4,
      square_feet: 3200,
      description: 'Stunning luxury estate featuring premium finishes and spacious living areas.',
      status: 'available',
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [{
        id: '1',
        property_id: '1',
        image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        display_order: 1,
        created_at: new Date().toISOString()
      }]
    },
    {
      id: '2',
      title: 'Modern Townhome in Plano',
      address: '456 Oak Street, Plano, TX 75023',
      city: 'Plano',
      state: 'TX',
      zip_code: '75023',
      price: 425000,
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1800,
      description: 'Contemporary townhome with open floor plan and modern amenities.',
      status: 'available',
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [{
        id: '2',
        property_id: '2',
        image_url: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800',
        display_order: 1,
        created_at: new Date().toISOString()
      }]
    },
    {
      id: '3',
      title: 'Family Home in Allen',
      address: '789 Maple Lane, Allen, TX 75013',
      city: 'Allen',
      state: 'TX',
      zip_code: '75013',
      price: 525000,
      bedrooms: 4,
      bathrooms: 3,
      square_feet: 2400,
      description: 'Perfect family home with large backyard and excellent schools nearby.',
      status: 'pending',
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: [{
        id: '3',
        property_id: '3',
        image_url: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
        display_order: 1,
        created_at: new Date().toISOString()
      }]
    }
  ]

  // Use fallback data if there's an error or no properties
  const displayProperties = error || featuredProperties.length === 0 ? fallbackFeaturedProperties : featuredProperties
  const featured = displayProperties.filter(property => property.is_featured).slice(0, 6)

  return (
    <div>
      {/* Sale Banner */}
      <SaleBanner />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Find Your
                <span className="text-blue-600 block">Dream Home</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Discover luxury homes and communities designed for modern living. 
                From cozy townhomes to spacious estates, we have the perfect home for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/homes"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center group"
                >
                  Browse Homes
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
                >
                  Schedule Tour
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Beautiful home exterior"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-slate-600">Happy Families</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">25+</div>
              <div className="text-slate-600 font-medium">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-slate-600 font-medium">Homes Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-slate-600 font-medium">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-slate-600 font-medium">Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover our handpicked selection of premium homes available now. 
              Each property offers exceptional quality and prime locations.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                  <div className="h-64 bg-slate-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-slate-200 rounded mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-6"></div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="h-12 bg-slate-200 rounded"></div>
                      <div className="h-12 bg-slate-200 rounded"></div>
                      <div className="h-12 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-12 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featured.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              <div className="text-center">
                <Link
                  to="/homes"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center group"
                >
                  View All Properties
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Highland Homes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're committed to delivering exceptional homes and outstanding service 
              to every client we serve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl hover:bg-slate-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Quality Construction</h3>
              <p className="text-slate-600 leading-relaxed">
                Every home is built with premium materials and expert craftsmanship, 
                ensuring lasting quality and value.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl hover:bg-slate-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Prime Locations</h3>
              <p className="text-slate-600 leading-relaxed">
                Our communities are strategically located near top schools, 
                shopping, and major highways for ultimate convenience.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl hover:bg-slate-50 transition-colors duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Expert Guidance</h3>
              <p className="text-slate-600 leading-relaxed">
                Our experienced team provides personalized service and expert guidance 
                throughout your home buying journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-10 text-blue-100 max-w-3xl mx-auto">
            Contact our team today to schedule a tour or learn more about our 
            available properties. Your dream home awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 hover:bg-slate-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
            >
              Schedule a Tour
            </Link>
            <Link
              to="/homes"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-colors duration-200"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage