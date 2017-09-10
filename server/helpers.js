const { applyPatch } = require('diff');

const { Draft } = require('./models/draft');
const { Comment } = require('./models/comment');

module.exports = {
  createNewDraft(userID, postID, patch) {
    return new Promise((resolve, reject) => {
      const entry = {
        userID,
        postID,
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

      console.log({ oldDraft });
      console.log({ updatedDraft });

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
  saveComment() {

  },
};
