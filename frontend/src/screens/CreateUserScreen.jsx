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

const CreateUserScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // If the user is not an admin, redirect
  if (userInfo?.role !== 'admin') {
    navigate('/');
  }

  const [createUser, { isLoading }] = useCreateUserMutation();

  // React Hook Form for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      console.log(data);
      await createUser(data).unwrap();
      toast.success('User created successfully');
      navigate('/admin/users');
      reset(); // Reset form after success
    } catch (error) {
      toast.error(error?.data?.message || 'Error creating user');
    }
  };

  return (
    <FormContainer>
      <h1>Create User</h1>

      <Form onSubmit={handleSubmit(onSubmit)}>
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

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
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
          type="submit"
          variant="primary"
          className="mt-3"
          disabled={isLoading}
        >
          Create User
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default CreateUserScreen;
