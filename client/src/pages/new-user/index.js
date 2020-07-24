import React from "react";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

import { usePostHandler } from '../../api'

export default ({loggedIn}) => {

  const [username, setUsername] = useState('')
  const onChangeUsername = (e) => {
    setUsername(e.target.value)
  }
  const [password, setPassword] = useState('')
  const onChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const {data: result, isLoading, hasError, handleRequest: updateUser} = usePostHandler();

  const updateData = (e) => {
    updateUser(`/api/admin_create`, {username, password})
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Container fluid>
      <div>
        <h2>New user</h2>
        <Form onSubmit={updateData}>
          <Form.Group controlId="userUpdate.Username">
            <Form.Label>Username</Form.Label>
            <Form.Control required type="string" placeholder="Username" value={username} onChange={onChangeUsername} />
          </Form.Group>
          <Form.Group controlId="userUpdate.Password">
            <Form.Label>Password</Form.Label>
            <Form.Control pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{6,}" required type="password" placeholder="Password" value={password} onChange={onChangePassword} />
          </Form.Group>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Loading" : "Create"}</Button>
        </Form>
      </div>
      {(!hasError && result) || "Error"}
    </Container>
  );
}
