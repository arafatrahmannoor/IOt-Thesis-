<div align="center">
  <img src="public/images/logo/logo-icon.svg" alt="SmartRecruit Logo" width="120" height="120">
  
  <h1>SmartRecruit Admin Panel</h1>
  
  <p>A comprehensive admin dashboard for managing recruitment processes, talent profiles, courses, and industry content.</p>
  
  <p>
    <strong>Live Preview:</strong> <a href="https://admin.smartrecruit.com">https://admin.smartrecruit.com</a>
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Modules](#modules)
  - [Industry Module](#industry-module)
    - [Banner](#banner)
    - [Talents Categories](#talents-categories)
    - [Our Talents](#our-talents)
  - [Jobs Module](#jobs-module)
  - [Career Jobs Module](#career-jobs-module)
  - [Courses Module](#courses-module)
  - [Instructors Module](#instructors-module)
  - [Blogs Module](#blogs-module)
  - [Success Stories Module](#success-stories-module)
  - [Media Module](#media-module)
  - [Profile Module](#profile-module)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SmartRecruit Admin Panel is a modern, responsive admin dashboard built with React and TypeScript. It provides comprehensive management tools for recruitment agencies, educational institutions, and talent management platforms.

### Key Highlights

- 🎨 Modern, responsive UI design
- ⚡ Fast performance with Vite build tool
- 🔒 Secure authentication and role-based access
- 📱 Mobile-first responsive design
- 🛠️ Full CRUD operations for all modules
- 📊 Real-time data and analytics
- 🎥 Media management with file uploads
- 📝 Rich text editing capabilities

---

## Features

- **Dashboard Analytics** - Comprehensive overview with charts and statistics
- **User Management** - Role-based access control and user profiles
- **Content Management** - Full CRUD operations for all content types
- **Media Management** - File uploads, image optimization, and media library
- **Real-time Updates** - Live data synchronization across modules
- **Search & Filtering** - Advanced search and filter capabilities
- **Responsive Design** - Optimized for all device sizes
- **Error Handling** - Comprehensive error boundaries and user feedback
- **Loading States** - Enhanced UX with proper loading indicators

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Ant Design, Tailwind CSS
- **State Management**: Redux Toolkit, RTK Query
- **Routing**: React Router v6
- **Forms**: Formik, Yup validation
- **Charts**: ApexCharts, Recharts
- **Icons**: Lucide React, Font Awesome
- **Build Tool**: Vite
- **Linting**: ESLint, TypeScript ESLint

---

## Modules

### Industry Module

The Industry module manages talent profiles, categories, and industry-specific content.

#### Banner

**Pages:**

- **Banner Management** (`/industries/banner`) - Industry banner CRUD operations
- **Edit Banner** (`/industries/banner/edit/:id`) - Banner editing page

**Features:**

- Banner creation and management
- Image and video upload
- Banner status management
- Industry-specific banner display

#### Talents Categories

**Pages:**

- **Talent Categories** (`/industries/talents-categories`) - Category management with real-time talent counting

**Features:**

- Category CRUD operations
- Real-time talent counting
- Category-based organization
- Search and filtering

#### Our Talents

**Pages:**

- **Our Talents** (`/industries/our-talents`) - Talent profiles showcase
- **Add New Talent** (`/industries/talents/add-new`) - Talent creation form
- **Edit Talent** (`/industries/talents/edit/:id`) - Talent editing functionality

**Features:**

- **Talent Management**: Complete CRUD operations for talent profiles
- **Video Integration**: YouTube video links for talent showcases
- **File Uploads**: Profile photo and media file management
- **Search & Filter**: Advanced filtering by category and search terms
- **Real-time Statistics**: Live talent counts and category statistics

#### Technical Details

- **API Integration**: Full REST API integration with error handling
- **File Upload**: Support for image and video file uploads
- **Responsive Design**: Mobile-first approach with modern UI
- **Loading States**: Comprehensive loading indicators and error handling
- **Form Validation**: Client-side validation with user feedback

### Jobs Module

#### Pages

- **All Jobs** (`/jobs`) - Job listings management
- **Add New Job** (`/jobs/add-new`) - Job creation form
- **Edit Job** (`/jobs/edit/:id`) - Job editing functionality
- **Job Applications** (`/jobs/applications`) - Application management

#### Features

- Job posting management
- Application tracking
- Job status management
- Search and filtering

### Career Jobs Module

#### Pages

- **Career Jobs** (`/career-jobs`) - Career job listings
- **Add New Career Job** (`/career-jobs/add-new`) - Career job creation
- **Edit Career Job** (`/career-jobs/edit/:id`) - Career job editing
- **Career Applications** (`/career-jobs/applications`) - Career application management

#### Features

- Career-specific job management
- Application processing
- Status tracking
- Advanced filtering

### Courses Module

#### Pages

- **All Courses** (`/courses`) - Course management
- **Add New Course** (`/courses/add-new`) - Course creation
- **Edit Course** (`/courses/edit/:slug`) - Course editing
- **Course Enrollments** (`/courses/enrollments`) - Enrollment management

#### Features

- Course content management
- Enrollment tracking
- Course categorization
- Progress monitoring

### Instructors Module

#### Pages

- **All Instructors** (`/instructors`) - Instructor management
- **Add New Instructor** (`/instructors/add-new`) - Instructor creation
- **Edit Instructor** (`/instructors/edit/:id`) - Instructor editing

#### Features

- Instructor profile management
- Course assignment
- Performance tracking
- Bio and credentials management

### Blogs Module

#### Pages

- **All Blogs** (`/blogs`) - Blog management
- **Add New Blog** (`/blogs/add-new`) - Blog creation
- **Edit Blog** (`/blogs/edit/:slug`) - Blog editing

#### Features

- Rich text editing
- Blog categorization
- SEO optimization
- Publication management

### Success Stories Module

#### Pages

- **All Stories** (`/success-stories`) - Success story management
- **Add New Story** (`/success-stories/add-new`) - Story creation
- **Edit Story** (`/success-stories/edit/:id`) - Story editing

#### Features

- Story content management
- Media integration
- Testimonial management
- Publication workflow

### Media Module

#### Pages

- **Media Library** (`/media`) - Media file management

#### Features

- File upload and management
- Image optimization
- Media categorization
- Bulk operations

### Profile Module

#### Pages

- **User Profile** (`/profile`) - User profile management

#### Features

- Profile information management
- Password updates
- Settings configuration
- Activity tracking

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/admin.smartrecruit.git
   cd admin.smartrecruit
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5002`

### Build for Production

```bash
npm run build
# or
yarn build
```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chart/          # Chart components
│   ├── common/         # Common components
│   ├── form/           # Form components
│   ├── header/         # Header components
│   ├── modals/         # Modal components
│   ├── shared/         # Shared components
│   ├── table/          # Table components
│   └── ui/             # UI components
├── config/             # Configuration files
├── context/            # React context providers
├── data/               # Static data and constants
├── icons/              # SVG icons
├── layout/             # Layout components
├── pages/              # Page components
│   ├── AuthPages/      # Authentication pages
│   ├── Blog/           # Blog pages
│   ├── CareerJobApplications/
│   ├── CareerJobs/     # Career job pages
│   ├── Courses/        # Course pages
│   ├── Dashboard/      # Dashboard pages
│   ├── Industry/       # Industry module pages
│   ├── Instructors/    # Instructor pages
│   ├── JobApplications/
│   ├── Jobs/           # Job pages
│   ├── Media/          # Media pages
│   ├── OtherPage/      # Other pages
│   ├── Profile/        # Profile pages
│   └── SuccessStory/   # Success story pages
├── redux/              # Redux store and API
│   ├── api/            # API configuration
│   └── features/       # Feature-specific slices
├── routes/             # Routing configuration
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

---

## API Integration

The application uses Redux Toolkit Query (RTK Query) for API integration:

- **Base API**: Centralized API configuration
- **Feature APIs**: Module-specific API endpoints
- **Caching**: Automatic response caching
- **Error Handling**: Comprehensive error management
- **Loading States**: Built-in loading state management

### API Endpoints

- **Authentication**: User login, profile management
- **Industry**: Banner, category, and talent management
- **Jobs**: Job posting and application management
- **Courses**: Course content and enrollment management
- **Media**: File upload and management
- **Blogs**: Content management system

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

<div align="center">
  <p>Built with ❤️ by the SmartRecruit Team</p>
</div>
