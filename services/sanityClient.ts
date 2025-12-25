import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityBlogPost, SanityListItem, SanityImageAsset, SanityTown, SanityAmbassador } from '../types';

// Initialize Sanity client
export const sanityClient = createClient({
    projectId: 'e2i5r2dg',
    dataset: 'production',
    useCdn: false, // Disable CDN to avoid caching issues during development
    apiVersion: '2024-01-01', // Use current date for latest features
    // token: import.meta.env.VITE_SANITY_API_TOKEN, // Not needed for public datasets
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimized image URL from Sanity image asset
 */
export function urlFor(source: SanityImageAsset) {
    return builder.image(source);
}

/**
 * Fetch all published blog posts, ordered by published date (newest first)
 */
export async function fetchBlogPosts(): Promise<SanityBlogPost[]> {
    const query = `*[_type == "blogPost" && status == "published"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    category,
    author->{
      _id,
      _type,
      name,
      title,
      email,
      town,
      avatar,
      bio
    },
    excerpt,
    hero,
    content,
    takeaway,
    tags,
    readingTime,
    publishedAt,
    status
  }`;

    try {
        const posts = await sanityClient.fetch<SanityBlogPost[]>(query);
        return posts;
    } catch (error) {
        console.error('Error fetching blog posts from Sanity:', error);
        return [];
    }
}

/**
 * Fetch list items for a specific town and category
 * Only returns published items, ordered by rank
 */
export async function fetchListItems(
    town: string,
    category: string
): Promise<SanityListItem[]> {
    const query = `*[_type == "listItem" && lower(town) == lower($town) && category == $category && status == "published"] | order(rank asc) {
    _id,
    _type,
    name,
    slug,
    town,
    category,
    description,
    reason,
    content,
    images,
    gallery,
    location,
    features,
    contactInfo,
    verifiedBy[]->{
      _id,
      _type,
      name,
      title,
      email,
      town,
      avatar,
      bio
    },
    verificationDate,
    rank,
    status
  }`;

    try {
        const items = await sanityClient.fetch<SanityListItem[]>(query, {
            town,
            category,
        });
        return items;
    } catch (error) {
        console.error('Error fetching list items from Sanity:', error);
        return [];
    }
}

/**
 * Fetch a single blog post by slug
 */
export async function fetchBlogPostBySlug(
    slug: string
): Promise<SanityBlogPost | null> {
    const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    category,
    author->{
      _id,
      _type,
      name,
      title,
      email,
      town,
      avatar,
      bio
    },
    excerpt,
    hero,
    content,
    takeaway,
    tags,
    readingTime,
    publishedAt,
    status
  }`;

    try {
        const post = await sanityClient.fetch<SanityBlogPost | null>(query, {
            slug,
        });
        return post;
    } catch (error) {
        console.error('Error fetching blog post by slug from Sanity:', error);
        return null;
    }
}

/**
 * Fetch ambassadors for a specific town
 */
export async function fetchAmbassadorsByTown(townId: string): Promise<SanityAmbassador[]> {
    const query = `*[_type == "ambassador" && (town == $townId || lower(town) == lower($townId))] {
    _id,
    _type,
    name,
    title,
    email,
    town,
    avatar,
    bio
  }`;

    try {
        const ambassadors = await sanityClient.fetch<SanityAmbassador[]>(query, {
            townId,
        });
        return ambassadors;
    } catch (error) {
        console.error('Error fetching ambassadors from Sanity:', error);
        return [];
    }
}

/**
 * Fetch all towns ordered by custom order field
 */
export async function fetchTowns(): Promise<SanityTown[]> {
    const query = `*[_type == "town"] | order(order asc, name asc) {
    _id,
    _type,
    name,
    slug,
    region,
    tagline,
    image,
    order
  }`;

    try {
        const towns = await sanityClient.fetch<SanityTown[]>(query);
        return towns;
    } catch (error) {
        console.error('Error fetching towns from Sanity:', error);
        return [];
    }
}
