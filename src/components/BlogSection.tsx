import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Top 10 Luxury Neighborhoods in Dallas for 2024',
    excerpt: 'Discover the most prestigious neighborhoods in Dallas offering luxury homes, excellent schools, and world-class amenities. From Highland Park to Preston Hollow, find your perfect community.',
    date: '2024-01-15',
    category: 'Dallas Real Estate',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    slug: 'top-luxury-neighborhoods-dallas-2024'
  },
  {
    id: '2',
    title: 'Investment Opportunities in Houston Real Estate Market',
    excerpt: 'Explore the booming Houston real estate market and discover prime investment opportunities. From single-family homes to multi-unit properties, learn where to invest for maximum returns.',
    date: '2024-01-10',
    category: 'Investment',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    slug: 'houston-real-estate-investment-opportunities'
  },
  {
    id: '3',
    title: 'New Construction Homes in Austin: What Buyers Need to Know',
    excerpt: 'Everything you need to know about buying new construction homes in Austin. From builder reputation to customization options, make informed decisions for your dream home.',
    date: '2024-01-05',
    category: 'New Construction',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    slug: 'new-construction-homes-austin-guide'
  },
  {
    id: '4',
    title: 'San Antonio Real Estate: Family-Friendly Communities Guide',
    excerpt: 'Find the perfect family-friendly community in San Antonio. Discover neighborhoods with excellent schools, parks, and amenities perfect for growing families.',
    date: '2024-01-01',
    category: 'San Antonio Real Estate',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    slug: 'san-antonio-family-friendly-communities'
  },
  {
    id: '5',
    title: 'Texas Real Estate Market Trends: 2024 Forecast',
    excerpt: 'Get insights into the Texas real estate market trends for 2024. Learn about price predictions, inventory levels, and market opportunities across major Texas cities.',
    date: '2023-12-28',
    category: 'Market Trends',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    slug: 'texas-real-estate-market-trends-2024'
  },
  {
    id: '6',
    title: 'Luxury Home Features That Increase Property Value',
    excerpt: 'Discover the luxury home features that significantly increase property value in Texas. From smart home technology to premium finishes, learn what buyers are looking for.',
    date: '2023-12-20',
    category: 'Luxury Homes',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    slug: 'luxury-home-features-increase-value'
  }
];

const BlogSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container-max px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Texas Real Estate Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed with the latest real estate trends, market insights, and expert advice 
            for buying and selling properties across Texas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            View All Articles
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection; 