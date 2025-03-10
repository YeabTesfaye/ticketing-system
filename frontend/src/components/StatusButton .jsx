import React from 'react';
import { Button } from 'react-bootstrap';

const StatusButton = ({ status, currentStatus, onClick }) => {

  const isDisabled = currentStatus === status;

  return (
    <Button
      variant={status === 'In Progress' ? 'warning' : 'success'}
      onClick={onClick}
      disabled={isDisabled}
      className="m-2"
      style={{ display: 'inline-block', width: 'auto' }}
    >
      Mark as {status}
    </Button>
  );
};

export default StatusButton;
