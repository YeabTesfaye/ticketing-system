import { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/autSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../utils/validator';

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth); // Updated state
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (user && token) {
      navigate('/'); // Redirect after login
    }
  }, [user, token, navigate]); // Navigate only when both exist

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema), // Integrating Zod for validation
  });

  const submitHandler = async (data) => {
    try {
      const { email, password } = data;

      // If validation passes, perform login
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res)); // Dispatch user & token separately
      navigate('/'); // Redirect after successful login
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || 'Invalid email or password',
      );
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            {...register('email')} // Register input with react-hook-form
            isInvalid={!!errors.email} // Show error if validation fails
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            {...register('password')} // Register input with react-hook-form
            isInvalid={!!errors.password} // Show error if validation fails
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </Form.Group>

        {isLoading && <Loader />}

        <Button
          variant="primary"
          type="submit"
          className="mt-3"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <Row className="py-3">
          <Col>
            New Customer? <Link to={'/register'}>Register</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
