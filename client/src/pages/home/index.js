import React from "react";
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from "react-router-bootstrap";

export default ({ loggedIn }) => {
  return (
    <Jumbotron>
      <Container>
        <h1>Sextant Radius Management</h1>
        { !loggedIn &&
          <p>Please log in to continue
            <LinkContainer to="/login">
              <Button variant="info">Login</Button>
            </LinkContainer>
          </p>
        }
        { loggedIn  &&
          <p>
          Welcome
          </p>
        }
      </Container>
    </Jumbotron>
  )
}
