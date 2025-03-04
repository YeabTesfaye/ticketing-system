import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Pagination } from 'react-bootstrap';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../slices/usersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AdminUsersScreen = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10; 

  const { data, isLoading, error } = useGetUsersQuery({ page, limit });
  const [deleteUser] = useDeleteUserMutation();
  const { user } = useSelector((state) => state.auth);

  if (user?.role !== 'admin') {
    navigate('/');
  }

  const deleteHandler = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Manage Users</h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || 'Error loading users'}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((u) => (
                <tr key={u._id}>
                  <td>{u._id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(u._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <Pagination className="justify-content-center">
            <Pagination.Prev
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            />
            {Array.from({ length: data.totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, data.totalPages))
              }
              disabled={page === data.totalPages}
            />
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default AdminUsersScreen;
