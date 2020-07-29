// Link.react.test.js
import React from 'react';
import NewUserPage from '..';
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

describe('New User Page', () => {
  test('Matches snapshots', () => {
    let component = renderer.create(
      <Router>
        <NewUserPage loggedIn={false} />
      </Router>
    ); // TODO: update form to redirect to home page

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
      <Router>
        <NewUserPage loggedIn={true} />
      </Router>
    );

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
  // test('Create button calls API', () => {
  //   const updateData = jest.fn()
  //   const username = faker.internet.userName();
  //   const password = faker.internet.password();
  //   mockPostHandler = {data: {}, handleRequest: updateData}
  //   const { getByLabelText, getByText } = render(
  //     <Router>
  //       <NewUserPage />
  //     </Router>
  //   );
  //
  //   const usernameField = getByLabelText(/Username/i).closest('input');
  //   usernameField.value = username;
  //   fireEvent.change(usernameField, {target: {value: username}})
  //   const passwordField = getByLabelText(/Password/i).closest('input');
  //   passwordField.value = password;
  //   fireEvent.change(passwordField, {target: {value: password}})
  //   getByText(/Create/i).closest('button').click()
  //
  //   expect(updateData).toHaveBeenCalledTimes(1)
  //   // expect(login).toHaveBeenCalledWith('/api/login', {username, password}) // TODO: onChange events aren't firing
  // })
})
