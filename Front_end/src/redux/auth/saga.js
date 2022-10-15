// @flow
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { fetchJSON } from '../../helpers/api';

import { LOGIN_USER, LOGOUT_USER, REGISTER_USER, FORGET_PASSWORD } from './constants';

import * as authUtils from '../../helpers/authUtils';

import * as common from '../../utils/common'

import {
    loginUserSuccess,
    loginUserFailed,
    registerUserSuccess,
    registerUserFailed,
    forgetPasswordSuccess,
    forgetPasswordFailed,
} from './actions';

const storageName="Role";
/**
 * Sets the session
 * @param {*} user
 */
// const setSession = user => {
//     let cookies = new Cookies();
//     if (user) cookies.set('user', JSON.stringify(user), { path: '/' });
//     else cookies.remove('user', { path: '/' });
// };
/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({ payload: { username, password } }) {
    const options = {
        method: common.method.post,
        body: JSON.stringify({ username, password })
    };
    var response=yield call(fetchJSON, 'user/login', options);
    if(response.status && response.status!=200){
        yield put(loginUserFailed(response.message));
        authUtils.setSession(null);
    }else{
        // localStorage.setItem(storageName,response.Rolename);
        authUtils.setSession(response);
        // yield put(loginUserSuccess(response));
        window.location=("/");
    }
        
}

/**
 * Logout the user
 * @param {*} param0
 */
function* logout({ payload: { history } }) {
    try {
        // localStorage.removeItem(storageName);
        authUtils.removeSession();
        yield call(() => {
            history.push('/account/login');
        });
    } catch (error) {}
}

/**
 * Register the user
 */
function* register({ payload: { fullname, email, password } }) {
    const options = {
        body: JSON.stringify({ fullname, email, password }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = yield call(fetchJSON, '/users/register', options);
        yield put(registerUserSuccess(response));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(registerUserFailed(message));
    }
}

/**
 * Api Calling
 * @param {*} payload - username and password
 */
 function* getApiData({ payload: { username, password } }) {
    const options = {
        method: common.method.post,
        body: JSON.stringify({ username, password })
    };

    var response=yield call(fetchJSON, 'users/login', options);
    if(response.status && response.status!=200){
        yield put(loginUserFailed(response.message));
        authUtils.setSession(null);
    }else{
        authUtils.setSession(response);
        yield put(loginUserSuccess(response));
    }
        
}

/**
 * forget password
 */
function* forgetPassword({ payload: { username } }) {
    const options = {
        body: JSON.stringify({ username }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    try {
        const response = yield call(fetchJSON, '/users/password-reset', options);
        yield put(forgetPasswordSuccess(response.message));
    } catch (error) {
        let message;
        switch (error.status) {
            case 500:
                message = 'Internal Server Error';
                break;
            case 401:
                message = 'Invalid credentials';
                break;
            default:
                message = error;
        }
        yield put(forgetPasswordFailed(message));
    }
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, login);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, register);
}

export function* watchForgetPassword() {
    yield takeEvery(FORGET_PASSWORD, forgetPassword);
}

function* authSaga() {
    yield all([fork(watchLoginUser), fork(watchLogoutUser), fork(watchRegisterUser), fork(watchForgetPassword)]);
}

export default authSaga;
