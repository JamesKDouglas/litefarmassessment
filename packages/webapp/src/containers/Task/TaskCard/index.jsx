import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { userFarmsByFarmSelector, userFarmSelector } from '../../userFarmSlice';
import { PureTaskCard } from '../../../components/CardWithStatus/TaskCard/TaskCard';
import TaskQuickAssignModal from '../../../components/Modals/QuickAssignModal';
import UpdateTaskDateModal from '../../../components/Modals/UpdateTaskDateModal';
import { assignTask, assignTasksOnDate, changeTaskDate } from '../saga';

const TaskCard = ({
  task_id,
  taskType,
  status,
  locationName,
  cropVarietyName,
  completeOrDueDate,
  assignee = null,
  style,
  onClick = null,
  selected,
  happiness,
  classes = { card: {} },
  ...props
}) => {
  const [showTaskAssignModal, setShowTaskAssignModal] = useState();
  const [showDateAssignModal, setShowDateAssignModal] = useState();
  const dispatch = useDispatch();
  const onChangeTaskDate = (date) => dispatch(changeTaskDate({ task_id, due_date: date }));
  const onAssignTasksOnDate = (task) => dispatch(assignTasksOnDate(task));
  const onAssignTask = (task) => dispatch(assignTask(task));
  const users = useSelector(userFarmsByFarmSelector).filter((user) => user.status !== 'Inactive');
  const user = useSelector(userFarmSelector);
  const immutableStatus = ['completed', 'abandoned'];

  const isAdmin = user.is_admin;
  const isAssignee = user.user_id === assignee.user_id;

  return (
    <>
      <PureTaskCard
        taskType={taskType}
        status={status}
        locationName={locationName}
        cropVarietyName={cropVarietyName}
        completeOrDueDate={completeOrDueDate}
        assignee={assignee}
        style={style}
        onClick={onClick}
        onClickAssignee={() => {
          if (!immutableStatus.includes(status) && isAssignee || isAdmin) {
            setShowTaskAssignModal(true);
          }
        }}
        onClickCompleteOrDueDate={() => {
          if (!immutableStatus.includes(status) && isAdmin) {
            setShowDateAssignModal(true);
          }
        }}
        selected={selected}
        happiness={happiness}
        classes={classes}
        isAdmin={isAdmin}
        isAssignee={isAssignee}
      />
      {showTaskAssignModal && (
        <TaskQuickAssignModal
          task_id={task_id}
          due_date={completeOrDueDate}
          isAssigned={!!assignee}
          onAssignTasksOnDate={onAssignTasksOnDate}
          onAssignTask={onAssignTask}
          users={users}
          user={user}
          dismissModal={() => setShowTaskAssignModal(false)}
        />
      )}
      {showDateAssignModal && (
        <UpdateTaskDateModal
          due_date={completeOrDueDate}
          onChangeTaskDate={onChangeTaskDate}
          dismissModal={() => setShowDateAssignModal(false)}
        />
      )}
    </>
  );
};

TaskCard.propTypes = {
  style: PropTypes.object,
  status: PropTypes.oneOf(['late', 'planned', 'completed', 'abandoned', 'forReview']),
  classes: PropTypes.shape({ container: PropTypes.object, card: PropTypes.object }),
  onClick: PropTypes.func,
  happiness: PropTypes.oneOf([1, 2, 3, 4, 5, 0, null]),
  locationName: PropTypes.string,
  taskType: PropTypes.object,
  cropVarietyName: PropTypes.string,
  completeOrDueDate: PropTypes.string,
  assignee: PropTypes.object,
  onClickAssignee: PropTypes.func,
  onClickCompleteOrDueDate: PropTypes.func,
  selected: PropTypes.bool,
  task_id: PropTypes.number,
};

export default TaskCard;
