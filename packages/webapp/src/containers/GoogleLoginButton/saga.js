import { createAction } from '@reduxjs/toolkit';
import { put, takeLatest, call, select } from 'redux-saga/effects';
import { loginUrl as url } from '../../apiConfig';
import { onLoadingUserFarmsStart, onLoadingUserFarmsFail } from '../userFarmSlice';
import history from '../../history';
import { loginSelector, loginSuccess } from '../loginSlice';
import { toastr } from 'react-redux-toastr';

const axios = require('axios');
const loginUrl = () => `${url}/google`;

export const loginWithGoogle = createAction(`loginWithGoogleSaga`);

export function* loginWithGoogleSaga({ payload: google_id_token }) {
  try {
    yield put(onLoadingUserFarmsStart());
    const header = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + google_id_token,
      },
    };
    const result = yield call(axios.post, loginUrl(), {}, header);
    const { id_token, user } = result.data;
    localStorage.setItem('id_token', id_token);
    if (id_token === '') {
      history.push({
        pathname: '/',
        state: { component: 'PureEnterPasswordPage', user },
      });
    } else {
      yield put(loginSuccess(user));
      history.push('/farm_selection');
    }
  } catch (e) {
    yield put(onLoadingUserFarmsFail());
    toastr.error('Failed to login user info');
  }
}

export default function* loginSaga() {
  yield takeLatest(loginWithGoogle.type, loginWithGoogleSaga);
}