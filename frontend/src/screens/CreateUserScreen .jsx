import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const CreateUserScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [createUser, { isLoading, error: apiError }] = useCreateUserMutation();

  const { user } = useSelector((state) => state.auth);

  if (user?.role !== 'admin') {
    navigate('/');
  }

  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password || !role) {
      setError('All fields are required');
      return;
    }

    setError(null); // Clear any previous errors

    try {
      await createUser({ name, email, password, role }).unwrap();
      toast.success('User created successfully');
      navigate('/admin/users'); // Redirect to the user list page after creating a user
    } catch {
      // Handle API errors (e.g., user already exists, invalid data)
      toast.error(apiError?.data?.message || 'Error creating user');
    }
  };

  return (
    <FormContainer>
      <h1>Create User</h1>

      {/* Show any form-level error */}
      {error && <div className="alert alert-danger">{error}</div>}

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Control>
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
