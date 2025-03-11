import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '@/slices/usersApiSlice';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { formatId } from '@/utils';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const AdminUsersScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  

  // Pagination model for DataGrid
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // 0-based for MUI
    pageSize: 10,
  });

  const queryParams = {
    page: paginationModel.page + 1, // 1-based for API
    limit: paginationModel.pageSize,
  };

  const { data, isLoading, error } = useGetUsersQuery(queryParams, {
    refetchOnMountOrArgChange: true, // Ensure refetch on param change
  });

  const [deleteUser] = useDeleteUserMutation();

  // Redirect non-admins
  if (userInfo?.role !== 'admin') {
    navigate('/');
    return null;
  }

  // Define columns for DataGrid
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 120,
      valueGetter: (value, row) => formatId(row._id),
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 180 },
    { field: 'role', headerName: 'Role', width: 100 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 110,
      renderCell: (params) =>
        params.row.role !== 'admin' ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteHandler(params.row._id)}
          >
            Delete
          </Button>
        ) : null,
    },
  ];

  const deleteHandler = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully');
        window.location.reload();
      } catch (err) {
        toast.error(err?.data?.message || 'Error deleting user');
      }
    }
  };

  if (isLoading && !data) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || 'Error loading users'}
      </Message>
    );

  const rows = (data?.users || []).map((u) => ({
    _id: u._id,
    id: u._id, // DataGrid requires 'id'
    name: u.name,
    email: u.email,
    role: u.role,
  }));

  // Calculate total width of columns for tight fit
  const totalColumnWidth = columns.reduce(
    (sum, col) => sum + (col.width || 0),
    0,
  );

  return (
    <Container className="py-5 d-flex flex-column align-items-center justify-content-center">
      <h1 className="px-5 mb-4">Manage Users</h1>

      {rows.length === 0 ? (
        <Message variant="info">No users found.</Message>
      ) : (
        <div
          style={{
            width: 'fit-content', // Fit to column content
            minWidth: totalColumnWidth,
            maxHeight: '600px',
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            paginationMode="server"
            rowCount={data?.totalUsers || 0}
            loading={isLoading}
            paginationModel={paginationModel}
            onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
            pageSizeOptions={[5, 10, 25]}
            components={{ Toolbar: GridToolbar }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'desc' }],
              },
            }}
          />
        </div>
      )}
    </Container>
  );
};

export default AdminUsersScreen;
