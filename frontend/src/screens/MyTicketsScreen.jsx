import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useGetTicketsQuery } from '@/slices/ticketApiSlice';
import Loader from '@/components/Loader';
import Message from '@/components/Message';
import { useNavigate, Link } from 'react-router-dom';
import { formatId } from '@/utils';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const MyTicketsScreen = () => {
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const queryParams = {
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  };

  const { data, isLoading, error } = useGetTicketsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      valueGetter: (value, row) => formatId(row._id),
    },
    { field: 'title', headerName: 'Title', width: 180 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Action',
      width: 130,
      renderCell: (params) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/ticket/${params.row?._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (isLoading && !data) return <Loader />;
  if (error) return <Message variant="danger">Error loading tickets!</Message>;

  const rows = (data?.tickets || []).map((ticket) => ({
    _id: ticket._id,
    id: ticket._id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
  }));

  // Calculate total width of columns (optional for explicit width)
  const totalColumnWidth = columns.reduce(
    (sum, col) => sum + (col.width || 0),
    0,
  );

  return (
    <Container className="py-5 d-flex flex-column align-items-center justify-content-center">
      <h1 className="text-center mb-4">My Tickets</h1>

      {rows.length === 0 ? (
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
        <div
          style={{
            width: 'fit-content',
            minWidth: totalColumnWidth,
            maxHeight: '500px',
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            paginationMode="server"
            rowCount={data?.totalTickets || 0}
            loading={isLoading}
            paginationModel={paginationModel}
            onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
            pageSizeOptions={[5, 10, 25]}
            components={{ Toolbar: GridToolbar }}
            disableColumnMenu
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

export default MyTicketsScreen;
