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
  const [currentPassword, setCurrentPassword] = useState('')
  const onChangeCurrentPassword = (e) => {
    setCurrentPassword(e.target.value)
  }

  const {data: result, isLoading, hasError: error, handleRequest: updateUser} = usePostHandler();

  const updateData = (e) => {
    updateUser(loggedIn ? `/api/admin_update` : `/api/update`, {username, password, currentPassword})
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Container fluid>
      <div>
        <h2>Update user password</h2>
        <Form onSubmit={updateData}>
          <Form.Group controlId="userUpdate.Username">
            <Form.Label>Username</Form.Label>
            <Form.Control required type="string" placeholder="Username" value={username} onChange={onChangeUsername} />
          </Form.Group>
          { !loggedIn &&
            <Form.Group controlId="userUpdate.CurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control required type="password" placeholder="Current Password" value={currentPassword} onChange={onChangeCurrentPassword} />
            </Form.Group>
          }
          <Form.Group controlId="userUpdate.Password">
            <Form.Label>Password</Form.Label>
            <Form.Control pattern="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])\S{6,}" required type="password" placeholder="Password" value={password} onChange={onChangePassword} />
          </Form.Group>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Loading" : "Update"}</Button>
        </Form>
      </div>
      {(!error && result) || "Error" + result}
    </Container>
  );
}
