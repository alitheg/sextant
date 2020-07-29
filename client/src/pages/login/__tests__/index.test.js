// Link.react.test.js
import React from 'react';
import LoginPage from '..';
import {
  BrowserRouter as Router
} from "react-router-dom";
import renderer from 'react-test-renderer';
import {cleanup, render, fireEvent} from '@testing-library/react';
import faker from 'faker'

const api = require('../../../api');

var mockPostHandler = {};
// const getMockPostHandler = () => mockPostHandler
jest.mock('../../../api', () => ({
  usePostHandler: jest.fn().mockImplementation(() => {
    return mockPostHandler
  })
}));

afterEach(cleanup);

describe('Login Page', () => {
  test('Matches snapshots', () => {
    let component = renderer.create(
      <Router>
        <LoginPage loggedIn={false} />
      </Router>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
      <Router>
        <LoginPage loggedIn={true} />
      </Router>
    );

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
  test('When not logged in, renders form', () => {
    const { getByLabelText } = render(
      <Router>
        <LoginPage loggedIn={false} />
      </Router>
    );

    expect(getByLabelText(/Username/i)).toBeTruthy()
    expect(getByLabelText(/Password/i)).toBeTruthy()
  })
  test('When logged in, renders redirect', () => {
    const { queryByLabelText } = render(
      <Router>
        <LoginPage loggedIn={true} />
      </Router>
    );

    expect(queryByLabelText(/Username/i)).toBeNull()
    expect(queryByLabelText(/Password/i)).toBeNull()
  })
  test('Data sets loggedIn', () => {
    const setLoggedIn = jest.fn()
    mockPostHandler = {data: {username: faker.internet.userName() }, handleRequest: jest.fn()}
    render(
      <Router>
        <LoginPage loggedIn={false} setLoggedIn={setLoggedIn} />
      </Router>
    );

    expect(setLoggedIn).toHaveBeenCalledTimes(1)
  })
  test('Login button calls login', () => {
    const login = jest.fn()
    const username = faker.internet.userName();
    const password = faker.internet.password();
    mockPostHandler = {data: {}, handleRequest: login}
    const { getByLabelText, getByText } = render(
      <Router>
        <LoginPage loggedIn={false} />
      </Router>
    );

    const usernameField = getByLabelText(/Username/i).closest('input');
    usernameField.value = username;
    fireEvent.change(usernameField, {target: {value: username}})
    const passwordField = getByLabelText(/Password/i).closest('input');
    passwordField.value = password;
    fireEvent.change(passwordField, {target: {value: password}})
    getByText(/Login/i).closest('button').click()

    expect(login).toHaveBeenCalledTimes(1)
    // expect(login).toHaveBeenCalledWith('/api/login', {username, password}) // TODO: onChange events aren't firing
  })
})
