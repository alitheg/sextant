import React from "react";
import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Redirect } from "react-router-dom";
import Cookies from 'js-cookie';

import { usePostHandler } from '../../api'

export default ({ loggedIn, setLoggedIn }) => {

  const [username, setUsername] = useState('')
  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }
  const [password, setPassword] = useState('')
  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const {data, isLoading, hasError, handleRequest} = usePostHandler({});

  const login = () => {
    handleRequest(`/api/login`, {username, password})
  }

  useEffect(() => {
    if(data && data.username && !hasError) {
      setLoggedIn(Cookies.get('_radiusManagementSessionToken'))
      //setRedirect(true)
    }
  }, [data, hasError, setLoggedIn])

  return (
    <>
      { ((loggedIn) &&
        <Redirect to="/" />) ||
        <Container>
          <h1>Log In</h1>
          <Form>
            <Form.Group controlId="userUpdate.Username">
              <Form.Label>Username</Form.Label>
              <Form.Control required type="string" placeholder="Username" value={username} onChange={event => onChangeUsername(event)} />
            </Form.Group>
            <Form.Group controlId="userUpdate.Password">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="Password" value={password} onChange={event => onChangePassword(event)} />
            </Form.Group>
            <Button disabled={isLoading} onClick={login} variant="info">{ isLoading? "Loading" : "Login"}</Button>
          </Form>
          {(data && hasError) && "Error"}
        </Container>
      }
    </>
  )
}
