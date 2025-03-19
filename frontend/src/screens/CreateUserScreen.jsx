import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { createUserSchema } from '../utils/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const CreateUserScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.role !== 'admin') {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  // Submit handler
  const submitHandler = async (data) => {
    try {
      const response = await createUser(data);
      if (response.error) {
        throw response.error;
      }
      toast.success('User created successfully');
      navigate('/admin/users');
      reset();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error?.data?.message || 'Error creating user');
      reset();
    }
  };

  return (
    <FormContainer>
      <h1>Create User</h1>

      <Form
        onSubmit={(e) => {
          handleSubmit(submitHandler)(e);
        }}
      >
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            {...register('name')}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </Form.Group>

        <Form.Group className="my-2" controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Control as="select" {...register('role')}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Control>
          {errors.role && <p className="text-danger">{errors.role.message}</p>}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-3"
          disabled={isLoading}
        >
          {isLoading ? 'Creating user...' : 'Create User'}
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default CreateUserScreen;
