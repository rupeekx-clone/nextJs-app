import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoanApplication {
  id: string;
  user_id: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  purpose: string;
  employment_type: 'salaried' | 'self_employed';
  monthly_income: number;
  company_name: string;
  work_experience: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  approved_amount?: number;
  interest_rate?: number;
  tenure_months?: number;
  processing_fee?: number;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

interface ApplicationsState {
  applications: LoanApplication[];
  loading: boolean;
  error: string | null;
  lastFetched: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set applications (for initial load or refresh)
    setApplications: (state, action: PayloadAction<LoanApplication[]>) => {
      state.applications = action.payload;
      state.loading = false;
      state.error = null;
      state.lastFetched = new Date().toISOString();
    },

    // Add a new application
    addApplication: (state, action: PayloadAction<LoanApplication>) => {
      state.applications.unshift(action.payload);
    },

    // Update an existing application
    updateApplication: (state, action: PayloadAction<{ id: string; updates: Partial<LoanApplication> }>) => {
      const { id, updates } = action.payload;
      const index = state.applications.findIndex(app => app.id === id);
      if (index !== -1) {
        state.applications[index] = { ...state.applications[index], ...updates };
      }
    },

    // Remove an application
    removeApplication: (state, action: PayloadAction<string>) => {
      state.applications = state.applications.filter(app => app.id !== action.payload);
    },

    // Clear all applications
    clearApplications: (state) => {
      state.applications = [];
      state.lastFetched = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setApplications,
  addApplication,
  updateApplication,
  removeApplication,
  clearApplications,
  clearError,
} = applicationsSlice.actions;

// Selectors
export const selectApplications = (state: { applications: ApplicationsState }) => 
  state.applications.applications;
export const selectApplicationsLoading = (state: { applications: ApplicationsState }) => 
  state.applications.loading;
export const selectApplicationsError = (state: { applications: ApplicationsState }) => 
  state.applications.error;
export const selectApplicationById = (state: { applications: ApplicationsState }, id: string) => 
  state.applications.applications.find(app => app.id === id);
export const selectApplicationsByStatus = (state: { applications: ApplicationsState }, status: string) => 
  state.applications.applications.filter(app => app.status === status);

export default applicationsSlice.reducer;
