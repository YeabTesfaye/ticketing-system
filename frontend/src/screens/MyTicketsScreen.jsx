import { useState } from 'react';
import { Container, Table, Button, Pagination } from 'react-bootstrap';
import { useGetTicketsQuery } from '../slices/ticketApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { formatId } from '../utils';

const MyTicketsScreen = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useGetTicketsQuery({ page, limit });

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Error loading tickets!</Message>;

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">My Tickets</h1>

      {data?.tickets.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center text-center">
          <Message variant="info">You have no tickets yet.</Message>
          <div className="d-flex gap-3 mt-3">
            <Button variant="primary" as={Link} to="/">
              Go Home
            </Button>
            <Button variant="secondary" as={Link} to="/ticket">
              Create New Ticket
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{formatId(ticket._id)}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.status}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/ticket/${ticket._id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.Prev
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              />
              {[...Array(data.totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === page}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, data.totalPages))
                }
                disabled={page === data.totalPages}
              />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default MyTicketsScreen;
