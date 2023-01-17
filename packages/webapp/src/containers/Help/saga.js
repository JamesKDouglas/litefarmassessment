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
  console.log(confirm);

  let { user_id, farm_id } = yield select(loginSelector);
  const header = getHeader(user_id, farm_id);
  let result;

  result = yield call(axios.delete, deleteFarmUrl(farm_id), header);

  if (result) {
    // Do I want some sort of confirm message box here? Or on the homepage?

    //This yield statement could change the state in the redux store so you get the 48 hr response time popup.
    // yield put(postDelereFarmSuccess());//if response is 200. If not, output error to console?

    //We could use a similar yield put statement to implement a 'progress' using the snackbar. That is what the help request normally does - just change the state while Saga is working in the background to indicate progress.
    //As in,
    // yield put(finishDeleteFarm());

    // Just bring the user to the home screen
    history.push('/');
  } else {
    console.log('Error deleting farm');
  }
}

export function* supportFileUploadSaga({ payload: { file, form } }) {
  //Even though the delete farm help ticket is automatically taken care of, I'm leaving the help ticket entry into the table.

  //Consider altering the text of the email sent? It should say something like, "Your farm has been deleted. If this was a mistak, please reach out to the Litefarm team."
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
