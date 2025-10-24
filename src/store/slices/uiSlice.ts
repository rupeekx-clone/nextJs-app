import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIModals {
  profileEdit: boolean;
  documentUpload: boolean;
  paymentModal: boolean;
}

interface UIState {
  activeLoaders: { [key: string]: boolean };
  globalLoading: boolean;
  modals: UIModals;
}

const initialState: UIState = {
  activeLoaders: {},
  globalLoading: false,
  modals: {
    profileEdit: false,
    documentUpload: false,
    paymentModal: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Set a specific loader as active/inactive
    setLoader: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      if (loading) {
        state.activeLoaders[key] = true;
      } else {
        delete state.activeLoaders[key];
      }
    },

    // Set global loading state
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },

    // Open/close modals
    setModal: (state, action: PayloadAction<{ modal: keyof UIModals; open: boolean }>) => {
      const { modal, open } = action.payload;
      state.modals[modal] = open;
    },

    // Clear all loaders
    clearAllLoaders: (state) => {
      state.activeLoaders = {};
    },

  },
});

export const {
  setLoader,
  setGlobalLoading,
  setModal,
  clearAllLoaders,
} = uiSlice.actions;

// Selectors
export const selectActiveLoaders = (state: { ui: UIState }) => state.ui.activeLoaders;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectIsLoading = (state: { ui: UIState }, key: string) => 
  state.ui.activeLoaders[key] || false;

export default uiSlice.reducer;
