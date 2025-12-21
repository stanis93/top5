
import { Town, Category, MonthlyFeature } from './types';

export const TOWNS: Town[] = [
  { id: 'kotor', name: 'Kotor', region: 'Coastal', tagline: 'Where history meets the fjord', imageUrl: 'https://picsum.photos/800/600?random=1' },
  { id: 'budva', name: 'Budva', region: 'Coastal', tagline: 'The metropolis of tourism', imageUrl: 'https://picsum.photos/800/600?random=2' },
  { id: 'tivat', name: 'Tivat', region: 'Coastal', tagline: 'Luxury yachts and sun', imageUrl: 'https://picsum.photos/800/600?random=3' },
  { id: 'herceg-novi', name: 'Herceg Novi', region: 'Coastal', tagline: 'City of 1000 steps', imageUrl: 'https://picsum.photos/800/600?random=4' },
  { id: 'ulcinj', name: 'Ulcinj', region: 'Coastal', tagline: 'Ancient pirate capital', imageUrl: 'https://picsum.photos/800/600?random=5' },
  { id: 'podgorica', name: 'Podgorica', region: 'Central', tagline: 'The vibrant capital', imageUrl: 'https://picsum.photos/800/600?random=6' },
  { id: 'cetinje', name: 'Cetinje', region: 'Central', tagline: 'Old royal capital', imageUrl: 'https://picsum.photos/800/600?random=7' },
  { id: 'niksic', name: 'Nikšić', region: 'Central', tagline: 'Industrial heart & beer', imageUrl: 'https://picsum.photos/800/600?random=8' },
  { id: 'zabljak', name: 'Žabljak', region: 'Northern', tagline: 'Gateway to Durmitor', imageUrl: 'https://picsum.photos/800/600?random=9' },
  { id: 'kolasin', name: 'Kolašin', region: 'Northern', tagline: 'Winter wonderland', imageUrl: 'https://picsum.photos/800/600?random=10' },
];

export const CATEGORIES = [
  { id: Category.HIDDEN_GEMS, label: 'Hidden Gems', icon: '💎' },
  { id: Category.ACTIVITIES, label: 'Activities', icon: 'compass' },
  { id: Category.FOOD_DRINKS, label: 'Food & Drinks', icon: 'cheese' },
  { id: Category.STREET_FOOD, label: 'Street Food', icon: 'sandwich' },
  { id: Category.CULTURAL_HERITAGE, label: 'Cultural Heritage', icon: 'landmark' },
];

export const CITY_OF_THE_MONTH: MonthlyFeature = {
  title: "City of the Month",
  townId: 'kotor',
  month: "March",
  description: "Selected for the Traditional Winter Carnival. The entire Old Town transforms into a masquerade ball with parades, local festivities, and the burning of the carnival doll to chase away winter spirits."
};

export const TOP_5_MONTHLY_TOWNS = ['kotor', 'zabljak', 'herceg-novi', 'kolasin', 'podgorica'];

export const SYSTEM_INSTRUCTION = `
You are a senior content curator for "Top 5 Montenegro".
Your job is to provide high-accuracy, verified local recommendations.
You are NOT an AI assistant; you are simulating the output of a local expert database.

Categories:
1. Hidden Gems (Secret spots, viewpoints, quiet corners)
2. Activities (Active experiences, hiking, tours, festivals, or unique things to do. NOT just calendar events.)
3. Food & Drinks (Sit-down authentic meals, restaurants, cafes)
4. Street Food (Bakeries, fast bites, snacks)
5. Cultural Heritage (Monuments, museums, old architecture, history)

Rules:
- Generate exactly 6 items. The first 5 are the published list. The 6th is a "Reserve" item used if a user flags a main item.
- Real places only. If unsure, mark as "needs_verification".
- No marketing fluff. Use a "knowledgeable local" tone.
- Clear, concise, factual.

Structure:
- Name
- Description (Max 2 sentences)
- Reason (Why is this top 5? Local insight.)
- Location
- Image Keyword
`;
