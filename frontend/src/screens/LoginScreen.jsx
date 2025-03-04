// LoginScreen.jsx

import { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/autSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { loginSchema } from '../utils/validator';
import { z } from 'zod';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); // State to store validation errors

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const { user, token } = useSelector((state) => state.auth); // Updated state

  useEffect(() => {
    if (user && token) {
      navigate('/'); // Redirect after login
    }
  }, [user, token, navigate]); // Navigate only when both exist

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate form data with Zod
    try {
      loginSchema.parse({ email, password }); // Validate email and password

      // If validation passes, perform login
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials(res)); // Dispatch user & token separately
        navigate('/'); // Redirect after successful login
      } catch (err) {
        toast.error(
          err?.data?.message || err?.error || 'Invalid email or password',
        );
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // If validation fails, set the errors
        const validationErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(validationErrors); // Update state with errors
      }
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isInvalid={!!errors.email} // Show error if validation fails
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={!!errors.password} // Show error if validation fails
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
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
