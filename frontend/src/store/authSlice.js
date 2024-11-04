import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import axios from 'axios';
export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await axios.post('https://i.zyll.shop/login/', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.request.message);
    }
});

export const register = createAsyncThunk('auth/register', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
        const response = await axios.post('https://i.zyll.shop/register/', data, {
            headers: {
                'Content-Type': 'application/json',

            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.request.response);
    }
});

export const get_info = createAsyncThunk('auth/info', async (data, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {

        const response = await axios.get('https://i.zyll.shop/profile/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data}`
            }
        });
        return response.data;
    } catch (error) {

        return rejectWithValue(error.request.message);
    }
});



const initialState = {
    isLoading: false,
    wrongLogin: null,
    isLogged: false,
    isAdmin: false,
    //email: null,
    access_token: null,
    userAuth: null,
    respRegister: null,
    full_name: null,
    avatar: null


}
const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.wrongLogin = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.detail === "No active account found with the given credentials" || action.payload.detail === "You do not have permission to perform this action.") {
                    state.wrongLogin = true;

                }
                else {
                    state.isLogged = true;
                    state.access_token = action.payload.access;
                    state.userAuth = action.meta.arg.username;
                    Cookies.set('access_token', state.access_token, { expires: 30 });
                }
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
                state.wrongLogin = true;
                state.isLogged = false;
            })

            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.wrongLogin = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.respRegister = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.wrongLogin = true;
                state.isLogged = false;
                state.isLoading = false;
                state.respRegister = action.payload;
            })

            //get_info
            .addCase(get_info.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(get_info.fulfilled, (state, action) => {

                state.isLoading = false;
                if (action.payload.detail !== "No active account found with the given credentials") {
                    console.log(action.payload)
                    state.isLogged = true;
                    state.avatar = action.payload.avatar;
                    state.full_name = action.payload.full_name;
                    //state.isAdmin = action.payload.is_superuser;
                    //state.userAuth = action.payload.username;
                    //state.email = action.payload.email;
                    state.access_token = action.meta.arg;
                }
                else {

                }
            })
            .addCase(get_info.rejected, (state) => {
                state.isLoading = false;
                state.isLogged = false;
            })




    }
})

export default authSlice.reducer;
