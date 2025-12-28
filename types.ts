
export interface Town {
  id: string;
  name: string;
  region: 'Coastal' | 'Central' | 'Northern';
  tagline: string;
  imageUrl?: string;
}

export enum Category {
  HIDDEN_GEMS = 'Hidden Gems',
  ACTIVITIES = 'Activities',
  FOOD_DRINKS = 'Food & Drinks',
  STREET_FOOD = 'Street Food',
  CULTURAL_HERITAGE = 'Cultural Heritage'
}

export interface ListItem {
  name: string;
  slug?: string;
  description: string;
  reason: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  verificationStatus: 'verified' | 'needs_verification';
  imageKeyword: string;
}

export interface ListResponse {
  items: ListItem[];
}

export interface MonthlyFeature {
  title: string;
  townId: string;
  month: string;
  description: string;
}

// Sanity-specific types
export interface SanityImageAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface SanityAmbassador {
  _id: string;
  _type: 'ambassador';
  name: string;
  title: string;
  email: string;
  town?: string;
  avatar?: SanityImageAsset;
  bio?: string;
}

export interface SanityBlogPost {
  _id: string;
  _type: 'blogPost';
  title: string;
  slug: {
    current: string;
  };
  category: string;
  author: SanityAmbassador;
  excerpt: string;
  hero: SanityImageAsset;
  content: Array<{
    heading?: string;
    body: string;
  }>;
  takeaway: string;
  tags?: string[];
  readingTime?: string;
  publishedAt?: string;
  status: 'draft' | 'pending' | 'published' | 'archived';
}

export interface SanityListItem {
  _id: string;
  _type: 'listItem';
  name: string;
  slug: {
    current: string;
  };
  town: string;
  category: string;
  description: string;
  reason: string;
  content?: Array<{
    heading?: string;
    body: string;
  }>;
  images: SanityImageAsset[];
  gallery?: SanityImageAsset[];
  location?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features?: string[];
  contactInfo?: {
    website?: string;
    instagram?: string;
    phone?: string;
  };
  verifiedBy?: SanityAmbassador[];
  verificationDate?: string;
  rank: number;
  status: 'draft' | 'pending' | 'published' | 'needs_verification';
}

export interface SanityTown {
  _id: string;
  _type: 'town';
  name: string;
  slug: {
    current: string;
  };
  region: 'Coastal' | 'Central' | 'Northern';
  tagline: string;
  image: SanityImageAsset;
  order: number;
}

export interface SanityCityOfTheMonth {
  _id: string;
  _type: 'cityOfTheMonth';
  title: string;
  town: SanityTown;
  month: string;
  description: string;
  featuredImage?: SanityImageAsset;
  active: boolean;
}

export interface SanitySiteSettings {
  _id: string;
  _type: 'siteSettings';
  heroTitle: string;
  heroSubtitle: string;
  heroImage: SanityImageAsset;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  footerText?: string;
}
