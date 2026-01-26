/**
 * Session storage keys and utilities for user profile data
 */

const PROFILE_DATA_KEY = 'user_profile_data';
const ANON_PREFERENCES_KEY = 'anon_preferences';

export interface StoredProfileData {
  language?: string;
  currency?: string;
  profile_photo_url?: string;
  first_name?: string;
  last_name?: string;
}

export interface AnonymousPreferences {
  language?: string;
  currency?: string;
}

/**
 * Get stored profile data from session storage
 */
export const getStoredProfileData = (): StoredProfileData | null => {
  try {
    const data = sessionStorage.getItem(PROFILE_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading profile data from session storage:', error);
    return null;
  }
};

/**
 * Save profile data to session storage
 */
export const setStoredProfileData = (data: StoredProfileData): void => {
  try {
    sessionStorage.setItem(PROFILE_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving profile data to session storage:', error);
  }
};

/**
 * Update specific fields in stored profile data
 */
export const updateStoredProfileData = (updates: Partial<StoredProfileData>): void => {
  const current = getStoredProfileData() || {};
  setStoredProfileData({ ...current, ...updates });
};

/**
 * Clear profile data from session storage
 */
export const clearStoredProfileData = (): void => {
  try {
    sessionStorage.removeItem(PROFILE_DATA_KEY);
  } catch (error) {
    console.error('Error clearing profile data from session storage:', error);
  }
};

/**
 * Get anonymous user preferences from session storage
 */
export const getAnonymousPreferences = (): AnonymousPreferences | null => {
  try {
    const data = sessionStorage.getItem(ANON_PREFERENCES_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading anonymous preferences from session storage:', error);
    return null;
  }
};

/**
 * Save anonymous user preferences to session storage
 */
export const setAnonymousPreferences = (preferences: AnonymousPreferences): void => {
  try {
    sessionStorage.setItem(ANON_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving anonymous preferences to session storage:', error);
  }
};

/**
 * Update specific fields in anonymous preferences
 */
export const updateAnonymousPreferences = (updates: Partial<AnonymousPreferences>): void => {
  const current = getAnonymousPreferences() || {};
  setAnonymousPreferences({ ...current, ...updates });
};

/**
 * Clear anonymous preferences from session storage
 */
export const clearAnonymousPreferences = (): void => {
  try {
    sessionStorage.removeItem(ANON_PREFERENCES_KEY);
  } catch (error) {
    console.error('Error clearing anonymous preferences from session storage:', error);
  }
};

/**
 * Unified function to update language/currency in session storage
 * Handles both authenticated users (updates profile data) and anonymous users (updates preferences)
 */
export const updateLanguageOrCurrencyInStorage = (
  updates: Partial<StoredProfileData>,
  isAuthenticated: boolean
): void => {
  if (isAuthenticated) {
    // Update authenticated user's profile data
    updateStoredProfileData(updates);
  } else {
    // Update anonymous user's preferences
    updateAnonymousPreferences(updates);
  }
};
