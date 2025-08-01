# Premium Real Estate Portfolio Website

A modern, responsive real estate portfolio website built with React, TypeScript, and Tailwind CSS. This website showcases luxury homes and communities across Texas, featuring property listings, community information, and comprehensive contact forms.

## Features

### 🏠 Property Management
- **Property Listings**: Browse available homes with detailed information
- **Advanced Filtering**: Filter by price, bedrooms, bathrooms, square footage, and more
- **Search Functionality**: Search properties by title, address, or city
- **Quick Move-In Homes**: Special highlighting for move-in ready properties
- **Property Details**: Comprehensive property pages with image galleries

### 🏘️ Community Information
- **Community Listings**: Explore different communities and their amenities
- **School Information**: Nearby schools with ratings and distances
- **Amenities Display**: Community features and facilities
- **Location Details**: Maps and location information

### 🎨 Modern Design
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Image Galleries**: Interactive image carousels for properties and communities
- **Professional Branding**: Consistent color scheme and typography

### 📱 User Experience
- **Intuitive Navigation**: Easy-to-use navigation with breadcrumbs
- **Contact Forms**: Multiple contact forms throughout the site
- **Call-to-Action**: Strategic CTAs to encourage user engagement
- **Loading States**: Smooth loading and transition effects

### 🔧 Technical Features
- **TypeScript**: Full type safety and better development experience
- **React Router**: Client-side routing for smooth navigation
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide Icons**: Beautiful, consistent iconography
- **Responsive Design**: Mobile-first approach

## Pages

1. **Homepage** - Hero section, featured properties, company highlights
2. **Properties** - Property listings with filtering and search
3. **Property Detail** - Individual property pages with galleries
4. **Communities** - Community listings and information
5. **Community Detail** - Detailed community pages with amenities
6. **About** - Company information, team, and values
7. **Contact** - Contact forms and office information

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Create React App
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the website.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── PropertyCard.tsx # Property display card
│   └── CommunityCard.tsx # Community display card
├── pages/              # Page components
│   ├── HomePage.tsx    # Homepage
│   ├── PropertiesPage.tsx # Property listings
│   ├── PropertyDetailPage.tsx # Individual property
│   ├── CommunitiesPage.tsx # Community listings
│   ├── CommunityDetailPage.tsx # Individual community
│   ├── AboutPage.tsx   # About page
│   └── ContactPage.tsx # Contact page
├── data/               # Sample data
│   ├── properties.ts   # Property data
│   └── communities.ts  # Community data
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── index.css           # Global styles
```

## Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... more shades
  }
}
```

### Content
- Property data: Edit `src/data/properties.ts`
- Community data: Edit `src/data/communities.ts`
- Company information: Update contact details in components

### Styling
- Global styles: Modify `src/index.css`
- Component styles: Use Tailwind classes or add custom CSS

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **AWS S3**: Upload the `build` folder to an S3 bucket
- **GitHub Pages**: Use `gh-pages` package

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email info@premiumrealestate.com or call (972) 410-5701.

---

**Premium Real Estate** - Building exceptional homes and communities across Texas since 1999. 