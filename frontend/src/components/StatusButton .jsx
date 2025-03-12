import React from 'react';
import { Button } from 'react-bootstrap';

const StatusButton = ({ status, currentStatus, onClick, isAdmin }) => {
  const isDisabled = currentStatus === status || !isAdmin; // Disable if status is the same or user is not admin
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
