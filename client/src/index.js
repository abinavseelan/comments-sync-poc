/* global document */

import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  constructor(args) {
    super(args);
  }

  render() {
    return (
      <h1>hey</h1>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-container');
  render(<App />, container);
});
