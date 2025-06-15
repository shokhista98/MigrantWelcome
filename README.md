# Daejeon Foreign Residents Information Portal

## Overview

This project is a bilingual web portal designed to serve foreign residents in Daejeon, South Korea. The website functions as an Information & Referral (I&R) hub, providing essential resources and links to external services for students, foreign workers, and marriage immigrants. The portal aims to help foreign residents settle more easily and minimize daily life inconveniences by providing practical, integrated living information.

## System Architecture

### Frontend Architecture
- **Static HTML/CSS/JavaScript Website**: Simple, maintainable architecture using vanilla web technologies
- **Bootstrap 5.3.0**: Responsive design framework for consistent UI components and mobile-first approach
- **Font Awesome 6.0.0**: Icon library for visual elements and improved user experience
- **CDN-based Dependencies**: External libraries loaded via CDN for faster initial setup and reduced bundle size

### Server Architecture
- **Python HTTP Server**: Simple development server using Python's built-in `http.server` module
- **Port 5000**: Default serving port for local development and deployment
- **Static File Serving**: Direct file serving without backend processing or database requirements

## Key Components

### 1. Navigation System
- **Multilingual Navigation Bar**: Bootstrap-based responsive navbar with language-specific content
- **Active State Management**: Visual indication of current page location
- **Mobile-Responsive Design**: Collapsible navigation for mobile devices

### 2. Language Support System
- **Dual Language Content**: Korean (primary) and English (secondary) with inline language switching
- **Language Attribute Strategy**: Uses `lang` attributes and CSS display properties for content toggling
- **Extensible Structure**: Prepared for future addition of Vietnamese and Chinese languages

### 3. Content Organization
- **Section-Based Navigation**: Four main content areas (General Info, Language & Education, Family & Childcare, plus About)
- **External Link Integration**: Primary function is directing users to relevant external services
- **Card-Based Layout**: Information presented in digestible, visually appealing card components

### 4. User Interface Components
- **Bootstrap Components**: Cards, buttons, navigation, responsive grid system
- **Custom CSS Variables**: Consistent color scheme and styling through CSS custom properties
- **Accessibility Features**: Proper semantic HTML structure and ARIA attributes

## Data Flow

### 1. Static Content Delivery
- **Direct File Access**: HTML files served directly from filesystem
- **CSS/JS Loading**: Stylesheets and scripts loaded via link/script tags
- **CDN Resource Loading**: External libraries fetched from CDNs on page load

### 2. Language Switching
- **Client-Side Toggle**: JavaScript-based language switching without server requests
- **Content Visibility Control**: CSS display properties toggle between language versions
- **State Persistence**: Language preference potentially stored in localStorage

### 3. External Navigation
- **Direct Linking**: Users directed to external government and support services
- **New Tab/Window Opening**: External links open in new contexts to maintain portal session

## External Dependencies

### 1. CDN Resources
- **Bootstrap 5.3.0**: UI framework and responsive grid system
- **Font Awesome 6.0.0**: Icon library for visual elements
- **Justification**: Faster loading, automatic updates, reduced hosting requirements

### 2. External Service Integration
- **Government Services**: Links to official Korean government portals (Gov24, Immigration)
- **Local Support Centers**: Daejeon-specific foreign resident support organizations
- **Educational Resources**: Korean language learning and cultural integration services

### 3. Browser Dependencies
- **Modern Browser Support**: HTML5, CSS3, ES6+ JavaScript features
- **Responsive Design**: CSS Grid and Flexbox for layout
- **Web Fonts**: System fonts with fallbacks for consistent typography

## Deployment Strategy

### 1. Development Environment
- **Python HTTP Server**: Simple local development using `python -m http.server 5000`
- **Hot Reloading**: Manual refresh required for content changes
- **Local Testing**: Complete functionality available in development mode

### 2. Production Deployment
- **Static File Hosting**: Compatible with any static hosting service (Netlify, GitHub Pages, Vercel)
- **CDN Distribution**: Static assets can be distributed via CDN for global performance
- **Zero Backend Requirements**: No server-side processing or database needed

### 3. Maintenance Strategy
- **Simple Content Updates**: HTML file editing for content changes
- **CSS Customization**: Centralized styling through custom CSS variables
- **Scalable Architecture**: Easy addition of new pages and content sections

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```