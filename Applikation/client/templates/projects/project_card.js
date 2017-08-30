import { Template } from 'meteor/templating';
import { Projects } from '/lib/collections/projects.js';
import { Images } from '/lib/collections/images.js';
import lodash from 'lodash';
import { gradingSchema } from '/lib/collections/schemas.js';
import { projectSchema } from '/lib/collections/schemas.js';
import { saveGrading } from '/lib/methods.js';
import toastr from 'toastr';
import {Courses} from '/lib/collections/courses.js';


import './project_card.html';

Template.projectCard.events({
  'click .front'(event, template) {
    $('.flipped').removeClass('flipped');
    $(event.currentTarget).parent().addClass('flipped');
  },
  'click .back'(event, template) {
    $(event.currentTarget).parent().removeClass('flipped');
  },
});

Template.projectCard.onCreated(function() {
  this.remainingMemberCount = new ReactiveVar(0);
  this.remainingJobsCount = new ReactiveVar(0);
  this.autorun(() => {
    this.subscribe('projects.cards.single', Template.currentData().projectId);
  });
});

Template.projectCard.helpers({
  projectCard() {
    if (this.checkIfCourse){
      var project = Projects.findOne(this.projectId);
      project.checkIfCourse = this.checkIfCourse;
      return project
    }
    else{
      return Projects.findOne(this.projectId);
    }
  },
  checkUser() {
    const course = Courses.findOne(this.courseId);
    if(course && lodash.includes(course.owner, Meteor.userId())){
      return true;
    }
  },
  getAvatarURL (userId, version) {
    const user = Meteor.users.findOne({ _id: userId });
    const image = user && (user.profile.avatar && Images.findOne(user.profile.avatar));
    return (image && image.versions[version]) ? image.link(version) : `/img/${version}.jpg`;
  },
  itemsToShow(totalItems, maxItems, placeholderItems) {
    return (totalItems <= maxItems) ? totalItems : maxItems - placeholderItems;
  },
  itemsRemaining(totalItems, maxItems, placeholderItems) {
    if (totalItems > maxItems) { return totalItems - (maxItems - placeholderItems); }
  },
});

Template.projectCardCover.onCreated(function projectCardCoverOnCreated() {
  if (Template.currentData().imgId) {
    this.autorun(() => {
      this.subscribe('files.images.single', Template.currentData().imgId);
    });
  }
});

Template.projectCardCover.helpers({
  randomColor() {
    const colorArray = [
      '#ef9a9a',
      '#F48FB1',
      '#CE93D8',
      '#B39DDB',
      '#9FA8DA',
      '#90CAF9',
      '#81D4FA',
      '#80DEEA',
      '#80CBC4',
      '#A5D6A7',
      '#C5E1A5',
      '#E6EE9C',
      '#FFF59D',
      '#FFE082',
      '#FFCC80',
      '#FFAB91',
      '#BCAAA4',
      '#EEEEEE',
      '#B0BEC5',
    ];
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    return color;
  },
});


Template.projectCardMemberItem.onCreated(function projectCardMemberItemOnCreated() {
  this.autorun(() => {
    if(Template.currentData().userId){
      this.subscribe('users.list.single', Template.currentData().userId);
      this.subscribe('files.images.avatar', Template.currentData().userId);
    }
  });
});

Template.projectCardMemberItem.helpers({
  user() {
    return Meteor.users.findOne(this.userId);
  },
  getAvatarURL (userId, version) {
    const user = Meteor.users.findOne(userId);
    const image = user && user.profile && Images.findOne(user.profile.avatar);
    return (image && image.versions[version]) ? image.link(version) : `/img/${version}.jpg`;
  },
});

Template.projectCardJobs.helpers({
  projects() {
    return Projects.find({}, { sort: { createdAt: -1 } });
  },
  itemsToShow(totalItems, maxItems, placeholderItems) {
    return (totalItems <= maxItems) ? totalItems : maxItems - placeholderItems;
  },
  itemsRemaining(totalItems, maxItems, placeholderItems) {
    if (totalItems > maxItems) { return totalItems - (maxItems - placeholderItems); }
  },
});

Template.projectCardMemberItem.onCreated(function projectCardMemberItemOnCreated() {
  this.autorun(() => {
    if(Template.currentData().userId){
      this.subscribe('users.list.single', Template.currentData().userId);
      this.subscribe('files.images.avatar', Template.currentData().userId);
    }
  });
});
