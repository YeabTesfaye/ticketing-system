import { useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateTicketMutation } from '../slices/ticketApiSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTicketSchema } from '../utils/validator';

const CreateTicketScreen = () => {
  const navigate = useNavigate();
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTicketSchema), 
  });

  const submitHandler = useCallback(
    async (data) => {
      try {
        await createTicket({
          title: data.title,
          description: data.description,
          status: 'open',
        }).unwrap();
        toast.success('Ticket created successfully');
        navigate('/'); 
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error?.error ||
            'An unexpected error occurred',
        );
      }
    },
    [createTicket, navigate],
  );

  return (
    <FormContainer>
      <h1 className="text-center">Create Ticket</h1>
      <Form onSubmit={handleSubmit(submitHandler)}>
        {/* Ticket Title */}
        <Form.Group className="my-3" controlId="title">
          <Form.Label>Ticket Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Ticket Title"
            {...register('title')} // Register input with react-hook-form
            isInvalid={!!errors.title} // Show error if validation fails
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title.message}</div>
          )}
        </Form.Group>

        {/* Ticket Description */}
        <Form.Group className="my-3" controlId="description">
          <Form.Label>Ticket Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Ticket Description"
            {...register('description')} // Register input with react-hook-form
            style={{ resize: 'none' }}
            isInvalid={!!errors.description} // Show error if validation fails
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}
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
