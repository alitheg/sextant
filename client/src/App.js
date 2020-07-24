import React from "react";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route, Redirect
} from "react-router-dom";

import Button from 'react-bootstrap/Button';
import { LinkContainer } from "react-router-bootstrap";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Cookies from 'js-cookie';
import JWT from 'jsonwebtoken';
import Dropdown from 'react-bootstrap/Dropdown';

import Login from './pages/login'
import Home from './pages/home'
import PasswordReset from './pages/password-reset'
import CreateUser from './pages/new-user'

import './App.css';
import './index.css';

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.



export default () => {
  const [loggedIn, setLoggedIn] = useState(Cookies.get('_radiusManagementSessionToken'))
  const [user, setUser] = useState({})
  const [redirect, setRedirect] = useState(false)
  useEffect(() => {
    if(!loggedIn) {
      Cookies.remove('_radiusManagementSessionToken')
      setRedirect(true)
    } else {
      setUser(JWT.decode(loggedIn))
    }
  }, [loggedIn])

  return (
    <Router>
    { redirect &&
        <Redirect to="/" />
    }
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Sextant</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer exact to="/">
              <Nav.Link><Nav.Item>Home</Nav.Item></Nav.Link>
            </LinkContainer>{' '}
            <LinkContainer exact to="/reset">
              <Nav.Link><Nav.Item>Password Reset</Nav.Item></Nav.Link>
            </LinkContainer>{' '}
            {
              loggedIn &&
              <LinkContainer exact to="/create">
                <Nav.Link><Nav.Item>Create user</Nav.Item></Nav.Link>
              </LinkContainer>
            } {' '}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          { (
              loggedIn &&
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle variant="outline-info" as={Nav.Text}>Signed in as: { user.username }</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setLoggedIn(false)}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) ||
            <LinkContainer to="/login">
              <Button variant="info">Login</Button>
            </LinkContainer>
          }
        </Navbar.Collapse>
        </Navbar>

      <Container fluid>
          <Switch>
            <Route exact path="/">
              <Home loggedIn={ loggedIn }/>
            </Route>
            <Route exact path="/login">
              <Login loggedIn={ loggedIn } setLoggedIn={ setLoggedIn }/>
            </Route>
            <Route exact path="/reset">
              <PasswordReset loggedIn={ loggedIn }/>
            </Route>
            <Route exact path="/create">
              <CreateUser loggedIn={ loggedIn }/>
            </Route>
          </Switch>
        </Container>
    </>
    </Router>
  );
}
