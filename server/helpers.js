const { applyPatch } = require('diff');

const { Draft } = require('./models/draft');
const { Comment } = require('./models/comment');

module.exports = {
  createNewDraft(user, post, patch) {
    return new Promise((resolve, reject) => {
      const entry = {
        user,
        post,
        draft: applyPatch('', patch),
        updated_at: new Date(),
      };

      Draft
        .create(entry, (err, newDraft) => {
          if (err) {
            return reject(err);
          }

          return resolve(newDraft);
        });
    });
  },
  updateDraft(oldDraft, patch) {
    return new Promise((resolve, reject) => {
      // tried Object.assign(). Some weird stuff happened. Manually copying for now
      const updatedDraft = {
        _id: oldDraft._id,
        user: oldDraft.user,
        post: oldDraft.post,
        draft: applyPatch(oldDraft.draft, patch),
        updated_at: new Date(),
      };

      Draft
        .update({ _id: oldDraft._id }, updatedDraft, (err, updated) => {
          if (err) {
            return reject(err);
          }
          return resolve(updated);
        });
    });
  },
  fetchDraft(user, post) {
    return new Promise((resolve, reject) => {
      Draft
        .findOne({ user, post }, (err, oldDraft) => {
          if (err) {
            return reject(err);
          }

          if (oldDraft) {
            return resolve(oldDraft);
          }
          return resolve('noop');
        });
    });
  },
  saveComment(user, post, comment) {
    return new Promise((resolve, reject) => {
      const entry = {
        user,
        post,
        comment,
        created_at: new Date(),
      };

      Comment
        .create(entry, (err, newComment) => {
          if (err) {
            return reject(err);
          }

          return resolve(newComment);
        });
    });
  },
  deleteDraft(user, post) {
    return new Promise((resolve, reject) => {
      Draft
        .remove({ user, post }, (err, draft) => {
          if (err) {
            return reject(err);
          }

          return resolve(draft);
        });
    });
  },
};
