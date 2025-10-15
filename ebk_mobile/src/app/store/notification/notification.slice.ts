import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from '..';

export interface Inotification {
  collapseKey: string;
  data: {
    body: string;
    iconApp: string;
    id: string;
    image: string;
    typeFile: string;
    // createdAt: string,
  };
  from: string;
  messageId: string;
  notification: {
    android: {
      imageUrl: string;
      smallIcon: string;
    };
    body: string;
    title: string;
  };
  sentTime: number;
  ttl: number;
}

export interface StateNotification {
  notification: Inotification[];
}

const initialState: StateNotification = {
  notification: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{notification: Inotification}>,
    ) => {
      state.notification = [...state.notification, action.payload.notification];
    },
    updateNotification: (
      state,
      action: PayloadAction<{notification: Inotification}>,
    ) => {
      state.notification = state.notification.filter(
        item => item.data.id !== action.payload.notification.data.id,
      );
    },
  },
});

export const {addNotification, updateNotification} = notificationSlice.actions;

export const selectNotification = (state: AppState) => state.notification;

export default notificationSlice.reducer;

export const persistConfigNotification = {
  key: 'notification_ecclesia_book_mobile',
  version: 1,
  storage: AsyncStorage,
};
