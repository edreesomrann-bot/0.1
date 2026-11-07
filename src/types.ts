import { JobStatus } from './utils/bookingState';
import { PricingBreakdown } from './utils/pricing';

export type Language = 'ar' | 'en';
export type UserMode = 'customer' | 'craftsman';

export interface ServiceCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  description: string;
  descriptionAr: string;
  basePrice: number;
  popularIssues: { en: string; ar: string }[];
  tags: string[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  commentAr: string;
}

export interface Craftsman {
  id: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  avatar: string;
  categoryId: string;
  categoryName: string;
  categoryNameAr: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  hourlyRate: number;
  distanceKm: number;
  isAvailable: boolean;
  verified: boolean;
  experienceYears: number;
  bio: string;
  bioAr: string;
  phone: string;
  skills: string[];
  skillsAr: string[];
  badges: string[];
  badgesAr: string[];
  reviews: Review[];
  portfolioImages: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'craftsman' | 'system';
  text: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  craftsmanId: string;
  craftsmanName: string;
  craftsmanNameAr: string;
  craftsmanAvatar: string;
  craftsmanTrade: string;
  craftsmanTradeAr: string;
  categoryId: string;
  serviceName: string;
  serviceNameAr: string;
  issueDescription: string;
  address: string;
  city: string;
  date: string;
  timeSlot: string;
  isUrgent: boolean;
  pricing: PricingBreakdown;
  status: JobStatus;
  createdAt: string;
  chatMessages: ChatMessage[];
  etaMinutes?: number;
}

export interface AIDiagnosisResult {
  problemSummary: string;
  problemSummaryAr: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probableCauses: { en: string; ar: string }[];
  suggestedAction: string;
  suggestedActionAr: string;
  recommendedCategory: string;
  estimatedCostRange: { min: number; max: number };
  safetyWarning?: string;
  safetyWarningAr?: string;
}
