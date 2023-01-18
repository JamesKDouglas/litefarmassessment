import React from 'react';
import PureHelpRequestPage from '../../components/Help';
import { useDispatch, useSelector } from 'react-redux';
import { supportFileUpload, supportDeleteFarm } from './saga';
import history from '../../history';
import { isHelpLoadingSelector, startSendHelp, startDeleteFarm } from '../Home/homeSlice';
import { userFarmSelector } from '../userFarmSlice';

export default function HelpRequest() {
  const dispatch = useDispatch();

  const handleSubmit = (file, data) => {
    dispatch(startSendHelp());
    dispatch(supportFileUpload({ file, form: data }));
  };

  const deleteFarm = () => {
    dispatch(startDeleteFarm());
    dispatch(supportDeleteFarm({ confirm: true }));
  };

  const handleBack = () => {
    history.push('/');
  };

  const { email, phone_number, is_admin } = useSelector(userFarmSelector);

  const loading = useSelector(isHelpLoadingSelector);

  return (
    <PureHelpRequestPage
      onSubmit={handleSubmit}
      deleteFarm={deleteFarm}
      goBack={handleBack}
      email={email}
      phone_number={phone_number}
      isLoading={loading}
      isAdmin={is_admin}
    />
  );
}
