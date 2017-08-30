import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import lodash from 'lodash';

import { projectSchema } from './schemas.js';

export const Drafts = new Mongo.Collection('drafts');

if (Meteor.isServer) {
  Meteor.publishComposite('singleUserCourseDraft', function userCourseDraftsPublication(courseId) {
    new SimpleSchema({
      courseId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    }).validate({ courseId });

    return {
      find() {
        return Meteor.users.find(this.userId);
      },
      children: [{
        find(user) {
          const userDraftId = user && lodash.find(user.profile.drafts, function(draft) {
            return draft.courseId == courseId;
          });
          if(userDraftId) {
            return Drafts.find(userDraftId.draftId);
          } else {
            return this.ready();
          }
        },
      }],
    };
  });
}

Drafts.attachSchema(new SimpleSchema({
  isNewProject: {
    type: Boolean,
    autoValue() {
      if (this.isInsert) {
        return true;
      }
    },
  },
  'permissions.editInfos': {
    type: Array,
    autoValue () {
      if (this.isInsert) {
        return [this.userId];
      }
    },
  },
  'permissions.manageMembers': {
    type: Array,
    autoValue () {
      if (this.isInsert) {
        return [this.userId];
      }
    },
  },
  'permissions.manageCourses': {
    type: Array,
    autoValue () {
      if (this.isInsert) {
        return [this.userId];
      }
    },
  },
  'permissions.deleteProject': {
    type: Array,
    autoValue () {
      if (this.isInsert) {
        return [this.userId];
      }
    },
  },
  title: {
    type: String,
    autoValue() {
      if (this.isInsert) {
        return 'Unbenanntes Projekt';
      }
    },
  },
  team: {
    type: Array,
  },
}).extend(projectSchema));
