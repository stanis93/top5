
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
  TRADITIONAL_FOOD = 'Traditional Food & Drinks',
  STREET_FOOD = 'Street Food',
  CULTURAL_HERITAGE = 'Cultural Heritage'
}

export interface ListItem {
  name: string;
  description: string;
  reason: string;
  location?: string;
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
