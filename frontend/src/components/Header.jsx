import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import {
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaUserPlus,
  FaUsers,
} from 'react-icons/fa'; // Import FaUsers for listing users
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || 'Logout failed');
    }
  };

  const { userInfo } = useSelector((state) => state.auth);
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Link to="/" className="navbar-brand">
            Ticketing System
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="username">
                    <NavDropdown.Item as={Link} to="/profile">
                      <FaUser className="me-1" /> Profile
                    </NavDropdown.Item>
                    {/* Only show the "List Users" button if the user is an admin */}
                    {userInfo.role === 'admin' && (
                      <NavDropdown.Item as={Link} to="/admin/users">
                        <FaUsers className="me-1" /> List Users
                      </NavDropdown.Item>
                    )}
                    {/* Only show the "Create User" link if the user is an admin */}
                    {userInfo.role === 'admin' && (
                      <NavDropdown.Item as={Link} to="/create">
                        <FaUserPlus className="me-1" /> Create User
                      </NavDropdown.Item>
                    )}
                    <NavDropdown.Item onClick={logoutHandler}>
                      <FaSignOutAlt className="me-1" /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">
                    <FaSignInAlt className="me-1" /> Sign In
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    <FaSignOutAlt className="me-1" /> Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
