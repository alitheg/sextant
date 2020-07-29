// Link.react.test.js
import React from 'react';
import HomePage from '..';
import {
  BrowserRouter as Router
} from "react-router-dom";
import renderer from 'react-test-renderer';
import {cleanup, render} from '@testing-library/react';

afterEach(cleanup);

describe('Home Page', () => {
  test('Matches snapshots', () => {
    let component = renderer.create(
      <Router>
        <HomePage loggedIn={false} />
      </Router>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component = renderer.create(
      <Router>
        <HomePage loggedIn={true} />
      </Router>
    );

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
  test('When logged out, allows the user to log in', () => {
    const { getByText } = render(
      <Router>
        <HomePage loggedIn={false} />
      </Router>
    );

    expect(getByText(/Login/i).closest('a')).toBeTruthy()
  })
})
