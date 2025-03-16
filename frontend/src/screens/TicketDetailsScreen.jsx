import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useGetTicketByIdQuery,
  useUpdateTicketStatusMutation,
  useDeleteTicketMutation,
} from '../slices/ticketApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import StatusButton from '../components/StatusButton';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { toast } from 'react-toastify';

const TicketDetailsScreen = () => {
  const { selectedTicketId } = useSelector((state) => state.ticket);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedTicketId) {
      navigate('/tickets');
    }
  }, [selectedTicketId, navigate]);

  const {
    data: ticketData,
    isLoading,
    error,
    refetch,
  } = useGetTicketByIdQuery(selectedTicketId);
  const [updateTicket] = useUpdateTicketStatusMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  // Destructure ticket object for easier use
  const ticket = ticketData?.ticket;

  if (isLoading) return <Loader />;
  if (error)
    return <Message variant="danger">Error loading ticket details!</Message>;

  // Function to handle ticket status update
  const handleUpdateStatus = async (status) => {
    try {
      await updateTicket({ id: ticket?._id, status }).unwrap();
      toast.success('Ticket status updated successfully');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update ticket status');
    }
  };

  const handleDeleteTicket = async () => {
    try {
      await deleteTicket(ticket?._id).unwrap();
      toast.success('Ticket deleted successfully');
      navigate('/tickets');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete the ticket');
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Ticket Details</h1>

      {ticket && (
        <Card className="p-4">
          <Row>
            <Col md={6}>
              <h4>Title: {ticket.title}</h4>
              <p>
                <strong>Description:</strong> {ticket.description}
              </p>
              <p>
                <strong>Status:</strong> {ticket.status}
              </p>
            </Col>
            <Col md={6}>
              <h5>Actions</h5>
              <div className="d-flex flex-wrap">
                {userInfo?.role === 'admin' && ticket.status === 'Open' && (
                  <>
                    <StatusButton
                      status="In Progress"
                      currentStatus={ticket.status}
                      onClick={() => handleUpdateStatus('In Progress')}
                      isAdmin={userInfo.role === 'admin'}
                    />
                    <StatusButton
                      status="Closed"
                      currentStatus={ticket.status}
                      onClick={() => handleUpdateStatus('Closed')}
                      isAdmin={userInfo.role === 'admin'}
                    />
                  </>
                )}

                {userInfo?.role === 'admin' &&
                  ticket.status === 'In Progress' && (
                    <StatusButton
                      status="Closed"
                      currentStatus={ticket.status}
                      onClick={() => handleUpdateStatus('Closed')}
                      isAdmin={userInfo?.role === 'admin'}
                    />
                  )}

                {ticket.status === 'Closed' && (
                  <Message variant="info">This ticket is closed</Message>
                )}

                {userInfo?.role === 'admin' && (
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteDialog(true)}
                    className="m-2"
                  >
                    Delete Ticket
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => navigate('/tickets')}
                  className="m-2"
                >
                  Back to Tickets
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      <ConfirmationDialog
        show={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteTicket}
        message="Are you sure you want to delete this ticket?"
      />
    </Container>
  );
};

export default TicketDetailsScreen;
