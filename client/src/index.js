/* global document */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { debounce } from 'throttle-debounce';
import { createPatch, applyPatch } from 'diff';

import styles from './index.scss';

class App extends Component {
  constructor(args) {
    super(args);

    this.state = {
      currentText: '',
      lastSyncedText: '',
    };

    this.syncServer = debounce(500, this.syncServer.bind(this));
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  syncServer() {
    const { lastSyncedText, currentText } = this.state;
    const patch = createPatch('tmp', lastSyncedText, currentText, 'tmp', 'tmp');

    this.setState({
      lastSyncedText: applyPatch(lastSyncedText, patch),
    });
  }

  handleInput(event) {
    const text = event.target.value;
    this.setState({ currentText: text }, () => {
      this.syncServer();
    });
  }

  handleSubmit() {
    console.log(this.state.currentText);
  }

  render() {
    return (
      <div className={styles.container}>
        <textarea
          className={styles['comments-container']}
          placeholder="Write your response..."
          onChange={this.handleInput}
        />
        <div className={styles.cta}>
          <button className={styles['post-btn']} onClick={this.handleSubmit}>
            Post Comment
          </button>
        </div>
      </div>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app-container');
  render(<App />, container);
});
