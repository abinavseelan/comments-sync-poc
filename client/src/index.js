/* global document */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { debounce } from 'throttle-debounce';
import { createPatch, applyPatch } from 'diff';
import Request from 'axios';

import styles from './index.scss';

class App extends Component {
  constructor(args) {
    super(args);

    this.state = {
      currentText: '',
      lastSyncedText: '',
      postID: 1, // hardcoded for now.
      userID: 'abinavseelan', // hardcoded for now
      error: '',
    };

    this.syncServer = debounce(500, this.syncServer.bind(this));
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    Request
      .get(`/api/comments/drafts?post_id=${this.state.postID}&user_id=${this.state.userID}`)
      .then((result) => {
        if (result.data.draft) {
          this.setState({
            lastSyncedText: result.data.draft,
            currentText: result.data.draft,
          });
        }
      });
  }

  syncServer() {
    const { lastSyncedText, currentText, postID, error, userID } = this.state;
    const patch = createPatch('tmp', lastSyncedText, currentText, 'tmp', 'tmp');

    if (error) {
      return;
    }

    Request
      .put('/api/comments/drafts', {
        patch,
        userID,
        postID,
      })
      .then(() => {
        this.setState({
          lastSyncedText: applyPatch(lastSyncedText, patch),
        });
      })
      .catch(() => {
        this.setState({
          error: 'Oops. Something went wrong while syncing your work. Please refresh the page',
        });
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
          value={this.state.currentText}
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
