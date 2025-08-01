import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Home, MapPin, Star, Users, Award, 
  ChevronLeft, ChevronRight, Play, Shield, Clock,
  TrendingUp, Heart, CheckCircle
} from 'lucide-react';
import { properties } from '../data/properties';
import { communities } from '../data/communities';
import PropertyCard from '../components/PropertyCard';
import CommunityCard from '../components/CommunityCard';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const featuredProperties = properties.slice(0, 3);
  const featuredCommunities = communities.slice(0, 3);

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop',
      title: 'Discover Your Dream Home',
      subtitle: 'Luxury Living in Texas',
      description: 'Explore our collection of premium homes and communities designed for modern living.',
      cta: 'Explore Homes',
      link: '/properties'
    },
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
      title: 'Premium Communities',
      subtitle: 'Where Luxury Meets Lifestyle',
      description: 'Discover thoughtfully planned communities with world-class amenities.',
      cta: 'View Communities',
      link: '/communities'
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop',
      title: 'Quick Move-In Ready',
      subtitle: 'Move In Today',
      description: 'Beautiful homes ready for immediate occupancy with premium finishes.',
      cta: 'See Available',
      link: '/properties?filter=quick-move-in'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      location: 'M3 Ranch 80s, Mansfield',
      text: 'The entire experience was exceptional. From the initial tour to closing, the team made our dream home a reality.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Michael Davis',
      location: 'Mosaic 60s, Celina',
      text: 'Outstanding quality and attention to detail. Our new home exceeded all expectations.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    {
      name: 'Emily Chen',
      location: 'Reunion 50s, Rhome',
      text: 'Professional service and beautiful homes. We couldn\'t be happier with our choice.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div>
      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent"></div>
            </div>
            
            <div className="relative h-full flex items-center">
              <div className="container-max px-4">
                <div className="max-w-3xl">
                  <div className="animate-fade-in-up">
                    <p className="text-amber-400 font-semibold text-lg mb-4 tracking-wide uppercase">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={slide.link} className="btn-primary group">
                        {slide.cta}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                      <button 
                        onClick={() => setIsVideoPlaying(true)}
                        className="btn-outline group flex items-center justify-center"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Watch Video Tour
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-amber-400 w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-4xl font-bold text-amber-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-slate-600 font-medium">Homes Built</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold text-amber-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                25+
              </div>
              <div className="text-slate-600 font-medium">Years Experience</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold text-amber-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                98%
              </div>
              <div className="text-slate-600 font-medium">Customer Satisfaction</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold text-amber-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                15
              </div>
              <div className="text-slate-600 font-medium">Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-semibold text-lg mb-4 tracking-wide uppercase">
              Featured Homes
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
              Quick Move-In Ready
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover our latest luxury homes available for immediate occupancy. 
              Each property features premium finishes and exceptional locations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, index) => (
              <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/properties" className="btn-primary group">
              View All Properties
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-semibold text-lg mb-4 tracking-wide uppercase">
              Why Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
              Excellence in Every Detail
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to delivering exceptional homes and outstanding service 
              to every client we serve.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 group hover:bg-gray-50 rounded-2xl transition-all duration-300">
              <div className="feature-icon mx-auto group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Quality Assurance</h3>
              <p className="text-slate-600 leading-relaxed">
                Every home is built with premium materials and expert craftsmanship, 
                ensuring lasting quality and value for generations.
              </p>
            </div>
            
            <div className="text-center p-8 group hover:bg-gray-50 rounded-2xl transition-all duration-300">
              <div className="feature-icon mx-auto group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Prime Locations</h3>
              <p className="text-slate-600 leading-relaxed">
                Our communities are strategically located near top-rated schools, 
                shopping centers, and major highways for ultimate convenience.
              </p>
            </div>
            
            <div className="text-center p-8 group hover:bg-gray-50 rounded-2xl transition-all duration-300">
              <div className="feature-icon mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Expert Guidance</h3>
              <p className="text-slate-600 leading-relaxed">
                Our experienced team provides personalized service and expert guidance 
                throughout your entire home buying journey.
              </p>
            </div>
            
            <div className="text-center p-8 group hover:bg-gray-50 rounded-2xl transition-all duration-300">
              <div className="feature-icon mx-auto group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Resort-Style Amenities</h3>
              <p className="text-slate-600 leading-relaxed">
                Enjoy luxury amenities including pools, fitness centers, 
                walking trails, and community spaces in our developments.
              </p>
            </div>
            
            <div className="text-center p-8 group hover:bg-gray-50 rounded-2xl transition-all duration-300">
              <div className="feature-icon mx-auto group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Award-Winning Builder</h3>
              <p className="text-slate-600 leading-relaxed">
                Recognized for excellence in home building and customer satisfaction 
                across Texas by industry leaders and homeowners alike.
              </p>
            </div>
            
            <div className="text-center p-8 group hover:bg-gray-50 rounded-2xl transition-all duration-300">
              <div className="feature-icon mx-auto group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Quick Move-In</h3>
              <p className="text-slate-600 leading-relaxed">
                Many of our homes are move-in ready, allowing you to settle into 
                your new home quickly and start making memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className="section-padding bg-gradient-to-br from-slate-50 to-amber-50">
        <div className="container-max">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-semibold text-lg mb-4 tracking-wide uppercase">
              Premier Communities
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
              Thoughtfully Designed Living
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully planned communities featuring luxury amenities, 
              excellent schools, and convenient locations throughout Texas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCommunities.map((community, index) => (
              <div key={community.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CommunityCard community={community} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/communities" className="btn-primary group">
              Explore All Communities
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <p className="text-amber-600 font-semibold text-lg mb-4 tracking-wide uppercase">
              Customer Stories
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
              What Our Homeowners Say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Hear from families who have made 
              our communities their home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card group">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-slate-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern"></div>
        <div className="container-max relative">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-semibold text-lg mb-4 tracking-wide uppercase">
              Our Process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
              Your Journey to Home Ownership
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We've streamlined the home buying process to make your dream home 
              a reality with minimal stress and maximum satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover</h3>
              <p className="text-gray-300 leading-relaxed">
                Browse our available homes and communities to find your perfect match.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Visit</h3>
              <p className="text-gray-300 leading-relaxed">
                Schedule a personalized tour to experience the quality and craftsmanship firsthand.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Customize</h3>
              <p className="text-gray-300 leading-relaxed">
                Work with our design team to personalize your home with premium finishes.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4">Move In</h3>
              <p className="text-gray-300 leading-relaxed">
                Receive your keys and start creating memories in your beautiful new home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-amber-600 font-semibold text-lg mb-4 tracking-wide uppercase">
                Market Insights
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif">
                Texas Real Estate Market
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Texas continues to be one of the fastest-growing states in the nation, 
                with strong job growth and excellent quality of life attracting families 
                from across the country.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Strong Appreciation</h4>
                    <p className="text-slate-600">Home values in our communities have shown consistent growth year over year.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Quality of Life</h4>
                    <p className="text-slate-600">Excellent schools, low crime rates, and family-friendly communities.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Smart Investment</h4>
                    <p className="text-slate-600">Our homes are designed to retain value and provide excellent returns.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="Texas Community"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold text-amber-600 mb-2">$849K</div>
                <div className="text-slate-600">Average Home Value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-amber-600 to-amber-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern"></div>
        <div className="container-max text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-10 text-amber-100 max-w-3xl mx-auto leading-relaxed">
            Contact our team today to schedule a tour or learn more about our 
            available properties and communities. Your dream home awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact" className="bg-white text-amber-700 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Schedule a Tour
            </Link>
            <Link to="/properties" className="btn-outline">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-amber-400 transition-colors duration-200"
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Premium Real Estate Video Tour"
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;