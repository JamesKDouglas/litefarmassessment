/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (saga.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

import { createAction } from '@reduxjs/toolkit';
import { call, put, select, takeLeading } from 'redux-saga/effects';
import { url } from '../../apiConfig';
import history from '../../history';
import { finishSendHelp, postHelpRequestSuccess } from '../Home/homeSlice';
import i18n from '../../locales/i18n';
import { axios } from '../saga';
import { enqueueErrorSnackbar } from '../Snackbar/snackbarSlice';
import { loginSelector } from '../userFarmSlice';

const supportUrl = () => `${url}/support_ticket`;

const deleteFarmUrl = (farm_id) => `${url}/farm/${farm_id}`;

export const supportFileUpload = createAction(`supportFileUploadSaga`);

export const supportDeleteFarm = createAction('supportDeleteFarmSaga');

export function* supportDeleteFarmSaga({ payload: { confirm } }) {
  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);
  let result;
  result = yield call(axios.delete, deleteFarmUrl(farm_id), header);
  if (result) {
    history.push('/');
    yield put(finishSendHelp());
  } else {
    console.log('Error deleting farm');
    yield put(finishSendHelp());
  }
}

export function* supportFileUploadSaga({ payload: { file, form } }) {
  try {
    const formData = new FormData();
    formData.append('_file_', file);
    formData.append('data', JSON.stringify(form));
    const result = yield call(axios.post, supportUrl(), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
      },
    });

    if (result) {
      yield put(postHelpRequestSuccess());
      history.push('/');
    } else {
      yield put(enqueueErrorSnackbar(i18n.t('message:ATTACHMENTS.ERROR.FAILED_UPLOAD')));
    }

    console.log('result of sending request for help:', result);
    yield put(finishSendHelp());
  } catch (e) {
    yield put(enqueueErrorSnackbar(i18n.t('message:ATTACHMENTS.ERROR.FAILED_UPLOAD')));
    yield put(finishSendHelp());
    console.log(e);
  }
}

export default function* supportSaga() {
  yield takeLeading(supportFileUpload.type, supportFileUploadSaga);
  yield takeLeading(supportDeleteFarm.type, supportDeleteFarmSaga);
}

export function getHeader(user_id, farm_id, { headers, ...props } = {}) {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('id_token'),
      user_id,
      farm_id,
      ...headers,
    },
    ...props,
  };
}
