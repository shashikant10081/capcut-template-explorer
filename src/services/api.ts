import { CacheService } from './cache';

const SEARCH_API_URL = 'https://cc-search.onrender.com/?search=';
const COLLECTION_API_BASE_URL = 'https://cc-list.onrender.com/get_collection_templates?id=';

const API_HEADERS = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'origin': 'https://www.capcutlover.pro',
  'referer': 'https://www.capcutlover.pro/',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
};

export interface Author {
  uid: number;
  web_uid: string;
  unique_id: string;
  name: string;
  avatar_url: string;
  description: string;
}

export interface VideoDynamicCover {
  url: string;
  width: number;
  height: number;
}

export interface VideoTemplate {
  id: number;
  web_id: string;
  title: string;
  short_title: string;
  author: Author;
  cover_url: string;
  cover_width: number;
  cover_height: number;
  video_url: string;
  duration: number;
  template_url: string;
  fragment_count: number;
  usage_amount: number;
  play_amount: number;
  like_count: number;
  favorite_count: number;
  video_dynamic_cover?: VideoDynamicCover;
  create_time: number;
}

export interface ApiResponse {
  ret: string;
  errmsg: string;
  data: {
    total: number;
    video_templates: VideoTemplate[];
    has_more: boolean;
  };
}

export class ApiService {
  static async getCollectionTemplates(collectionId: number, count: number = 200): Promise<ApiResponse> {
    const cacheKey = `collection_${collectionId}_${count}`;
    const cached = CacheService.get<ApiResponse>(cacheKey);
    
    if (cached) {
      console.log('Using cached collection data');
      return cached;
    }

    const url = `${COLLECTION_API_BASE_URL}${collectionId}&count=${count}`;
    const response = await fetch(url, {
      headers: API_HEADERS,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch collection templates');
    }

    const data: ApiResponse = await response.json();
    CacheService.set(cacheKey, data);
    
    return data;
  }

  static async searchTemplates(query: string): Promise<ApiResponse> {
    const cacheKey = `search_${query.toLowerCase().trim()}`;
    const cached = CacheService.get<ApiResponse>(cacheKey);
    
    if (cached) {
      console.log('Using cached search data for:', query);
      return cached;
    }

    const url = `${SEARCH_API_URL}${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: API_HEADERS,
    });

    if (!response.ok) {
      throw new Error('Failed to search templates');
    }

    const data: ApiResponse = await response.json();
    CacheService.set(cacheKey, data);
    
    return data;
  }
}

export const categories = [
  { id: 6001, display_name: "For You", emoji: "✨" },
  { id: 6003, display_name: "TikTok", emoji: "🎵" },
  { id: 6011, display_name: "Lifestyle", emoji: "🌟" },
  { id: 4010, display_name: "Business", emoji: "💼" },
  { id: 6086, display_name: "Student", emoji: "📚" },
  { id: 6008, display_name: "Velocity", emoji: "⚡" },
  { id: 6007, display_name: "Lyrics", emoji: "🎤" },
  { id: 6019, display_name: "Fitness", emoji: "💪" },
  { id: 6010, display_name: "Memes", emoji: "😂" },
  { id: 6002, display_name: "Effects", emoji: "✨" },
  { id: 6004, display_name: "Celebrate", emoji: "🎉" },
  { id: 6005, display_name: "Fandom", emoji: "💜" },
  { id: 6080, display_name: "Editor's Picks", emoji: "🏆" },
  { id: 6029, display_name: "Gaming", emoji: "🎮" },
  { id: 6104, display_name: "Daily VLOG", emoji: "📹" },
  { id: 6105, display_name: "Travel VLOG", emoji: "✈️" },
  { id: 6107, display_name: "Collage", emoji: "🖼️" },
  { id: 6108, display_name: "Slideshow", emoji: "📸" },
  { id: 6113, display_name: "Hot", emoji: "🔥" },
  { id: 6094, display_name: "AI Filter", emoji: "🤖" },
  { id: 6038, display_name: "Aesthetic", emoji: "🌸" },
  { id: 6009, display_name: "Friends", emoji: "👯" },
];
