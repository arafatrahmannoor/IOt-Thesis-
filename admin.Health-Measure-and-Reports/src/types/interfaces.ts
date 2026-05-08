// Job Interface
export interface IJob {
  _id?: string;
  thumbnail: string;
  title: string;
  location: {
    city: string;
    country: string;
  };
  salary: {
    min: string;
    max: string;
    currency: string;
    period: string;
  };
  employment_type: string;
  posted_date: string; // e.g., "2 days ago"
  expiration_date: string; // e.g., "20 August 2025"
  experience_required: string; // e.g., "0-3 years"
  support: string[];
  description: string;
  responsibilities: string[];
  qualifications: string[];
  country_flag: string; // path to flag image
  status?: string;
  is_deleted: boolean;
}

// Job Application Interface
export interface IJobApplication {
  _id?: string;
  job: string;
  full_name: string;
  email: string;
  phone_number: string;
  nationality: string;
  message?: string;
  resumeUrl?: string;
  is_deleted?: boolean;
  applied_date?: string;
}

// Course Interfaces
export interface IBanner {
  title: string;
  description: string;
  button_text: string;
  button_href: string;
}

export interface ITrainingApproachItem {
  icon: string;
  title: string;
  description: string;
}

export interface ITrainingApproach {
  title: string;
  items: ITrainingApproachItem[];
}

export interface IDescription {
  title: string;
  description: string;
}

export interface ICourseModule {
  title: string;
  content: string;
}

export interface ICourseOverview {
  title: string;
  modules: ICourseModule[];
}

export interface ISocialLink {
  platform: "LinkedIn" | "WhatsApp" | "Facebook" | "Email" | string;
  url: string;
}

export interface ICourseDetails {
  course_fee: {
    amount: number;
    currency: string;
  };
  duration: string;
  schedule: string;
  age_requirement: string;
  social_links: ISocialLink[];
}

export interface ICourse {
  _id?: string;
  instructor?: any;
  title: string;
  image: string;
  banner: IBanner;
  training_approach: ITrainingApproach;
  description: IDescription;
  overview: ICourseOverview;
  details: ICourseDetails;
  is_deleted: boolean;
}

// Course Enrollment Interface
export interface IEnrolledCourse {
  _id?: string;
  course: ICourse;
  full_name: string;
  email: string;
  nationality: string;
  phone_number: string;
  schedule: string;
  message?: string;
  agree: boolean;
  is_deleted: boolean;
  enrolled_date?: string;
}

// Instructor Interface
export type TGender = "male" | "female" | "other";
export type TBloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

interface Course {
  _id: string;
  banner: {
    title: string;
    description?: string;
    button_text?: string;
    button_href?: string;
  };
}

export interface IInstructor {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  gender: TGender;
  date_of_birth?: string;
  blood_group?: TBloodGroup;
  bio?: string;
  profile_picture?: string;
  expertise: string[];
  course: Course[];
  status?: boolean;
  is_deleted?: boolean;
}

export interface ISuccessStory {
  thumbnail: string;
  name: string;
  origin_country: string;
  origin_country_flag: string;
  destination_country: string;
  destination_country_flag: string;
  job_position: string;
  is_deleted: boolean;
  success_date: string;
}

export interface IBlog {
  _id?: string;
  title: string;
  thumbnail?: string;
  sort_description?: string;
  slug?: string;
  content?: string;
  category?: string;
  tags?: string[];
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  };
  status?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IOurIndustryTalent {
  _id?: string;
  category: any;
  name: string;
  position: string;
  youtube_video_link: string;
  profile_photo: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}
