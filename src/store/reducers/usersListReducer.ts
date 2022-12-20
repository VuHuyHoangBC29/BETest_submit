import httpClientApi from "@/apis/http-client.api";
import { setLocalItem } from "@/helpers/storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const fetchUsersListAction = createAsyncThunk(
  "usersList/fetchUsersList",
  async () => {
    const response = await httpClientApi.httpGet("/userList");

    setLocalItem("userList", response);

    return response;
  },
);

export const addUserAction = createAsyncThunk(
  "usersList/addUser",
  async (data: User) => {
    await httpClientApi.httpPost("/userList", data);

    const response = await httpClientApi.httpGet("/userList");

    setLocalItem("userList", response);

    return response;
  },
);

export interface UserType {
  id: string;
  name: string;
  age: number;
}

export interface User {
  name: string;
  age: number;
}

interface UsersListState {
  usersList: UserType[];
}

const INITIAL_STATE: UsersListState = {
  usersList: [],
};

const usersListSlice = createSlice({
  name: "userList",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsersListAction.fulfilled,
      (state: UsersListState, action: PayloadAction<UserType[]>) => {
        state.usersList = action.payload;
      },
    );
    builder.addCase(
      addUserAction.fulfilled,
      (state: UsersListState, action: PayloadAction<UserType>) => {
        let newUsersList = [...state.usersList];

        newUsersList.push(action.payload);

        state.usersList = newUsersList;
      },
    );
  },
});

export const usersListActions = usersListSlice.actions;
export const usersListReducer = usersListSlice.reducer;
