import SimpleSchema from 'simpl-schema';

export const projectSchema = new SimpleSchema({
  // owner: Object,
  // "owner.userId": {
  //   type: String,
  //   regEx: SimpleSchema.RegEx.Id,
  // },
  // // "owner.wholeName": {
  // //   type: String,
  // // },
  // ownerRole: {
  //   type: String,
  //   optional: true,
  // },
  permissions: Object,
  'permissions.editInfos': Array,
  'permissions.editInfos.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'permissions.manageMembers': Array,
  'permissions.manageMembers.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  //***************Beginn Coursefeature****************
  'permissions.manageCourses': Array,
  'permissions.manageCourses.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  //***************End Coursefeature****************
  'permissions.deleteProject': Array,
  'permissions.deleteProject.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  //***************Beginn Coursefeature****************
  courseId: {
    type: String,
    optional: true,
  },
  //***************End Coursefeature****************
  title: {
    type: String,
    max: 40,
  },
  subtitle: {
    type: String,
    optional: true,
    max: 200,
  },
  coverImg: {
    type: String,
    optional: true,
    max: 200,
  },
  media: {
    type: Array,
    optional: true,
    blackbox: true,
    minCount: 0,
    maxCount: 5,
  },
  'media.$': Object,
  'media.$.type': String,
  'media.$.id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  description: {
    type: String,
    max: 500,
    optional: true,
  },
  notes: {
    type: String,
    max: 500,
    optional: true,
  },
  deadline: {
    type: Date,
    optional: true,
  },
  beginning: {
    type: Date,
    optional: true,
  },
  tags: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 10,
  },
  'tags.$': String,
  pdfs: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 10,
  },
  'pdfs.$': String,
  team: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 20,
  },
  'team.$': Object,
  'team.$.userId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'team.$': Object,
  'team.$.grading': {
    type: String,
    optional: true,
  },
  // "team.$.userName": {
  //   type: String,
  //   optional: true,
  //
  // },
  'team.$': Object,
  'team.$.role': {
    type: String,
    optional: true,
  },
  'team.$.permissions': Object,
  'team.$.permissions.editInfos': Boolean,
  'team.$.permissions.manageMembers': Boolean,
  //***************Beginn Coursefeature****************
  'team.$.permissions.manageCourses': Boolean,
  //***************End Coursefeature****************
  'team.$.permissions.deleteProject': Boolean,
  teamCommunication: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 10,
  },
  'teamCommunication.$': Object,
  'teamCommunication.$.medium': String,
  'teamCommunication.$.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  'teamCommunication.$.isPrivate': Boolean,
  jobs: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 10,
  },
  'jobs.$': Object,
  'jobs.$.joblabel': String,
  contacts: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 10,
  },
  'contacts.$': Object,
  'contacts.$.medium': String,
  'contacts.$.approach': String,
  occasions: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 10,
  },
  'occasions.$': String,
  supervisors: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 10,
  },
  'supervisors.$': Object,
  'supervisors.$.userId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'supervisors.$.role': {
    type: String,
    optional: true,
  }
});

export const studiesSchema = new SimpleSchema({
  studyCourseId: SimpleSchema.Integer,
  studyCourseName: String,
  degreeId: SimpleSchema.Integer,
  degreeName: String,
  examRegulationsId: SimpleSchema.Integer,
  departmentId: SimpleSchema.Integer,
  departmentName: String,
  facultyId: SimpleSchema.Integer,
  facultyName: String,
});

export const memberSchema = new SimpleSchema({
  docId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  member: Object,
  'member.userId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  'member.role': {
    type: String,
    optional: true,
  },
  'member.permissions': Object,
  'member.permissions.editInfos': Boolean,
  'member.permissions.manageMembers': Boolean,
  //***************Beginn Coursefeature****************
  'member.permissions.manageCourses': Boolean,
  //***************End Coursefeature****************
  'member.permissions.deleteProject': Boolean,
}, { tracker: Tracker });

export const gradingSchema = new SimpleSchema({
  docId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  member: {
    type: Array,
    optional: true,
    minCount: 0,
    maxCount: 20,
  },
  'member.$': Object,
  'member.$.grading': {
    type: String,
    optional: true,
  },
}, { tracker: Tracker });

export const courseOwnerSchema = new SimpleSchema({
  docId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
}, { tracker: Tracker });

export const jobSchema = new SimpleSchema({
  docId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  job: Object,
  'job.joblabel': String,
}, { tracker: Tracker });

export const addCourseSchema = new SimpleSchema({
  docId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  courseId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  inputKey: {
    type: String,
  },
}, { tracker: Tracker });

export const addCourseToCourseSchema = new SimpleSchema({
  courseId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  courseInput: {
    type: String,
  },
}, { tracker: Tracker });

export const courseSchema = new SimpleSchema({
  courseSemester: {
    type: String,
  },
  courseName: {
    type: String,
  },
  studyCourse: {
    type: String,
  },
  courseKey: {
    type: String,
  },
  deadline: {
    type: Date,
    optional: true,
  },
}, { tracker: Tracker });
