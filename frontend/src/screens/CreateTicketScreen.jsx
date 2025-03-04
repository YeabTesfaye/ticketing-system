import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateTicketMutation } from '../slices/ticketApiSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const CreateTicketScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Open'); // Default status set to 'Open'

  const navigate = useNavigate();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const ticketData = { title, description, status };
      await createTicket(ticketData).unwrap();
      toast.success('Ticket created successfully');
      navigate('/'); // Redirect to homepage or ticket list
    } catch (error) {
      toast.error(error?.data?.message || error?.error || 'An error occurred');
    }
  };

  return (
    <FormContainer>
      <h1>Create Ticket</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="title">
          <Form.Label>Ticket Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Ticket Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="description">
          <Form.Label>Ticket Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter Ticket Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ resize: 'none' }}
          />
        </Form.Group>

        <Form.Group className="my-2" controlId="status">
          <Form.Label>Ticket Status</Form.Label>
          <Form.Control
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </Form.Control>
        </Form.Group>

        {isLoading && <Loader />}

        <Button
          variant="primary"
          type="submit"
          className="mt-3 d-flex justify-content-center mx-auto"
        >
          Create Ticket
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreateTicketScreen;
