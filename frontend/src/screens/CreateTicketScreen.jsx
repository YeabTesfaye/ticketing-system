import { useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateTicketMutation } from '../slices/ticketApiSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const CreateTicketScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      if (!title.trim() || !description.trim()) {
        toast.error('Both Title and Description are required.');
        return;
      }

      try {
        await createTicket({ title, description, status: 'open' }).unwrap();
        toast.success('Ticket created successfully');
        navigate('/'); // Redirect to ticket list
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error?.error ||
            'An unexpected error occurred',
        );
      }
    },
    [title, description, createTicket, navigate],
  );

  return (
    <FormContainer>
      <h1 className="text-center">Create Ticket</h1>
      <Form onSubmit={submitHandler}>
        {/* Ticket Title */}
        <Form.Group className="my-3" controlId="title">
          <Form.Label>Ticket Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Ticket Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        {/* Ticket Description */}
        <Form.Group className="my-3" controlId="description">
          <Form.Label>Ticket Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Ticket Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'none' }}
          />
        </Form.Group>

        {isLoading && <Loader />}

        {/* Submit Button */}
        <Button
          variant="primary"
          type="submit"
          className="d-block mx-auto mt-3"
        >
          Create Ticket
        </Button>
      </Form>
    </FormContainer>
  );
};

export default CreateTicketScreen;
