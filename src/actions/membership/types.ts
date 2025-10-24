/**
 * TypeScript types for membership API requests and responses
 */

// Get My Membership
export interface GetMyMembershipResponse {
  success: boolean;
  membership: {
    _id: string;
    user_id: string;
    membership_card_id: string;
    card_type_name: string;
    purchase_date: string;
    expiry_date: string;
    status: 'active' | 'expired' | 'cancelled';
    benefits: string[];
    created_at: string;
    updated_at: string;
  } | null;
}
