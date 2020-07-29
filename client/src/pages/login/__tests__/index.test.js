// Link.react.test.js
import React from 'react';
import LoginPage from '..';
import {
  BrowserRouter as Router
} from "react-router-dom";
import renderer from 'react-test-renderer';
import {cleanup, render} from '@testing-library/react';

afterEach(cleanup);

describe('Login Page', () => {
  test('Matches snapshots', () => {
    let component = renderer.create(
      <Router>
        <LoginPage loggedIn={false} />,
      </Router>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
      <Router>
        <LoginPage loggedIn={true} />,
      </Router>
    );

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
  test('When not logged in, renders form', () => {
    const { getByLabelText } = render(
      <Router>
        <LoginPage loggedIn={false} />,
      </Router>
    );

    expect(getByLabelText(/Username/i)).toBeTruthy()
    expect(getByLabelText(/Password/i)).toBeTruthy()
  })
  test('When logged in, renders redirect', () => {
    const { queryByLabelText } = render(
      <Router>
        <LoginPage loggedIn={true} />,
      </Router>
    );

    expect(queryByLabelText(/Username/i)).toBeNull()
    expect(queryByLabelText(/Password/i)).toBeNull()
  })
})
