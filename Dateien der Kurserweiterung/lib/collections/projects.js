import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Index } from 'meteor/easy:search';
import { ElasticSearchEngine } from 'meteor/easysearch:elasticsearch';
import SimpleSchema from 'simpl-schema';
import lodash from 'lodash';
import { Courses } from '/lib/collections/courses.js';
import { projectSchema } from './schemas.js';

export const Projects = new Mongo.Collection('projects');

Projects.memberFields = {
  _id: 1,
  createdAt: 1,
  isNewProject: 1,
  permissions: 1,
  title: 1,
  subtitle: 1,
  description: 1,
  coverImg: 1,
  media: 1,
  deadline: 1,
  beginning: 1,
  courseId: 1, //***************Coursefeature****************
  pdfs: 1,
  notes: 1,
  tags: 1,
  team: 1,
  supervisors: 1,
  jobs: 1,
  contacts: 1,
  teamCommunication: 1,
  occasions: 1,
};


if (Meteor.isServer) {
  Meteor.publish('projects.all.list', function projectsAllListPublication() {
    return Projects.find({}, {
      fields: {
        _id: 1,
        createdAt: 1,
        courseId: 1,
      },
    });
  });

  Meteor.publish('projects.user.grading', function projectsUserGradingPublication(courseId) {
    new SimpleSchema({
      courseId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    }).validate({ courseId });
    if (!this.userId) {
      return this.ready();
    }
    return Projects.find({ courseId: courseId, team: { $elemMatch: { userId: this.userId } } }, {
      fields: {
        team: 1,
      }
    });
  });

  Meteor.publish('courseProjects', function courseProjectsPublication(courseId) {
    const course = Courses.findOne(courseId);
    const ownersAsSupervisors = [];
    course && lodash.forEach(course.owner, function(ownerId) {
      const owner = Meteor.users.findOne(ownerId);
      ownersAsSupervisors.push({ userId: owner._id, role: owner.profile.title });
    });
    if (lodash.includes(course.owner, this.userId)){
      return Projects.find({
        courseId: courseId,
        supervisors: { $in: ownersAsSupervisors },
      }, { sort: { createdAt: -1 } }, { fields: Projects.memberFields });
    }
    else if (lodash.includes(course.member, this.userId)){
      return Projects.find({
        courseId: courseId,
        supervisors: { $in: ownersAsSupervisors },
      }, { sort: { createdAt: -1 } }, { fields: Projects.memberFieldsNoGrading });
    }
  });
}



Projects.attachSchema(new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset(); // Prevent user manipulation
    },
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true, // Prevent setting on insert
    optional: true,
  },
}).extend(projectSchema));

// Projects.plugin(mongoosastic);
Projects.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
