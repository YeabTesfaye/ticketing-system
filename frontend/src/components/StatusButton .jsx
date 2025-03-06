import React from 'react';
import { Button } from 'react-bootstrap';

const StatusButton = ({ status, currentStatus, onClick }) => {
  // if (!isAdmin) return null; // Don't show buttons if the user is not an admin

  // Disable the button if the status is already set to the current one
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
