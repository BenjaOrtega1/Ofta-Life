import { business } from "../constants/business";

export type GoogleReview = {
  reviewerName: string;
  reviewerInitials: string;
  rating: number;
  date: string;
  reviewText: string;
  source: "Google";
  sourceUrl: string;
  isVerifiedGoogleReview: boolean;
};

export const googleReviewsSummary = {
  businessName: business.businessName,
  businessRating: null as number | null,
  totalReviews: 0,
  googleReviewsUrl: business.googleReviewsUrl,
};

// Copy only real Google Business Profile reviews here.
// Keep this empty until the review text, reviewer, date, rating, and source URL are verified.
export const googleReviews: GoogleReview[] = [];
