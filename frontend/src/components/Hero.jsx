import { Container, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth)

  return (
    <div className="py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-light w-75">
          <h1 className="text-center mb-4">Track and Manage Your Tickets</h1>
          <p className="text-center mb-4">
            Welcome to the ultimate ticket tracking system. Submit, track, and
            manage support tickets efficiently. Get real-time updates and
            resolve issues faster.
          </p>

          {userInfo ? (
            // If the user is logged in, show their tickets and create new ticket button
            <>
              <div className="d-flex mb-4">
                <Button
                  variant="primary"
                  as={Link}
                  to="/tickets"
                  className="me-3"
                >
                  View My Tickets
                </Button>
                <Button
                  variant="secondary"
                  as={Link}
                  to="/ticket"
                  className="me-3"
                >
                  Create New Ticket
                </Button>
              </div>
            </>
          ) : (
            // If the user is not logged in, show the Sign In and Register buttons
            <div className="d-flex">
              <Button variant="primary" href="/login" className="me-3">
                Sign In
              </Button>
              <Button variant="secondary" href="/register" className="me-3">
                Register
              </Button>
            </div>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
