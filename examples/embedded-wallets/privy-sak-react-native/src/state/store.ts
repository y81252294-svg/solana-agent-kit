import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/reducer';
import usersReducer from './users/reducer';
import notificationReducer from './notification/reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Increase tolerance thresholds to prevent warnings with large state
      serializableCheck: {
        // Increase the threshold to 200ms to prevent warnings with large state
        warnAfter: 200,
        // Ignore specific Redux paths that might contain large data
        ignoredPaths: ['profile.actions.data'],
      },
      // Increase immutability check threshold
      immutableCheck: {
        warnAfter: 200,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
