import { createAction } from '../shared/actionFactory';
import { LoaderKeys } from '../shared/constants';
import {
  GetMyMembershipResponse,
} from './types';

/**
 * Membership actions with automatic Redux integration
 */

// Get my membership
export const getMyMembership = createAction<undefined, GetMyMembershipResponse>({
  method: 'GET',
  url: '/memberships/me',
  loaderKey: LoaderKeys.MEMBERSHIP_LOADING,
});
