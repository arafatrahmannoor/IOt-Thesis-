<div align="center">
  <img src="docs/logo-icon.svg" alt="SmartRecruit Logo" width="120" height="120">
  
  <h1>SmartRecruit Backend API</h1>
  
  <p>A comprehensive Node.js backend API for managing recruitment processes, talent profiles, courses, job postings, worker management, and industry content with dynamic talent hub functionality. Features include multi-page CMS, user management, course enrollment, job applications, and comprehensive admin dashboard.</p>
  
  <p>
    <strong>API Base URL:</strong> <a href="https://api.smartrecruit.agency">https://api.smartrecruit.agency</a>
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [API Modules](#api-modules)
  - [actionLog](#actionlog)
  - [auth](#auth)
  - [blog](#blog)
  - [careerJob](#careerjob)
  - [careerJobApplication](#careerjobapplication)
  - [contact](#contact)
  - [course](#course)
  - [dashboard](#dashboard)
  - [enrolledCourse](#enrolledcourse)
  - [getInTouch](#getintouch)
  - [industry](#industry)
  - [industryCategory](#industrycategory)
  - [industryTalents](#industrytalents)
  - [instructor](#instructor)
  - [JobApplication](#jobapplication)
  - [jobs](#jobs)
  - [media](#media)
  - [our-team](#our-team)
  - [pages](#pages)
    - [about](#about)
    - [employer](#employer)
    - [home](#home)
    - [partner](#partner)
    - [skill-training](#skill-training)
    - [termsAndPrivacy](#termsandprivacy)
    - [visaAndRelocation](#visaandrelocation)
  - [studentReview](#studentreview)
  - [successStory](#successstory)
  - [user](#user)
  - [verify-captcha](#verify-captcha)
  - [workerRequest](#workerrequest)
  - [workerStory](#workerstory)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SmartRecruit Backend API is a robust, scalable Node.js backend service built with Express.js and TypeScript. It provides comprehensive management tools for recruitment agencies, educational institutions, and talent management platforms. The platform features a dynamic talent hub, multi-page content management system, job posting and application management, course enrollment system, worker management, and comprehensive admin dashboard with analytics.

### Key Highlights

- 🚀 **High Performance** - Built with Express.js and TypeScript
- 🔒 **Secure Authentication** - JWT-based authentication with role-based access control
- 📱 **RESTful API** - Clean, well-structured REST endpoints
- 🛠️ **Full CRUD Operations** - Complete data management for all modules
- 📊 **Real-time Data** - Live data synchronization and updates
- 🎥 **Media Management** - Cloudinary integration for file uploads
- 📝 **Data Validation** - Zod schema validation for all inputs
- 🔄 **Error Handling** - Comprehensive error management and logging
- 📈 **Scalable Architecture** - Modular design for easy maintenance

## Features

### Core Platform Features

- **Dynamic Talent Hub** - Industry-specific talent showcase with categories and profiles
- **Multi-Page CMS** - Complete content management for all website pages
- **User Management** - Role-based access control (Super Admin, Admin, User, Publisher, Editor)
- **Job Management** - Comprehensive job posting and application system
- **Course Management** - Educational content and enrollment system
- **Blog System** - Content publishing and management platform

### Content Management

- **Page Management** - Home, About, Partner, Employer, Skill Training, Visa & Relocation, Terms & Privacy
- **Industry Management** - Industry configurations and talent categories
- **Team Management** - Team member profiles and social links
- **Success Stories** - Worker and student success story management
- **Student Reviews** - Feedback and review system
- **Worker Management** - Worker requests and story management

### Technical Features

- **Media Management** - Cloudinary integration for file uploads and optimization
- **Real-time Updates** - Live data synchronization across modules
- **Search & Filtering** - Advanced search and filter capabilities
- **File Upload** - Support for images, videos, and documents
- **Email Integration** - Nodemailer for email notifications and templates
- **Payment Integration** - SSLCommerz payment gateway integration
- **Action Logging** - Comprehensive audit trail for all operations
- **Captcha Verification** - Security verification for forms
- **Dashboard Analytics** - Admin dashboard with statistics and insights
- **Contact Management** - Contact forms and inquiry management

---

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21+
- **Language**: TypeScript 5.7+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer with Cloudinary
- **Validation**: Zod schema validation
- **Email**: Nodemailer
- **Payment**: SSLCommerz
- **Security**: bcrypt for password hashing
- **Development**: ts-node-dev for hot reloading
- **Build Tool**: TypeScript Compiler

---

## API Modules

### actionLog

Tracks and logs all user actions for audit purposes.

**Table of Contents:**

- [Get All Action Logs](#get-all-action-logs)
- [Get Single Action Log](#get-single-action-log)

#### Get All Action Logs

- `GET /api/action-logs` - Get all action logs (Admin only)

**Request:**

```bash
GET /api/action-logs?page=1&limit=10&searchTerm=login
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Action logs fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c90",
      "action": "LOGIN",
      "user": {
        "_id": "68c8eab32a54cb567a2a0c91",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-01-16T05:00:00.000Z",
      "details": "User logged in successfully"
    }
  ]
}
```

#### Get Single Action Log

- `GET /api/action-logs/:id` - Get single action log

**Request:**

```bash
GET /api/action-logs/68c8eab32a54cb567a2a0c90
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Action log fetched successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c90",
    "action": "LOGIN",
    "user": {
      "_id": "68c8eab32a54cb567a2a0c91",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2025-01-16T05:00:00.000Z",
    "details": "User logged in successfully"
  }
}
```

### auth

Authentication and authorization system with JWT tokens.

**Table of Contents:**

- [User Login](#user-login)
- [Refresh Token](#refresh-token)
- [Change Password](#change-password)

#### User Login

- `POST /api/auth/login` - User login

**Request:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@smartrecruit.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "68c8eab32a54cb567a2a0c90",
      "email": "admin@smartrecruit.com",
      "role": "SUPER_ADMIN",
      "name": "Admin User"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": {
    "code": "INVALID_CREDENTIALS",
    "details": "The provided email or password is incorrect"
  }
}
```

#### Refresh Token

- `POST /api/auth/refresh-token` - Refresh access token

**Request:**

```bash
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": {
    "code": "INVALID_REFRESH_TOKEN",
    "details": "The provided refresh token is invalid or expired"
  }
}
```

#### Change Password

- `POST /api/auth/change-password` - Change user password (Admin/User only)

**Request:**

```bash
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": {
    "user": {
      "_id": "68c8eab32a54cb567a2a0c91",
      "email": "john@example.com"
    }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Current password is incorrect",
  "error": {
    "code": "INVALID_CURRENT_PASSWORD",
    "details": "The provided current password is incorrect"
  }
}
```

### blog

Blog management system for content publishing.

**Table of Contents:**

- [Create Blog](#create-blog)
- [Get All Blogs](#get-all-blogs)
- [Get Single Blog](#get-single-blog)
- [Update Blog](#update-blog)
- [Delete Blog](#delete-blog)

#### Create Blog

- `POST /api/blogs/create` - Create blog (Admin only)

**Request:**

```bash
POST /api/blogs/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Getting Started with React Hooks",
  "content": "React Hooks revolutionized how we write functional components...",
  "excerpt": "Learn the basics of React Hooks and how to use them effectively",
  "author": "68c8eab32a54cb567a2a0c95",
  "category": "React",
  "tags": ["react", "hooks", "javascript"],
  "featuredImage": "https://example.com/blog-image.jpg",
  "status": "PUBLISHED"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Blog created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c96",
    "title": "Getting Started with React Hooks",
    "content": "React Hooks revolutionized how we write functional components...",
    "excerpt": "Learn the basics of React Hooks and how to use them effectively",
    "author": {
      "_id": "68c8eab32a54cb567a2a0c95",
      "name": "Jane Smith"
    },
    "category": "React",
    "tags": ["react", "hooks", "javascript"],
    "featuredImage": "https://example.com/blog-image.jpg",
    "status": "PUBLISHED",
    "slug": "getting-started-with-react-hooks",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "content",
        "message": "Content is required"
      }
    ]
  }
}
```

#### Get All Blogs

- `GET /api/blogs` - Get all blogs

**Request:**

```bash
GET /api/blogs?page=1&limit=10&category=react&status=published
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blogs fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c96",
      "title": "Getting Started with React Hooks",
      "excerpt": "Learn the basics of React Hooks...",
      "author": {
        "_id": "68c8eab32a54cb567a2a0c95",
        "name": "Jane Smith"
      },
      "category": "React",
      "tags": ["react", "hooks", "javascript"],
      "featuredImage": "https://example.com/blog-image.jpg",
      "status": "PUBLISHED",
      "slug": "getting-started-with-react-hooks",
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred while fetching blogs"
  }
}
```

#### Get Single Blog

- `GET /api/blogs/:slug` - Get single blog by slug

**Request:**

```bash
GET /api/blogs/getting-started-with-react-hooks
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog fetched successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c96",
    "title": "Getting Started with React Hooks",
    "content": "React Hooks revolutionized how we write functional components...",
    "excerpt": "Learn the basics of React Hooks and how to use them effectively",
    "author": {
      "_id": "68c8eab32a54cb567a2a0c95",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "category": "React",
    "tags": ["react", "hooks", "javascript"],
    "featuredImage": "https://example.com/blog-image.jpg",
    "status": "PUBLISHED",
    "slug": "getting-started-with-react-hooks",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Blog not found",
  "error": {
    "code": "BLOG_NOT_FOUND",
    "details": "No blog found with the provided slug"
  }
}
```

#### Update Blog

- `PATCH /api/blogs/:slug` - Update blog by slug (Admin only)

**Request:**

```bash
PATCH /api/blogs/getting-started-with-react-hooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced React Hooks Patterns",
  "status": "PUBLISHED"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog updated successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c96",
    "title": "Advanced React Hooks Patterns",
    "content": "React Hooks revolutionized how we write functional components...",
    "excerpt": "Learn the basics of React Hooks and how to use them effectively",
    "author": {
      "_id": "68c8eab32a54cb567a2a0c95",
      "name": "Jane Smith"
    },
    "category": "React",
    "tags": ["react", "hooks", "javascript"],
    "featuredImage": "https://example.com/blog-image.jpg",
    "status": "PUBLISHED",
    "slug": "advanced-react-hooks-patterns",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:30:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Blog not found",
  "error": {
    "code": "BLOG_NOT_FOUND",
    "details": "No blog found with the provided slug"
  }
}
```

#### Delete Blog

- `DELETE /api/blogs/:slug` - Delete blog by slug (Admin only)

**Request:**

```bash
DELETE /api/blogs/getting-started-with-react-hooks
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Blog deleted successfully"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Blog not found",
  "error": {
    "code": "BLOG_NOT_FOUND",
    "details": "No blog found with the provided slug"
  }
}
```

### careerJob

Career job postings management.

**Table of Contents:**

- [Create Career Job](#create-career-job)
- [Get All Career Jobs](#get-all-career-jobs)
- [Get Single Career Job](#get-single-career-job)
- [Update Career Job](#update-career-job)
- [Delete Career Job](#delete-career-job)
- [Career Job Application](#career-job-application)

#### Create Career Job

- `POST /api/career-jobs/create-career-job` - Create career job (Admin only)

**Request:**

```bash
POST /api/career-jobs/create-career-job
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Frontend Developer",
  "company": "Tech Solutions Ltd",
  "location": "Dhaka, Bangladesh",
  "description": "We are looking for an experienced frontend developer to join our team...",
  "requirements": ["3+ years React experience", "TypeScript", "Next.js", "Tailwind CSS"],
  "responsibilities": ["Develop user interfaces", "Collaborate with design team", "Optimize performance"],
  "salary": "60000-90000",
  "employmentType": "FULL_TIME",
  "experienceLevel": "SENIOR",
  "jobType": "PERMANENT",
  "benefits": ["Health insurance", "Remote work", "Learning budget"],
  "applicationDeadline": "2025-02-15T23:59:59.000Z",
  "isActive": true
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Career job created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c200",
    "title": "Senior Frontend Developer",
    "company": "Tech Solutions Ltd",
    "location": "Dhaka, Bangladesh",
    "description": "We are looking for an experienced frontend developer to join our team...",
    "requirements": [
      "3+ years React experience",
      "TypeScript",
      "Next.js",
      "Tailwind CSS"
    ],
    "responsibilities": [
      "Develop user interfaces",
      "Collaborate with design team",
      "Optimize performance"
    ],
    "salary": "60000-90000",
    "employmentType": "FULL_TIME",
    "experienceLevel": "SENIOR",
    "jobType": "PERMANENT",
    "benefits": ["Health insurance", "Remote work", "Learning budget"],
    "applicationDeadline": "2025-02-15T23:59:59.000Z",
    "isActive": true,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "company",
        "message": "Company is required"
      }
    ]
  }
}
```

#### Get All Career Jobs

- `GET /api/career-jobs` - Get all career jobs

**Request:**

```bash
GET /api/career-jobs?page=1&limit=10&location=dhaka&employmentType=FULL_TIME&experienceLevel=SENIOR
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career jobs fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c200",
      "title": "Senior Frontend Developer",
      "company": "Tech Solutions Ltd",
      "location": "Dhaka, Bangladesh",
      "salary": "60000-90000",
      "employmentType": "FULL_TIME",
      "experienceLevel": "SENIOR",
      "isActive": true,
      "applicationDeadline": "2025-02-15T23:59:59.000Z",
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred while fetching career jobs"
  }
}
```

#### Get Single Career Job

- `GET /api/career-jobs/:id` - Get single career job

**Request:**

```bash
GET /api/career-jobs/68c8eab32a54cb567a2a0c200
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career job fetched successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c200",
    "title": "Senior Frontend Developer",
    "company": "Tech Solutions Ltd",
    "location": "Dhaka, Bangladesh",
    "description": "We are looking for an experienced frontend developer to join our team...",
    "requirements": [
      "3+ years React experience",
      "TypeScript",
      "Next.js",
      "Tailwind CSS"
    ],
    "responsibilities": [
      "Develop user interfaces",
      "Collaborate with design team",
      "Optimize performance"
    ],
    "salary": "60000-90000",
    "employmentType": "FULL_TIME",
    "experienceLevel": "SENIOR",
    "jobType": "PERMANENT",
    "benefits": ["Health insurance", "Remote work", "Learning budget"],
    "applicationDeadline": "2025-02-15T23:59:59.000Z",
    "isActive": true,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Career job not found",
  "error": {
    "code": "CAREER_JOB_NOT_FOUND",
    "details": "No career job found with the provided ID"
  }
}
```

#### Update Career Job

- `PATCH /api/career-jobs/:id` - Update career job (Admin only)

**Request:**

```bash
PATCH /api/career-jobs/68c8eab32a54cb567a2a0c200
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lead Frontend Developer",
  "salary": "70000-100000",
  "benefits": ["Health insurance", "Remote work", "Learning budget", "Stock options"]
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career job updated successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c200",
    "title": "Lead Frontend Developer",
    "company": "Tech Solutions Ltd",
    "location": "Dhaka, Bangladesh",
    "description": "We are looking for an experienced frontend developer to join our team...",
    "requirements": [
      "3+ years React experience",
      "TypeScript",
      "Next.js",
      "Tailwind CSS"
    ],
    "responsibilities": [
      "Develop user interfaces",
      "Collaborate with design team",
      "Optimize performance"
    ],
    "salary": "70000-100000",
    "employmentType": "FULL_TIME",
    "experienceLevel": "SENIOR",
    "jobType": "PERMANENT",
    "benefits": [
      "Health insurance",
      "Remote work",
      "Learning budget",
      "Stock options"
    ],
    "applicationDeadline": "2025-02-15T23:59:59.000Z",
    "isActive": true,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:30:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Career job not found",
  "error": {
    "code": "CAREER_JOB_NOT_FOUND",
    "details": "No career job found with the provided ID"
  }
}
```

#### Delete Career Job

- `DELETE /api/career-jobs/:id` - Delete career job (Admin only)

**Request:**

```bash
DELETE /api/career-jobs/68c8eab32a54cb567a2a0c200
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career job deleted successfully"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Career job not found",
  "error": {
    "code": "CAREER_JOB_NOT_FOUND",
    "details": "No career job found with the provided ID"
  }
}
```

#### Career Job Application

- `POST /api/career-jobs/apply` - Apply for career job (with CV upload)

**Request:**

```bash
POST /api/career-jobs/apply
Content-Type: multipart/form-data

jobId: "68c8eab32a54cb567a2a0c200"
fullName: "John Doe"
email: "john.doe@example.com"
phone: "+8801234567890"
coverLetter: "I am very interested in this position..."
cv: [PDF file]
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Career job application submitted successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c201",
    "jobId": "68c8eab32a54cb567a2a0c200",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+8801234567890",
    "coverLetter": "I am very interested in this position...",
    "cvUrl": "https://res.cloudinary.com/example/cv/john-doe-cv.pdf",
    "status": "PENDING",
    "appliedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Application submission failed",
  "error": {
    "code": "APPLICATION_ERROR",
    "details": "CV file is required and must be in PDF format"
  }
}
```

### careerJobApplication

Career job application management.

**Table of Contents:**

- [Get All Career Job Applications](#get-all-career-job-applications)
- [Get My Career Job Applications](#get-my-career-job-applications)
- [Get Single Career Job Application](#get-single-career-job-application)
- [Update Career Job Application](#update-career-job-application)
- [Delete Career Job Application](#delete-career-job-application)

#### Get All Career Job Applications

- `GET /api/career-job-application` - Get all career job applications (Admin only)

**Request:**

```bash
GET /api/career-job-application?page=1&limit=10&status=PENDING&jobId=68c8eab32a54cb567a2a0c200
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career job applications fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c201",
      "jobId": "68c8eab32a54cb567a2a0c200",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+8801234567890",
      "status": "PENDING",
      "appliedAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred while fetching applications"
  }
}
```

#### Get My Career Job Applications

- `GET /api/career-job-application/my-career-job-applications` - Get my career job applications (User only)

**Request:**

```bash
GET /api/career-job-application/my-career-job-applications?page=1&limit=10&status=PENDING
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "My career job applications fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c201",
      "jobId": "68c8eab32a54cb567a2a0c200",
      "jobTitle": "Senior Frontend Developer",
      "company": "Tech Solutions Ltd",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+8801234567890",
      "status": "PENDING",
      "appliedAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized access",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "You must be logged in to view your applications"
  }
}
```

#### Get Single Career Job Application

- `GET /api/career-job-application/:id` - Get single career job application (Admin only)

**Request:**

```bash
GET /api/career-job-application/68c8eab32a54cb567a2a0c201
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career job application fetched successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c201",
    "jobId": "68c8eab32a54cb567a2a0c200",
    "jobTitle": "Senior Frontend Developer",
    "company": "Tech Solutions Ltd",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+8801234567890",
    "coverLetter": "I am very interested in this position and believe my skills align perfectly with your requirements...",
    "cvUrl": "https://res.cloudinary.com/example/cv/john-doe-cv.pdf",
    "status": "PENDING",
    "appliedAt": "2025-01-16T05:00:00.000Z",
    "reviewedAt": null,
    "notes": ""
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Career job application not found",
  "error": {
    "code": "APPLICATION_NOT_FOUND",
    "details": "No career job application found with the provided ID"
  }
}
```

#### Update Career Job Application

- `PATCH /api/career-job-application/:id` - Update career job application (Admin only)

**Request:**

```bash
PATCH /api/career-job-application/68c8eab32a54cb567a2a0c201
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "REVIEWED",
  "notes": "Strong candidate with relevant experience"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career job application updated successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c201",
    "jobId": "68c8eab32a54cb567a2a0c200",
    "jobTitle": "Senior Frontend Developer",
    "company": "Tech Solutions Ltd",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+8801234567890",
    "coverLetter": "I am very interested in this position...",
    "cvUrl": "https://res.cloudinary.com/example/cv/john-doe-cv.pdf",
    "status": "REVIEWED",
    "appliedAt": "2025-01-16T05:00:00.000Z",
    "reviewedAt": "2025-01-16T06:00:00.000Z",
    "notes": "Strong candidate with relevant experience"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Career job application not found",
  "error": {
    "code": "APPLICATION_NOT_FOUND",
    "details": "No career job application found with the provided ID"
  }
}
```

#### Delete Career Job Application

- `DELETE /api/career-job-application/:id` - Delete career job application (Admin only)

**Request:**

```bash
DELETE /api/career-job-application/68c8eab32a54cb567a2a0c201
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Career job application deleted successfully"
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Career job application not found",
  "error": {
    "code": "APPLICATION_NOT_FOUND",
    "details": "No career job application found with the provided ID"
  }
}
```

### contact

Contact information management.

**Table of Contents:**

- [Send Message](#send-message)

#### Send Message

- `POST /api/contact/send-message` - Send contact message

### course

Course management and enrollment system.

**Table of Contents:**

- [Create Course](#create-course)
- [Get All Courses](#get-all-courses)
- [Get Single Course](#get-single-course)
- [Update Course](#update-course)
- [Delete Course](#delete-course)

#### Create Course

- `POST /api/courses/create-course` - Create course (Admin only)

**Request:**

```bash
POST /api/courses/create-course
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Web Development Bootcamp",
  "description": "Learn full-stack web development from scratch with modern technologies",
  "slug": "complete-web-development-bootcamp",
  "image": "https://example.com/course-image.jpg",
  "category": "Web Development",
  "instructor": ["68c8eab32a54cb567a2a0c300", "68c8eab32a54cb567a2a0c301"],
  "banner": {
    "title": "Master Web Development in 12 Weeks",
    "description": "From HTML/CSS to React, Node.js, and MongoDB",
    "button_text": "Enroll Now",
    "button_href": "/enroll/web-development"
  },
  "overview": {
    "title": "What You'll Learn",
    "modules": [
      {
        "title": "HTML & CSS Fundamentals",
        "content": "Learn the basics of HTML structure and CSS styling"
      },
      {
        "title": "JavaScript Essentials",
        "content": "Master JavaScript programming concepts and ES6+ features"
      },
      {
        "title": "React Development",
        "content": "Build modern user interfaces with React and hooks"
      },
      {
        "title": "Node.js Backend",
        "content": "Create server-side applications with Node.js and Express"
      }
    ]
  },
  "training_approach": {
    "title": "Our Learning Methodology",
    "items": [
      {
        "icon": "fas fa-code",
        "title": "Hands-on Projects",
        "description": "Build real-world projects throughout the course"
      },
      {
        "icon": "fas fa-users",
        "title": "Live Sessions",
        "description": "Interactive live coding sessions with instructors"
      },
      {
        "icon": "fas fa-certificate",
        "title": "Certification",
        "description": "Get industry-recognized certification upon completion"
      }
    ]
  },
  "details": {
    "course_fee": {
      "amount": 25000,
      "currency": "BDT"
    },
    "duration": "12 weeks",
    "schedule": "Monday, Wednesday, Friday (7:00 PM - 9:00 PM)",
    "age_requirement": "18+ years",
    "social_links": [
      {
        "platform": "WhatsApp",
        "url": "https://wa.me/8801234567890"
      },
      {
        "platform": "LinkedIn",
        "url": "https://linkedin.com/company/smartrecruit"
      }
    ]
  }
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Course successfully posted",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c400",
    "title": "Complete Web Development Bootcamp",
    "description": "Learn full-stack web development from scratch with modern technologies",
    "slug": "complete-web-development-bootcamp",
    "image": "https://example.com/course-image.jpg",
    "category": "Web Development",
    "instructor": [
      {
        "_id": "68c8eab32a54cb567a2a0c300",
        "name": "John Smith",
        "email": "john@smartrecruit.com"
      },
      {
        "_id": "68c8eab32a54cb567a2a0c301",
        "name": "Sarah Johnson",
        "email": "sarah@smartrecruit.com"
      }
    ],
    "banner": {
      "title": "Master Web Development in 12 Weeks",
      "description": "From HTML/CSS to React, Node.js, and MongoDB",
      "button_text": "Enroll Now",
      "button_href": "/enroll/web-development"
    },
    "overview": {
      "title": "What You'll Learn",
      "modules": [
        {
          "title": "HTML & CSS Fundamentals",
          "content": "Learn the basics of HTML structure and CSS styling"
        },
        {
          "title": "JavaScript Essentials",
          "content": "Master JavaScript programming concepts and ES6+ features"
        },
        {
          "title": "React Development",
          "content": "Build modern user interfaces with React and hooks"
        },
        {
          "title": "Node.js Backend",
          "content": "Create server-side applications with Node.js and Express"
        }
      ]
    },
    "training_approach": {
      "title": "Our Learning Methodology",
      "items": [
        {
          "icon": "fas fa-code",
          "title": "Hands-on Projects",
          "description": "Build real-world projects throughout the course"
        },
        {
          "icon": "fas fa-users",
          "title": "Live Sessions",
          "description": "Interactive live coding sessions with instructors"
        },
        {
          "icon": "fas fa-certificate",
          "title": "Certification",
          "description": "Get industry-recognized certification upon completion"
        }
      ]
    },
    "details": {
      "course_fee": {
        "amount": 25000,
        "currency": "BDT"
      },
      "duration": "12 weeks",
      "schedule": "Monday, Wednesday, Friday (7:00 PM - 9:00 PM)",
      "age_requirement": "18+ years",
      "social_links": [
        {
          "platform": "WhatsApp",
          "url": "https://wa.me/8801234567890"
        },
        {
          "platform": "LinkedIn",
          "url": "https://linkedin.com/company/smartrecruit"
        }
      ]
    },
    "is_deleted": false,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "title",
        "message": "Course title is required"
      },
      {
        "field": "banner.title",
        "message": "Banner title is required"
      },
      {
        "field": "overview.modules",
        "message": "At least one module is required"
      }
    ]
  }
}
```

#### Get All Courses

- `GET /api/courses` - Get all courses

**Request:**

```bash
GET /api/courses?page=1&limit=10&category=Web Development&search=react
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All Courses",
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c400",
      "title": "Complete Web Development Bootcamp",
      "description": "Learn full-stack web development from scratch with modern technologies",
      "slug": "complete-web-development-bootcamp",
      "image": "https://example.com/course-image.jpg",
      "category": "Web Development",
      "instructor": [
        {
          "_id": "68c8eab32a54cb567a2a0c300",
          "name": "John Smith"
        }
      ],
      "banner": {
        "title": "Master Web Development in 12 Weeks",
        "description": "From HTML/CSS to React, Node.js, and MongoDB"
      },
      "details": {
        "course_fee": {
          "amount": 25000,
          "currency": "BDT"
        },
        "duration": "12 weeks",
        "schedule": "Monday, Wednesday, Friday (7:00 PM - 9:00 PM)"
      },
      "is_deleted": false,
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred while fetching courses"
  }
}
```

#### Get Single Course

- `GET /api/courses/:slug` - Get single course by slug

**Request:**

```bash
GET /api/courses/complete-web-development-bootcamp
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Single Course",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c400",
    "title": "Complete Web Development Bootcamp",
    "description": "Learn full-stack web development from scratch with modern technologies",
    "slug": "complete-web-development-bootcamp",
    "image": "https://example.com/course-image.jpg",
    "category": "Web Development",
    "instructor": [
      {
        "_id": "68c8eab32a54cb567a2a0c300",
        "name": "John Smith",
        "email": "john@smartrecruit.com",
        "bio": "Senior Full-Stack Developer with 8+ years experience"
      },
      {
        "_id": "68c8eab32a54cb567a2a0c301",
        "name": "Sarah Johnson",
        "email": "sarah@smartrecruit.com",
        "bio": "React Specialist and UI/UX Expert"
      }
    ],
    "banner": {
      "title": "Master Web Development in 12 Weeks",
      "description": "From HTML/CSS to React, Node.js, and MongoDB",
      "button_text": "Enroll Now",
      "button_href": "/enroll/web-development"
    },
    "overview": {
      "title": "What You'll Learn",
      "modules": [
        {
          "title": "HTML & CSS Fundamentals",
          "content": "Learn the basics of HTML structure and CSS styling"
        },
        {
          "title": "JavaScript Essentials",
          "content": "Master JavaScript programming concepts and ES6+ features"
        },
        {
          "title": "React Development",
          "content": "Build modern user interfaces with React and hooks"
        },
        {
          "title": "Node.js Backend",
          "content": "Create server-side applications with Node.js and Express"
        }
      ]
    },
    "training_approach": {
      "title": "Our Learning Methodology",
      "items": [
        {
          "icon": "fas fa-code",
          "title": "Hands-on Projects",
          "description": "Build real-world projects throughout the course"
        },
        {
          "icon": "fas fa-users",
          "title": "Live Sessions",
          "description": "Interactive live coding sessions with instructors"
        },
        {
          "icon": "fas fa-certificate",
          "title": "Certification",
          "description": "Get industry-recognized certification upon completion"
        }
      ]
    },
    "details": {
      "course_fee": {
        "amount": 25000,
        "currency": "BDT"
      },
      "duration": "12 weeks",
      "schedule": "Monday, Wednesday, Friday (7:00 PM - 9:00 PM)",
      "age_requirement": "18+ years",
      "social_links": [
        {
          "platform": "WhatsApp",
          "url": "https://wa.me/8801234567890"
        },
        {
          "platform": "LinkedIn",
          "url": "https://linkedin.com/company/smartrecruit"
        }
      ]
    },
    "is_deleted": false,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Course not found",
  "error": {
    "code": "COURSE_NOT_FOUND",
    "details": "No course found with the provided slug"
  }
}
```

#### Update Course

- `PATCH /api/courses/:slug` - Update course by slug (Admin only)

**Request:**

```bash
PATCH /api/courses/complete-web-development-bootcamp
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced Web Development Bootcamp",
  "details": {
    "course_fee": {
      "amount": 30000,
      "currency": "BDT"
    },
    "duration": "16 weeks"
  },
  "banner": {
    "title": "Master Advanced Web Development in 16 Weeks",
    "description": "Advanced concepts in React, Node.js, and cloud deployment"
  }
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Update course",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c400",
    "title": "Advanced Web Development Bootcamp",
    "description": "Learn full-stack web development from scratch with modern technologies",
    "slug": "complete-web-development-bootcamp",
    "image": "https://example.com/course-image.jpg",
    "category": "Web Development",
    "instructor": [
      {
        "_id": "68c8eab32a54cb567a2a0c300",
        "name": "John Smith",
        "email": "john@smartrecruit.com"
      }
    ],
    "banner": {
      "title": "Master Advanced Web Development in 16 Weeks",
      "description": "Advanced concepts in React, Node.js, and cloud deployment",
      "button_text": "Enroll Now",
      "button_href": "/enroll/web-development"
    },
    "overview": {
      "title": "What You'll Learn",
      "modules": [
        {
          "title": "HTML & CSS Fundamentals",
          "content": "Learn the basics of HTML structure and CSS styling"
        }
      ]
    },
    "details": {
      "course_fee": {
        "amount": 30000,
        "currency": "BDT"
      },
      "duration": "16 weeks",
      "schedule": "Monday, Wednesday, Friday (7:00 PM - 9:00 PM)",
      "age_requirement": "18+ years"
    },
    "is_deleted": false,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:30:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Course not found",
  "error": {
    "code": "COURSE_NOT_FOUND",
    "details": "No course found with the provided slug"
  }
}
```

#### Delete Course

- `DELETE /api/courses/:slug` - Delete course by slug (Admin only)

**Request:**

```bash
DELETE /api/courses/complete-web-development-bootcamp
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Delete course",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c400",
    "title": "Complete Web Development Bootcamp",
    "slug": "complete-web-development-bootcamp",
    "is_deleted": true,
    "deletedAt": "2025-01-16T06:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Course not found",
  "error": {
    "code": "COURSE_NOT_FOUND",
    "details": "No course found with the provided slug"
  }
}
```

#### Course Enrollment

- `POST /api/courses/enroll` - Enroll in a course

**Request:**

```bash
POST /api/courses/enroll
Content-Type: application/json

{
  "courseId": "68c8eab32a54cb567a2a0c400",
  "studentName": "Ahmed Rahman",
  "email": "ahmed.rahman@example.com",
  "phone": "+8801234567890",
  "paymentMethod": "bKash",
  "transactionId": "BK123456789"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Course enrollment successful",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c500",
    "courseId": "68c8eab32a54cb567a2a0c400",
    "courseTitle": "Complete Web Development Bootcamp",
    "studentName": "Ahmed Rahman",
    "email": "ahmed.rahman@example.com",
    "phone": "+8801234567890",
    "paymentMethod": "bKash",
    "transactionId": "BK123456789",
    "enrollmentDate": "2025-01-16T05:00:00.000Z",
    "status": "ENROLLED",
    "accessCode": "WD2025-001"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Enrollment failed",
  "error": {
    "code": "ENROLLMENT_ERROR",
    "details": "Course is not available for enrollment or payment verification failed"
  }
}
```

### dashboard

Admin dashboard analytics and statistics.

**Table of Contents:**

- [Get Dashboard Statistics](#get-dashboard-statistics)

#### Get Dashboard Statistics

- `GET /api/dashboard/stats` - Get dashboard statistics (Admin only)

### enrolledCourse

Course enrollment management.

**Table of Contents:**

- [Create Enrollment](#create-enrollment)
- [Get All Enrollments](#get-all-enrollments)
- [Update Enrollment](#update-enrollment)
- [Delete Enrollment](#delete-enrollment)

#### Create Enrollment

- `POST /api/enrolled-courses` - Create enrollment

#### Get All Enrollments

- `GET /api/enrolled-courses` - Get all enrollments (All users)

#### Update Enrollment

- `PATCH /api/enrolled-courses/:id` - Update enrollment (Admin only)

#### Delete Enrollment

- `DELETE /api/enrolled-courses/:id` - Delete enrollment (Admin only)

### getInTouch

Contact form submissions and inquiries.

**Table of Contents:**

- [Create Get In Touch](#create-get-in-touch)
- [Get All Contact Submissions](#get-all-contact-submissions)
- [Delete Contact Submission](#delete-contact-submission)

#### Create Get In Touch

- `POST /api/get-in-touch/create-get-in-touch` - Create get in touch (Admin only)

#### Get All Contact Submissions

- `GET /api/get-in-touch` - Get all contact submissions (Admin only)

#### Delete Contact Submission

- `DELETE /api/get-in-touch/:id` - Delete contact submission (Admin only)

### industry

Industry-specific content and configurations.

**Table of Contents:**

- [Get Industry Data](#get-industry-data)
- [Update Industry Data](#update-industry-data)

#### Get Industry Data

- `GET /api/industry` - Get all industry data

#### Update Industry Data

- `PATCH /api/industry/update` - Update industry data (Admin only)

### industryCategory

Industry talent categories management.

**Table of Contents:**

- [Create Category](#create-category)
- [Get All Categories](#get-all-categories)
- [Update Category](#update-category)
- [Delete Category](#delete-category)

#### Create Category

- `POST /api/industry-categories` - Create new category (Admin only)

#### Get All Categories

- `GET /api/industry-categories` - Get all categories

#### Update Category

- `PUT /api/industry-categories/:id` - Update category (Admin only)

#### Delete Category

- `DELETE /api/industry-categories/:id` - Delete category (Admin only)

### industryTalents

Individual talent profiles within categories.

**Table of Contents:**

- [Create Talent](#create-talent)
- [Get All Talents](#get-all-talents)
- [Get Single Talent](#get-single-talent)
- [Update Talent](#update-talent)
- [Delete Talent](#delete-talent)

#### Create Talent

- `POST /api/industry-talents` - Create new talent (Admin only)

#### Get All Talents

- `GET /api/industry-talents` - Get all talents

#### Get Single Talent

- `GET /api/industry-talents/:id` - Get single talent

#### Update Talent

- `PUT /api/industry-talents/:id` - Update talent (Admin only)

#### Delete Talent

- `DELETE /api/industry-talents/:id` - Delete talent (Admin only)

### instructor

Instructor management system.

**Table of Contents:**

- [Create Instructor](#create-instructor)
- [Get All Instructors](#get-all-instructors)
- [Get Single Instructor](#get-single-instructor)
- [Update Instructor](#update-instructor)
- [Delete Instructor](#delete-instructor)

#### Create Instructor

- `POST /api/instructor/create-instructor` - Create instructor

#### Get All Instructors

- `GET /api/instructor` - Get all instructors

#### Get Single Instructor

- `GET /api/instructor/:id` - Get single instructor

#### Update Instructor

- `PATCH /api/instructor/:id` - Update instructor

#### Delete Instructor

- `DELETE /api/instructor/:id` - Delete instructor (Admin only)

### JobApplication

Job application management.

**Table of Contents:**

- [Get All Job Applications](#get-all-job-applications)
- [Get Single Job Application](#get-single-job-application)
- [Get My Job Applications](#get-my-job-applications)
- [Update Job Application](#update-job-application)
- [Delete Job Application](#delete-job-application)

#### Get All Job Applications

- `GET /api/job-application` - Get all job applications (Admin only)

#### Get Single Job Application

- `GET /api/job-application/:id` - Get single job application (Admin only)

#### Get My Job Applications

- `GET /api/job-application/my-job-applications` - Get my job applications (User only)

#### Update Job Application

- `PATCH /api/job-application/:id` - Update job application (Admin only)

#### Delete Job Application

- `DELETE /api/job-application/:id` - Delete job application (Admin only)

### jobs

Job postings management.

**Table of Contents:**

- [Create Job](#create-job)
- [Get All Jobs](#get-all-jobs)
- [Get Single Job](#get-single-job)
- [Update Job](#update-job)
- [Delete Job](#delete-job)
- [Job Application](#job-application)

#### Create Job

- `POST /api/jobs/create-job` - Create job posting (Admin only)

**Request:**

```bash
POST /api/jobs/create-job
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "description": "We are looking for a senior software engineer...",
  "requirements": ["5+ years experience", "Node.js", "React"],
  "salary": "80000-120000",
  "employmentType": "FULL_TIME",
  "experienceLevel": "SENIOR"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Job created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c91",
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "Remote",
    "description": "We are looking for a senior software engineer...",
    "requirements": ["5+ years experience", "Node.js", "React"],
    "salary": "80000-120000",
    "employmentType": "FULL_TIME",
    "experienceLevel": "SENIOR",
    "status": "ACTIVE",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "company",
        "message": "Company is required"
      }
    ]
  }
}
```

#### Get All Jobs

- `GET /api/jobs` - Get all jobs

**Request:**

```bash
GET /api/jobs?page=1&limit=10&searchTerm=engineer&location=remote
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Jobs fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c91",
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "Remote",
      "salary": "80000-120000",
      "employmentType": "FULL_TIME",
      "status": "ACTIVE",
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred while fetching jobs"
  }
}
```

#### Get Single Job

- `GET /api/jobs/:id` - Get single job

**Request:**

```bash
GET /api/jobs/68c8eab32a54cb567a2a0c91
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Job fetched successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c91",
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "Remote",
    "description": "We are looking for a senior software engineer...",
    "requirements": ["5+ years experience", "Node.js", "React"],
    "salary": "80000-120000",
    "employmentType": "FULL_TIME",
    "experienceLevel": "SENIOR",
    "status": "ACTIVE",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Job not found",
  "error": {
    "code": "JOB_NOT_FOUND",
    "details": "No job found with the provided ID"
  }
}
```

#### Update Job

- `PATCH /api/jobs/:id` - Update job

**Request:**

```bash
PATCH /api/jobs/68c8eab32a54cb567a2a0c91
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lead Software Engineer",
  "salary": "100000-150000",
  "status": "ACTIVE"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Job updated successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c91",
    "title": "Lead Software Engineer",
    "company": "Tech Corp",
    "location": "Remote",
    "description": "We are looking for a senior software engineer...",
    "requirements": ["5+ years experience", "Node.js", "React"],
    "salary": "100000-150000",
    "employmentType": "FULL_TIME",
    "experienceLevel": "SENIOR",
    "status": "ACTIVE",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:30:00.000Z"
  }
}
```

#### Delete Job

- `DELETE /api/jobs/:id` - Delete job (Admin only)

#### Job Application

- `POST /api/jobs/apply` - Apply for a job (with CV upload)

**Request:**

```bash
DELETE /api/jobs/68c8eab32a54cb567a2a0c91
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Job deleted successfully"
}
```

### media

Media file management with Cloudinary integration.

**Table of Contents:**

- [Upload Media File](#upload-media-file)
- [Get All Media Files](#get-all-media-files)
- [Delete Media File](#delete-media-file)
- [Rename Media File](#rename-media-file)

#### Upload Media File

- `POST /api/media` - Upload media file (All users)

**Request:**

```bash
POST /api/media
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [image/video file]
category: "images"
description: "Profile photo for John Doe"
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Media uploaded successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c98",
    "filename": "profile-photo.jpg",
    "originalName": "john-profile.jpg",
    "url": "https://res.cloudinary.com/example/image/upload/v1234567890/profile-photo.jpg",
    "size": 245760,
    "mimetype": "image/jpeg",
    "category": "images",
    "description": "Profile photo for John Doe",
    "createdAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "statusCode": 400,
  "message": "File upload failed",
  "error": {
    "code": "UPLOAD_ERROR",
    "details": "Invalid file type. Only images and videos are allowed"
  }
}
```

#### Get All Media Files

- `GET /api/media` - Get all media files (Super Admin only)

**Request:**

```bash
GET /api/media?page=1&limit=10&category=images
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Media files fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c98",
      "filename": "profile-photo.jpg",
      "originalName": "john-profile.jpg",
      "url": "https://res.cloudinary.com/example/image/upload/v1234567890/profile-photo.jpg",
      "size": 245760,
      "mimetype": "image/jpeg",
      "category": "images",
      "description": "Profile photo for John Doe",
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

#### Delete Media File

- `DELETE /api/media/:name` - Delete media file by name (Super Admin only)

#### Rename Media File

- `PATCH /api/media/rename` - Rename media file (Super Admin only)

**Request:**

```bash
DELETE /api/media/68c8eab32a54cb567a2a0c98
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Media file deleted successfully"
}
```

### our-team

Team member management system.

**Table of Contents:**

- [Create Team Member](#create-team-member)
- [Get All Team Members](#get-all-team-members)
- [Get Single Team Member](#get-single-team-member)
- [Update Team Member](#update-team-member)
- [Delete Team Member](#delete-team-member)

#### Create Team Member

- `POST /api/our-team` - Create team member

**Request:**

```bash
POST /api/our-team
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "funder",
  "name": "John Smith",
  "email": "john@smartrecruit.com",
  "phone": "+1234567890",
  "position": "CEO & Founder",
  "bio": "Visionary leader with 15+ years in tech industry",
  "photo": "https://example.com/john-photo.jpg",
  "socials_links": {
    "facebook": "https://facebook.com/johnsmith",
    "instagram": "https://instagram.com/johnsmith",
    "twitter": "https://twitter.com/johnsmith",
    "linkedin": "https://linkedin.com/in/johnsmith"
  }
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Team member created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c100",
    "category": "funder",
    "name": "John Smith",
    "email": "john@smartrecruit.com",
    "phone": "+1234567890",
    "position": "CEO & Founder",
    "bio": "Visionary leader with 15+ years in tech industry",
    "photo": "https://example.com/john-photo.jpg",
    "socials_links": {
      "facebook": "https://facebook.com/johnsmith",
      "instagram": "https://instagram.com/johnsmith",
      "twitter": "https://twitter.com/johnsmith",
      "linkedin": "https://linkedin.com/in/johnsmith"
    },
    "is_deleted": false,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

#### Get All Team Members

- `GET /api/our-team` - Get all team members

**Request:**

```bash
GET /api/our-team?page=1&limit=10&category=funder&search=john
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team members fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c100",
      "category": "funder",
      "name": "John Smith",
      "email": "john@smartrecruit.com",
      "phone": "+1234567890",
      "position": "CEO & Founder",
      "bio": "Visionary leader with 15+ years in tech industry",
      "photo": "https://example.com/john-photo.jpg",
      "socials_links": {
        "facebook": "https://facebook.com/johnsmith",
        "linkedin": "https://linkedin.com/in/johnsmith"
      },
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

#### Get Single Team Member

- `GET /api/our-team/:id` - Get single team member

**Request:**

```bash
GET /api/our-team/68c8eab32a54cb567a2a0c100
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team member fetched successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c100",
    "category": "funder",
    "name": "John Smith",
    "email": "john@smartrecruit.com",
    "phone": "+1234567890",
    "position": "CEO & Founder",
    "bio": "Visionary leader with 15+ years in tech industry",
    "photo": "https://example.com/john-photo.jpg",
    "socials_links": {
      "facebook": "https://facebook.com/johnsmith",
      "instagram": "https://instagram.com/johnsmith",
      "twitter": "https://twitter.com/johnsmith",
      "linkedin": "https://linkedin.com/in/johnsmith"
    },
    "is_deleted": false,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Request:**

```bash
GET /api/our-team/category/funder
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team members fetched successfully",
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c100",
      "category": "funder",
      "name": "John Smith",
      "position": "CEO & Founder",
      "photo": "https://example.com/john-photo.jpg",
      "socials_links": {
        "linkedin": "https://linkedin.com/in/johnsmith"
      }
    }
  ]
}
```

#### Update Team Member

- `PATCH /api/our-team/:id` - Update team member

**Request:**

```bash
PATCH /api/our-team/68c8eab32a54cb567a2a0c100
Authorization: Bearer <token>
Content-Type: application/json

{
  "position": "CEO, Founder & CTO",
  "bio": "Visionary leader and technical expert with 15+ years in tech industry",
  "socials_links": {
    "linkedin": "https://linkedin.com/in/johnsmith",
    "twitter": "https://twitter.com/johnsmith"
  }
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team member updated successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c100",
    "category": "funder",
    "name": "John Smith",
    "email": "john@smartrecruit.com",
    "phone": "+1234567890",
    "position": "CEO, Founder & CTO",
    "bio": "Visionary leader and technical expert with 15+ years in tech industry",
    "photo": "https://example.com/john-photo.jpg",
    "socials_links": {
      "facebook": "https://facebook.com/johnsmith",
      "instagram": "https://instagram.com/johnsmith",
      "twitter": "https://twitter.com/johnsmith",
      "linkedin": "https://linkedin.com/in/johnsmith"
    },
    "is_deleted": false,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:30:00.000Z"
  }
}
```

#### Delete Team Member

- `DELETE /api/our-team/:id` - Delete team member

**Request:**

```bash
DELETE /api/our-team/68c8eab32a54cb567a2a0c100
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team member deleted successfully"
}
```

### pages

Page content management system.

**Table of Contents:**

- [about](#about)
- [employer](#employer)
- [home](#home)
- [partner](#partner)
- [skill-training](#skill-training)
- [termsAndPrivacy](#termsandprivacy)
- [visaAndRelocation](#visaandrelocation)

#### about

About page content management.

**Table of Contents:**

- [Get About Data](#get-about-data)
- [Update About Data](#update-about-data)

##### Get About Data

- `GET /api/about` - Get about page data

##### Update About Data

- `PATCH /api/about/update` - Update about page data (Admin only)

#### employer

Employer page content management.

**Table of Contents:**

- [Get Employer Data](#get-employer-data)
- [Update Employer Data](#update-employer-data)

##### Get Employer Data

- `GET /api/employer` - Get employer page data

##### Update Employer Data

- `PATCH /api/employer/update` - Update employer page data (Admin only)

#### home

Homepage content management.

**Table of Contents:**

- [Get Home Data](#get-home-data)
- [Update Home Data](#update-home-data)

##### Get Home Data

- `GET /api/home` - Get homepage data

##### Update Home Data

- `PATCH /api/home/update` - Update homepage data (Admin only)

#### partner

Partner page content management.

**Table of Contents:**

- [Get Partner Data](#get-partner-data)
- [Update Partner Data](#update-partner-data)

##### Get Partner Data

- `GET /api/partner` - Get partner page data

##### Update Partner Data

- `PATCH /api/partner/update` - Update partner page data (Admin only)

#### skill-training

Skill training page content management.

**Table of Contents:**

- [Get Skill Training Data](#get-skill-training-data)
- [Update Skill Training Data](#update-skill-training-data)

##### Get Skill Training Data

- `GET /api/skill-training` - Get skill training page data

##### Update Skill Training Data

- `PATCH /api/skill-training/update` - Update skill training page data (Admin only)

#### termsAndPrivacy

Terms and privacy page content management.

**Table of Contents:**

- [Get Terms and Privacy Data](#get-terms-and-privacy-data)
- [Update Terms and Privacy Data](#update-terms-and-privacy-data)

##### Get Terms and Privacy Data

- `GET /api/terms-and-privacy` - Get terms and privacy page data

##### Update Terms and Privacy Data

- `PATCH /api/terms-and-privacy/update` - Update terms and privacy page data (Admin only)

#### visaAndRelocation

Visa and relocation page content management.

**Table of Contents:**

- [Get Visa and Relocation Data](#get-visa-and-relocation-data)
- [Update Visa and Relocation Data](#update-visa-and-relocation-data)

##### Get Visa and Relocation Data

- `GET /api/visa-relocation` - Get visa and relocation page data

##### Update Visa and Relocation Data

- `PATCH /api/visa-relocation/update` - Update visa and relocation page data (Admin only)

### studentReview

Student reviews and feedback management.

**Table of Contents:**

- [Create Student Review](#create-student-review)
- [Get All Student Reviews](#get-all-student-reviews)
- [Get Single Student Review](#get-single-student-review)
- [Update Student Review](#update-student-review)
- [Delete Student Review](#delete-student-review)

#### Create Student Review

- `POST /api/student-reviews/create` - Create student review (Admin only)

#### Get All Student Reviews

- `GET /api/student-reviews` - Get all student reviews

#### Get Single Student Review

- `GET /api/student-reviews/:id` - Get single student review (Admin only)

#### Update Student Review

- `PATCH /api/student-reviews/:id` - Update student review (Admin only)

#### Delete Student Review

- `DELETE /api/student-reviews/:id` - Delete student review (Admin only)

### successStory

Success stories management.

**Table of Contents:**

- [Create Success Story](#create-success-story)
- [Get All Success Stories](#get-all-success-stories)
- [Get Single Success Story](#get-single-success-story)
- [Update Success Story](#update-success-story)
- [Delete Success Story](#delete-success-story)

#### Create Success Story

- `POST /api/success-story/create-success-story` - Create success story

#### Get All Success Stories

- `GET /api/success-story` - Get all success stories

#### Get Single Success Story

- `GET /api/success-story/:id` - Get single success story

#### Update Success Story

- `PATCH /api/success-story/:id` - Update success story

#### Delete Success Story

- `DELETE /api/success-story/:id` - Delete success story

### user

User management system.

**Table of Contents:**

- [Get All Users](#get-all-users)
- [Get My Profile](#get-my-profile)
- [Register User](#register-user)
- [Update Profile](#update-profile)
- [Update User Status](#update-user-status)

#### Get All Users

- `GET /api/user` - Get all users (Super Admin only)

#### Get My Profile

- `GET /api/user/me` - Get my profile (All users)

#### Register User

- `POST /api/user` - Register new user

#### Update Profile

- `PATCH /api/user/update-profile` - Update my profile (All users)

#### Update User Status

- `PATCH /api/user/:id/status` - Update user status (Super Admin only)

### verify-captcha

Captcha verification system.

**Table of Contents:**

- [Verify Captcha](#verify-captcha-1)

#### Verify Captcha

- `POST /api/verify-captcha/verify` - Verify captcha token

### workerRequest

Worker request management.

**Table of Contents:**

- [Create Worker Request](#create-worker-request)
- [Get All Worker Requests](#get-all-worker-requests)
- [Get Single Worker Request](#get-single-worker-request)
- [Update Worker Request](#update-worker-request)
- [Delete Worker Request](#delete-worker-request)

#### Create Worker Request

- `POST /api/worker-request/create-worker-request` - Create worker request (User only)

#### Get All Worker Requests

- `GET /api/worker-request` - Get all worker requests (Admin only)

#### Get Single Worker Request

- `GET /api/worker-request/:id` - Get single worker request

#### Update Worker Request

- `PATCH /api/worker-request/:id` - Update worker request

#### Delete Worker Request

- `DELETE /api/worker-request/:id` - Delete worker request (Admin only)

### workerStory

Worker success stories management.

**Table of Contents:**

- [Create Worker Story](#create-worker-story)
- [Get All Worker Stories](#get-all-worker-stories)
- [Get Single Worker Story](#get-single-worker-story)
- [Update Worker Story](#update-worker-story)
- [Delete Worker Story](#delete-worker-story)

#### Create Worker Story

- `POST /api/worker-story/create-worker-story` - Create worker story (Admin only)

#### Get All Worker Stories

- `GET /api/worker-story` - Get all worker stories

#### Get Single Worker Story

- `GET /api/worker-story/:id` - Get single worker story

#### Update Worker Story

- `PATCH /api/worker-story/:id` - Update worker story (Admin only)

#### Delete Worker Story

- `DELETE /api/worker-story/:id` - Delete worker story (Admin only)

**Request:**

```bash
DELETE /api/worker-story/68c8eab32a54cb567a2a0c105
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Worker story deleted successfully"
}
```

---

## 📋 API Documentation Summary

The SmartRecruit Backend API provides comprehensive endpoints for all modules with detailed request/response examples. Each endpoint includes:

- **HTTP Method** and **Endpoint URL**
- **Request Headers** (Authorization, Content-Type)
- **Request Body** (for POST/PATCH requests)
- **Query Parameters** (for GET requests with filtering/pagination)
- **Response Format** with success/error handling
- **Status Codes** and **Messages**

### 🔧 Common Request Patterns

**Authentication Required:**

```bash
Authorization: Bearer <your-jwt-token>
```

**Pagination:**

```bash
?page=1&limit=10&searchTerm=keyword
```

**Filtering:**

```bash
?category=value&status=active&sortBy=createdAt&sortOrder=desc
```

### 📊 Response Format

All API responses follow a consistent structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    /* Response data */
  },
  "meta": {
    /* Pagination metadata */
  }
}
```

### 🚨 Error Handling

Error responses include detailed information:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Specific error details"
  }
}
```

### Authentication Module

**Endpoints:**

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-otp` - Verify OTP

**User Login**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@smartrecruit.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "68c8eab32a54cb567a2a0c90",
      "email": "admin@smartrecruit.com",
      "role": "SUPER_ADMIN",
      "name": "Admin User"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**User Registration**

```bash
POST /api/auth/register
Content-Type: application/json

    {
      "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Refresh Token**

```bash
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Forgot Password**

```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Reset Password**

```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "newpassword123"
}
```

**Verify OTP**

```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Jobs Module

**Endpoints:**

- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `PATCH /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

**Create Job**

```bash
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "description": "We are looking for a senior software engineer...",
  "requirements": ["5+ years experience", "Node.js", "React"],
  "salary": "80000-120000",
  "employmentType": "FULL_TIME",
  "experienceLevel": "SENIOR"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Job created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c91",
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "location": "Remote",
    "description": "We are looking for a senior software engineer...",
    "requirements": ["5+ years experience", "Node.js", "React"],
    "salary": "80000-120000",
    "employmentType": "FULL_TIME",
    "experienceLevel": "SENIOR",
    "status": "ACTIVE",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Jobs**

```bash
GET /api/jobs?page=1&limit=10&searchTerm=engineer&location=remote
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Jobs fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c91",
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "location": "Remote",
      "salary": "80000-120000",
      "employmentType": "FULL_TIME",
      "status": "ACTIVE",
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Update Job**

```bash
PATCH /api/jobs/68c8eab32a54cb567a2a0c91
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lead Software Engineer",
  "salary": "100000-150000",
  "status": "ACTIVE"
}
```

**Delete Job**

```bash
DELETE /api/jobs/68c8eab32a54cb567a2a0c91
Authorization: Bearer <token>
```

### Career Jobs Module

**Endpoints:**

- `POST /api/career-jobs` - Create career job
- `GET /api/career-jobs` - Get all career jobs
- `GET /api/career-jobs/:id` - Get single career job
- `PATCH /api/career-jobs/:id` - Update career job
- `DELETE /api/career-jobs/:id` - Delete career job

**Create Career Job**

```bash
POST /api/career-jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Career Development Specialist",
  "department": "Human Resources",
  "location": "New York",
  "description": "Help employees develop their careers...",
  "requirements": ["HR experience", "Career counseling"],
  "salary": "60000-80000",
  "employmentType": "FULL_TIME"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Career job created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c92",
    "title": "Career Development Specialist",
    "department": "Human Resources",
    "location": "New York",
    "description": "Help employees develop their careers...",
    "requirements": ["HR experience", "Career counseling"],
    "salary": "60000-80000",
    "employmentType": "FULL_TIME",
    "status": "ACTIVE",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Career Jobs**

```bash
GET /api/career-jobs?page=1&limit=10&department=hr
Authorization: Bearer <token>
```

**Update Career Job**

```bash
PATCH /api/career-jobs/68c8eab32a54cb567a2a0c92
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Career Development Specialist",
  "salary": "70000-90000"
}
```

**Delete Career Job**

```bash
DELETE /api/career-jobs/68c8eab32a54cb567a2a0c92
Authorization: Bearer <token>
```

### Courses Module

**Endpoints:**

- `POST /api/courses` - Create course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `PATCH /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

**Create Course**

```bash
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
"title": "Full Stack Web Development",
"description": "Learn modern web development with React and Node.js",
"instructor": "68c8eab32a54cb567a2a0c93",
"price": 299.99,
"duration": "12 weeks",
"level": "INTERMEDIATE",
"category": "Web Development",
"thumbnail": "https://example.com/course-thumbnail.jpg"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Course created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c94",
    "title": "Full Stack Web Development",
    "description": "Learn modern web development with React and Node.js",
    "instructor": {
      "_id": "68c8eab32a54cb567a2a0c93",
      "name": "Jane Smith"
    },
    "price": 299.99,
    "duration": "12 weeks",
    "level": "INTERMEDIATE",
    "category": "Web Development",
    "thumbnail": "https://example.com/course-thumbnail.jpg",
    "status": "ACTIVE",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Courses**

```bash
GET /api/courses?page=1&limit=10&category=web&level=intermediate
Authorization: Bearer <token>
```

**Update Course**

```bash
PATCH /api/courses/68c8eab32a54cb567a2a0c94
Authorization: Bearer <token>
Content-Type: application/json

{
"title": "Advanced Full Stack Web Development",
"price": 399.99
}
```

**Delete Course**

```bash
DELETE /api/courses/68c8eab32a54cb567a2a0c94
Authorization: Bearer <token>
```

### Instructors Module

**Endpoints:**

- `POST /api/instructor` - Create instructor
- `GET /api/instructor` - Get all instructors
- `GET /api/instructor/:id` - Get single instructor
- `PATCH /api/instructor/:id` - Update instructor
- `DELETE /api/instructor/:id` - Delete instructor

**Create Instructor**

```bash
POST /api/instructor
Authorization: Bearer <token>
Content-Type: application/json

{
"name": "Jane Smith",
"email": "jane@example.com",
"bio": "Experienced web developer with 10+ years",
"specialization": ["React", "Node.js", "MongoDB"],
"profilePhoto": "https://example.com/jane-profile.jpg",
"experience": "10 years",
"rating": 4.8
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Instructor created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c95",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "bio": "Experienced web developer with 10+ years",
    "specialization": ["React", "Node.js", "MongoDB"],
    "profilePhoto": "https://example.com/jane-profile.jpg",
    "experience": "10 years",
    "rating": 4.8,
    "status": "ACTIVE",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Instructors**

```bash
GET /api/instructor?page=1&limit=10&specialization=react
Authorization: Bearer <token>
```

**Update Instructor**

```bash
PATCH /api/instructor/68c8eab32a54cb567a2a0c95
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith-Wilson",
  "rating": 4.9
}
```

**Delete Instructor**

```bash
DELETE /api/instructor/68c8eab32a54cb567a2a0c95
Authorization: Bearer <token>
```

### Blogs Module

**Endpoints:**

- `POST /api/blogs` - Create blog
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `PATCH /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

**Create Blog**

```bash
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Getting Started with React Hooks",
  "content": "React Hooks revolutionized how we write functional components...",
  "excerpt": "Learn the basics of React Hooks and how to use them effectively",
  "author": "68c8eab32a54cb567a2a0c95",
  "category": "React",
  "tags": ["react", "hooks", "javascript"],
  "featuredImage": "https://example.com/blog-image.jpg",
  "status": "PUBLISHED"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Blog created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c96",
    "title": "Getting Started with React Hooks",
    "content": "React Hooks revolutionized how we write functional components...",
    "excerpt": "Learn the basics of React Hooks and how to use them effectively",
    "author": {
      "_id": "68c8eab32a54cb567a2a0c95",
      "name": "Jane Smith"
    },
    "category": "React",
    "tags": ["react", "hooks", "javascript"],
    "featuredImage": "https://example.com/blog-image.jpg",
    "status": "PUBLISHED",
    "slug": "getting-started-with-react-hooks",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Blogs**

```bash
GET /api/blogs?page=1&limit=10&category=react&status=published
Authorization: Bearer <token>
```

**Update Blog**

```bash
PATCH /api/blogs/68c8eab32a54cb567a2a0c96
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Advanced React Hooks Patterns",
  "status": "PUBLISHED"
}
```

**Delete Blog**

```bash
DELETE /api/blogs/68c8eab32a54cb567a2a0c96
Authorization: Bearer <token>
```

### Success Stories Module

**Endpoints:**

- `POST /api/success-story` - Create success story
- `GET /api/success-story` - Get all success stories
- `GET /api/success-story/:id` - Get single success story
- `PATCH /api/success-story/:id` - Update success story
- `DELETE /api/success-story/:id` - Delete success story

**Create Success Story**

```bash
POST /api/success-story
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "From Zero to Full Stack Developer",
  "content": "John's journey from complete beginner to landing his dream job...",
  "author": "John Doe",
  "authorImage": "https://example.com/john.jpg",
  "company": "Tech Corp",
  "position": "Senior Developer",
  "testimonial": "SmartRecruit helped me achieve my career goals!",
  "featuredImage": "https://example.com/success-story.jpg",
  "status": "PUBLISHED"
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Success story created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c97",
    "title": "From Zero to Full Stack Developer",
    "content": "John's journey from complete beginner to landing his dream job...",
    "author": "John Doe",
    "authorImage": "https://example.com/john.jpg",
    "company": "Tech Corp",
    "position": "Senior Developer",
    "testimonial": "SmartRecruit helped me achieve my career goals!",
    "featuredImage": "https://example.com/success-story.jpg",
    "status": "PUBLISHED",
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Success Stories**

```bash
GET /api/success-story?page=1&limit=10&status=published
Authorization: Bearer <token>
```

**Update Success Story**

```bash
PATCH /api/success-story/68c8eab32a54cb567a2a0c97
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "From Zero to Full Stack Developer - Updated",
  "status": "PUBLISHED"
}
```

**Delete Success Story**

```bash
DELETE /api/success-story/68c8eab32a54cb567a2a0c97
Authorization: Bearer <token>
```

### Media Module

**Endpoints:**

- `POST /api/media/upload` - Upload media file
- `GET /api/media` - Get all media files
- `DELETE /api/media/:id` - Delete media file

**Upload Media File**

```bash
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [image/video file]
category: "images"
description: "Profile photo for John Doe"
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Media uploaded successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c98",
    "filename": "profile-photo.jpg",
    "originalName": "john-profile.jpg",
    "url": "https://res.cloudinary.com/example/image/upload/v1234567890/profile-photo.jpg",
    "size": 245760,
    "mimetype": "image/jpeg",
    "category": "images",
    "description": "Profile photo for John Doe",
    "createdAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Media Files**

```bash
GET /api/media?page=1&limit=10&category=images
Authorization: Bearer <token>
```

**Delete Media File**

```bash
DELETE /api/media/68c8eab32a54cb567a2a0c98
Authorization: Bearer <token>
```

### User Management Module

**Endpoints:**

- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get single user
- `PATCH /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

**Get All Users**

```bash
GET /api/user?page=1&limit=10&role=USER&status=ACTIVE
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c99",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "status": "ACTIVE",
      "profilePhoto": "https://example.com/john.jpg",
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Get Single User**

```bash
GET /api/user/68c8eab32a54cb567a2a0c99
Authorization: Bearer <token>
```

**Update User**

```bash
PATCH /api/user/68c8eab32a54cb567a2a0c99
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "role": "EDITOR",
  "status": "ACTIVE"
}
```

**Delete User**

```bash
DELETE /api/user/68c8eab32a54cb567a2a0c99
Authorization: Bearer <token>
```

### Our Team Module

**Endpoints:**

- `POST /api/our-team` - Create team member
- `GET /api/our-team` - Get all team members
- `GET /api/our-team/:id` - Get single team member
- `GET /api/our-team/category/:category` - Get team members by category
- `PATCH /api/our-team/:id` - Update team member
- `DELETE /api/our-team/:id` - Delete team member

**Create Team Member**

```bash
POST /api/our-team
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "funder",
  "name": "John Smith",
  "email": "john@smartrecruit.com",
  "phone": "+1234567890",
  "position": "CEO & Founder",
  "bio": "Visionary leader with 15+ years in tech industry",
  "photo": "https://example.com/john-photo.jpg",
  "socials_links": {
    "facebook": "https://facebook.com/johnsmith",
    "instagram": "https://instagram.com/johnsmith",
    "twitter": "https://twitter.com/johnsmith",
    "linkedin": "https://linkedin.com/in/johnsmith"
  }
}
```

**Response:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Team member created successfully",
  "data": {
    "_id": "68c8eab32a54cb567a2a0c100",
    "category": "funder",
    "name": "John Smith",
    "email": "john@smartrecruit.com",
    "phone": "+1234567890",
    "position": "CEO & Founder",
    "bio": "Visionary leader with 15+ years in tech industry",
    "photo": "https://example.com/john-photo.jpg",
    "socials_links": {
      "facebook": "https://facebook.com/johnsmith",
      "instagram": "https://instagram.com/johnsmith",
      "twitter": "https://twitter.com/johnsmith",
      "linkedin": "https://linkedin.com/in/johnsmith"
    },
    "is_deleted": false,
    "createdAt": "2025-01-16T05:00:00.000Z",
    "updatedAt": "2025-01-16T05:00:00.000Z"
  }
}
```

**Get All Team Members**

```bash
GET /api/our-team?page=1&limit=10&category=funder&search=john
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Team members fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  },
  "data": [
    {
      "_id": "68c8eab32a54cb567a2a0c100",
      "category": "funder",
      "name": "John Smith",
      "email": "john@smartrecruit.com",
      "phone": "+1234567890",
      "position": "CEO & Founder",
      "bio": "Visionary leader with 15+ years in tech industry",
      "photo": "https://example.com/john-photo.jpg",
      "socials_links": {
        "facebook": "https://facebook.com/johnsmith",
        "linkedin": "https://linkedin.com/in/johnsmith"
      },
      "createdAt": "2025-01-16T05:00:00.000Z"
    }
  ]
}
```

**Get Team Members by Category**

```bash
GET /api/our-team/category/funder
Authorization: Bearer <token>
```

**Get Single Team Member**

```bash
GET /api/our-team/68c8eab32a54cb567a2a0c100
Authorization: Bearer <token>
```

**Update Team Member**

```bash
PATCH /api/our-team/68c8eab32a54cb567a2a0c100
Authorization: Bearer <token>
Content-Type: application/json

{
  "position": "CEO, Founder & CTO",
  "bio": "Visionary leader and technical expert with 15+ years in tech industry",
  "socials_links": {
    "linkedin": "https://linkedin.com/in/johnsmith",
    "twitter": "https://twitter.com/johnsmith"
  }
}
```

**Delete Team Member**

```bash
DELETE /api/our-team/68c8eab32a54cb567a2a0c100
Authorization: Bearer <token>
```

**Team Member Categories:**

The category field accepts any string value, allowing for flexible team categorization based on your organization's structure.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ibnabdullah1/zoomit-beckend.git
   cd zoomit-beckend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=5000
   DB_URL=mongodb://localhost:27017/smartrecruit
   JWT_ACCESS_SECRET=your_access_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   JWT_ACCESS_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SENDER_EMAIL=your_email
   SENDER_APP_PASS=your_app_password
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

### Build for Production

```bash
npm run build
# or
yarn build
```

### Production Deployment

```bash
npm run deploy
# or
yarn deploy
```

---

## Project Structure

```
src/
├── app/
│   ├── builder/              # Query builder utilities
│   ├── config/               # Configuration files
│   │   ├── cloudinary.config.ts
│   │   ├── index.ts
│   │   └── multer.config.ts
│   ├── DB/                   # Database utilities
│   │   └── seed.ts
│   ├── errors/               # Error handling
│   │   ├── appError.ts
│   │   ├── handleCastError.ts
│   │   ├── handleDuplicateError.ts
│   │   ├── handleValidationError.ts
│   │   └── handleZodError.ts
│   ├── helpers/              # Helper functions
│   │   ├── jwtHelpers.ts
│   │   └── paginationHelper.ts
│   ├── interface/            # TypeScript interfaces
│   │   ├── error.ts
│   │   ├── IImageFile.ts
│   │   ├── index.d.ts
│   │   ├── pagination.ts
│   │   └── user.ts
│   ├── middleware/           # Express middleware
│   │   ├── actionLogger.ts
│   │   ├── auth.ts
│   │   ├── bodyParser.ts
│   │   ├── clientInfoParser.ts
│   │   ├── globalErrorHandler.ts
│   │   ├── notFound.ts
│   │   ├── upload.ts
│   │   └── validateRequest.ts
│   ├── modules/              # Feature modules
│   │   ├── actionLog/        # Action logging system
│   │   ├── auth/             # Authentication & authorization
│   │   ├── blog/             # Blog management
│   │   ├── careerJob/        # Career job postings
│   │   ├── careerJobApplication/ # Career job applications
│   │   ├── contact/          # Contact information
│   │   ├── course/           # Course management
│   │   ├── customer/         # Customer management
│   │   ├── dashboard/        # Admin dashboard analytics
│   │   ├── enrolledCourse/   # Course enrollments
│   │   ├── getInTouch/       # Contact form submissions
│   │   ├── industry/         # Industry configurations
│   │   ├── industryCategory/ # Industry talent categories
│   │   ├── industryTalents/  # Individual talent profiles
│   │   ├── instructor/       # Instructor management
│   │   ├── JobApplication/   # Job applications
│   │   ├── jobs/             # Job postings
│   │   ├── media/            # Media file management
│   │   ├── our-team/         # Team member management
│   │   ├── pages/            # Page content management
│   │   │   ├── about/        # About page content
│   │   │   ├── employer/     # Employer page content
│   │   │   ├── home/         # Homepage content
│   │   │   ├── partner/      # Partner page content
│   │   │   ├── skill-training/ # Skill training content
│   │   │   ├── termsAndPrivacy/ # Terms & privacy content
│   │   │   └── visaAndRelocation/ # Visa & relocation content
│   │   ├── studentReview/    # Student reviews & feedback
│   │   ├── successStory/     # Success stories
│   │   ├── user/             # User management
│   │   ├── verify-captcha/   # Captcha verification
│   │   ├── workerRequest/    # Worker requests
│   │   └── workerStory/      # Worker success stories
│   ├── routes/               # Route definitions
│   │   └── index.ts
│   └── utils/                # Utility functions
│       ├── catchAsync.ts
│       ├── emailHelper.ts
│       ├── flattenObject.ts
│       ├── generateOtp.ts
│       ├── sendResponse.ts
│       └── slug.ts
├── scripts/                  # Utility scripts
│   └── createModule.ts
├── shared/                   # Shared utilities
│   └── pick.ts
├── templates/                # Email templates
│   ├── applicationSuccess.template.hbs
│   ├── forgotPassword.template.hbs
│   ├── sendMessage.template.hbs
│   └── sendMessageAdmin.template.hbs
├── app.ts                    # Express app configuration
└── server.ts                 # Server entry point
```

---

## API Documentation

### Base URL

```
https://api.smartrecruit.agency
```

### Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "meta": {
    // Pagination and metadata
  }
}
```

### Error Format

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### Postman Collection

Access the complete API documentation and testing collection:
[SmartRecruit API Collection](https://.postman.co/workspace/My-Workspace~ce4d8442-b193-4ac5-82e5-1245384d2bb1/folder/32716244-ff8c4844-8c7d-4c11-aed8-bf7ee1c51aef?action=share&creator=32716244&ctx=documentation&active-environment=32716244-36cfd04a-0e04-46da-b23b-51661322fe7a)

---

## Environment Variables

| Variable                 | Description                          | Required |
| ------------------------ | ------------------------------------ | -------- |
| `NODE_ENV`               | Environment (development/production) | Yes      |
| `PORT`                   | Server port                          | Yes      |
| `DB_URL`                 | MongoDB connection string            | Yes      |
| `JWT_ACCESS_SECRET`      | JWT access token secret              | Yes      |
| `JWT_REFRESH_SECRET`     | JWT refresh token secret             | Yes      |
| `JWT_ACCESS_EXPIRES_IN`  | Access token expiration              | Yes      |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration             | Yes      |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary cloud name                | Yes      |
| `CLOUDINARY_API_KEY`     | Cloudinary API key                   | Yes      |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret                | Yes      |
| `SENDER_EMAIL`           | Email sender address                 | Yes      |
| `SENDER_APP_PASS`        | Email app password                   | Yes      |

---

## Database Schema

### Entity Relationship Diagram

<div align="center">
  <img src="docs/industry-entity-relationship-diagram.png" alt="Industry Entity Relationship Diagram" style="max-width: 100%; height: auto;">
  <p><em>Industry Module Entity Relationship Diagram</em></p>
</div>

### Industry Module Schema

#### Banner Collection

```javascript
{
  title: String,
  description: String,
  button_text: String,
  button_link: String,
  youtube_video_links: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### TalentHubCategory Collection

```javascript
{
  title: String (unique),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Talent Collection

```javascript
{
  categoryId: String (ref: TalentHubCategory),
  youtube_video_links: String,
  name: String,
  position: String,
  profile_photo: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Our Team Collection

```javascript
{
  category: String (required),
  name: String,
  email: String,
  phone: String,
  position: String,
  bio: String,
  photo: String,
  socials_links: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  is_deleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### User Roles

- `SUPER_ADMIN` - Full system access
- `ADMIN` - Administrative access
- `USER` - Basic user access
- `PUBLISHER` - Content publishing access
- `EDITOR` - Content editing access

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive error handling
- Add proper validation using Zod schemas
- Include JSDoc comments for functions
- Write unit tests for new features
- Follow the existing code structure and naming conventions

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

<div align="center">
  <p>Built with ❤️ by the SmartRecruit Development Team</p>
  <p>
    <strong>Website:</strong> <a href="https://smartrecruit.agency">smartrecruit.agency</a> |
    <strong>Admin Panel:</strong> <a href="https://admin.smartrecruit.agency">admin.smartrecruit.agency</a>
  </p>
</div>
