import React from 'react';
import PureHelpRequestPage from '../../components/Help';
import { useDispatch, useSelector } from 'react-redux';
import { supportFileUpload } from './saga';
import history from '../../history';
import { isHelpLoadingSelector, startSendHelp } from '../Home/homeSlice';
import { userFarmSelector } from '../userFarmSlice';

export default function HelpRequest() {
  const dispatch = useDispatch();

  const handleSubmit = (file, data) => {
    dispatch(startSendHelp());
    //This sends the form data to the server. It's called SupportFileUpload, which is a bit odd. But it does the job.
    //Saga runs his supportFileUpload function. It sends an API request to make  support ticket,
    //and a second api request if a deleteFarm is the support type.
    dispatch(supportFileUpload({ file, form: data }));
    // dispatch()
  };

  const handleBack = () => {
    history.push('/');
  };

  const { email, phone_number, is_admin } = useSelector(userFarmSelector);
  // console.log("farm ID:", farm_id);
  const loading = useSelector(isHelpLoadingSelector);
  return (
    <PureHelpRequestPage
      onSubmit={handleSubmit}
      goBack={handleBack}
      email={email}
      phone_number={phone_number}
      isLoading={loading}
      isAdmin={is_admin}
    />
  );
}
