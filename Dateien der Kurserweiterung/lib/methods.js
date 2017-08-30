import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import lodash from 'lodash';
import toastr from 'toastr';
import { Images } from '/lib/collections/images.js';
import { XlsFiles } from '/lib/collections/xlsFiles.js';
import { Projects } from '/lib/collections/projects.js';
import { Courses } from '/lib/collections/courses.js';
import { Drafts } from '/lib/collections/drafts.js';
import { ProjectFiles } from '/lib/collections/projectFiles.js';
import { Studies } from '/lib/collections/studies.js';
import { Meteor } from 'meteor/meteor';
import { memberSchema } from '/lib/collections/schemas.js';
import { jobSchema } from '/lib/collections/schemas.js';
import { contactSchema } from '/lib/collections/schemas.js';
import { linkSchema } from '/lib/collections/schemas.js';
import { teamCommSchema } from '/lib/collections/schemas.js';
import { courseSchema } from '/lib/collections/schemas.js';
import { supervisorSchema } from '/lib/collections/schemas.js';
import { addCourseSchema } from '/lib/collections/schemas.js';
import { addCourseToCourseSchema } from '/lib/collections/schemas.js';
import { courseOwnerSchema } from '/lib/collections/schemas.js';
import { gradingSchema } from '/lib/collections/schemas.js';

//Validation Methoden, werden sowohl client- als auch serverseitig ausgeführt



//**********************************************
//Methode zum erstellen der Excel-Files
Meteor.methods({
  'excel'({ courseId, excel }) {
    new SimpleSchema({
      courseId: String,
      excel: String,
    }).validate({ courseId, excel });
    const course = Courses.findOne(courseId);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('No rights to download!!!');
    } else {
      //Konstante Variablen deklarieren
      const mongoXlsx = require('mongo-xlsx');
      const data = []; //Array zum Pushen der Objekte für den Inhalt der Exceltabelle
      const userId = Meteor.userId();
      const courseProjects = Projects.find({ courseId, supervisors: { $elemMatch: { userId: { $in: course.owner } } } });

      if(excel == "memberlist"){
        courseProjects.forEach(function(project) {
          lodash.forEach(project.team, function(teamMember) {
            const user = Meteor.users.findOne(teamMember.userId);
            if (user.profile.role == 'Student') {
              const studyCourse = Studies.findOne({
                studyCourseId: user.profile.studyCourseId,
                departmentId: user.profile.departmentId,
                facultyId: user.profile.facultyId,
              });
              let studiengang = '';
              if (studyCourse && studyCourse.studyCourseName) {
                studiengang = studyCourse.studyCourseName;
              }
              let fileLink = '';
              let fileDate = '';
              let newstFileLink = '';
              let newstFileDate = '';
              moment.locale('de');
              lodash.forEach(project.pdfs, function(pdfId) {
                var file = ProjectFiles.findOne(pdfId);
                if (project.deadline > file.meta.createdAt) {
                  fileLink = file.link();
                  fileDate = moment(file.meta.createdAt).format('dddd, Do MMMM YYYY, HH:mm:ss');
                } else {
                  const pdfId = project.pdfs[project.pdfs.length - 1];
                  var file = ProjectFiles.findOne(pdfId);
                  newstFileLink = file.link();
                  newstFileDate = moment(file.meta.createdAt).format('dddd, Do MMMM YYYY, HH:mm:ss');
                  return false;
                }
              });

              const projectObject = {
                Projektname: project.title,
                'Matr.Nr': user.profile.matricNo,
                Vorname: user.profile.firstname,
                Nachname: user.profile.lastname,
                Studiengang: studiengang,
                Notizen: project.notes,
                'Rechtzeitiger Upload': fileLink,
                '<- Datum': fileDate,
                'Letzter Upload': newstFileLink,
                '<-- Datum': newstFileDate,
              };
              data.push(projectObject);
            }
          });
        });
      }
      else if(excel == "helios"){
        data.push({
          A: "",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "",
          G: "",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "",
        });

        data.push({
          A: "startHISsheet",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "",
          G: "",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "endHISsheet",
        });

        data.push({
          A: "mtknr",
          B: "bewertung",
          C: "pdatum",
          D: "nachname",
          E: "vorname",
          F: "geschl",
          G: "pstatus",
          H: "pversuch",
          I: "stgsem",
          J: "abschl",
          K: "stgdtxt",
          L: "pbeginn",
        });

        courseProjects.forEach(function(project) {
          lodash.forEach(project.team, function(teamMember) {
            const user = Meteor.users.findOne(teamMember.userId);
            if (user.profile.role == 'Student') {
              const regex = /[.,\s]/g;
              var str = teamMember.grading;
              var result = str.replace(regex, '');
              if(lodash.includes(["1","2","3","4","5"], result)){
                var heliosGrading = (result*100).toString();
              }
              else if (result == 07){
                var heliosGrading = "070";
              } else {
                var heliosGrading = (result*10).toString();;
              }
              const projectObject = {
                A: user.profile.matricNo.toString(),
                B: heliosGrading,
                C: "",
                D: "",
                E: "",
                F: "",
                G: "",
                H: "",
                I: "",
                J: "",
                K: "",
                L: "",
              };
              data.push(projectObject);
            }
          });
        });
        data.push({
          A: "endHISsheet",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "",
          G: "",
          H: "",
          I: "",
          J: "",
          K: "",
          L: "",
        });
      }
      const model = mongoXlsx.buildDynamicModel(data);
      if (Meteor.isServer) {
        //erstellen der Exceldatei und hinzufügen auf den Server für den Download
        mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
          XlsFiles.addFile(data.fullPath, {
            name: data.fullPath,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            userId: courseId,
            meta: {},
          });
        });
      }
    }
  },
});

export const insertEmptyDraft = new ValidatedMethod({
  name: 'drafts.insertEmptyDraft',
  validate: new SimpleSchema({}).validator(),
  run() {
    if (!this.userId) {
      throw new Meteor.Error('drafts.insertNew.unauthorized',
        'Cannot insert new draft because you are not logged in');
    }
    if (Meteor.user().profile.role == 'Mitarbeiter') {
      return Drafts.insert({ supervisors: [{ userId: this.userId, role: Meteor.user().profile.title }] });
    }
    return Drafts.insert({
      team:[{
        userId: this.userId,
        role: 'Projektleitung',
        permissions: {
        editInfos: true,
        manageMembers: true,
        manageCourses: true,
        deleteProject: true,
        },
      }],
    });
  },
});

export const insertEmptyCourseDraft = new ValidatedMethod({
  name: 'drafts.insertEmptyCourseDraft',
  validate: new SimpleSchema({
    courseId: String,
  }).validator(),
  run({ courseId }) {
    const course = Courses.findOne(courseId);
    if (!lodash.includes(course.owner, this.userId) && !lodash.includes(course.member, this.userId)) {
      throw new Meteor.Error('drafts.insertEmptyCourseDraft.unauthorized',
        'You are not allowed to add course projects to this course');
    }
    const ownerArray = [];
    lodash.forEach(course.owner, function(ownerId) {
      const user = Meteor.users.findOne(ownerId);
      ownerArray.push({ userId: user._id, role: user.profile.title });
    });
    var draftId;
    if (lodash.includes(course.owner, this.userId)){
      draftId = Drafts.insert({
        courseId: courseId,
        supervisors: ownerArray,
        deadline: course.deadline
      });
    } else {
      draftId = Drafts.insert({
        courseId: courseId,
        team:[{
          userId: this.userId,
          role: 'Projektleitung',
          permissions: {
          editInfos: true,
          manageMembers: true,
          manageCourses: true,
          deleteProject: true,
          },
        }],
        supervisors: ownerArray,
        deadline: course.deadline
      });

    }
    updateEditPermissions.call({
      collectionName: 'drafts',
      docId: draftId,
    }, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
    return draftId;
  },
});

export const createMassProjects = new ValidatedMethod({
  name: 'createMassProjects',
  validate: new SimpleSchema({
    courseId: String,
    text: String,
  }).validator(),
  run({ courseId, text }) {
    const course = Courses.findOne(courseId);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('createMassProjects.unauthorized',
        'You are not allowed to add course projects to this course');
    }
    const ownerArray = [];
    const permissions = {
      editInfos: [],
      manageMembers: [],
      manageCourses: [],
      deleteProject: [],
    };
    lodash.forEach(course.owner, function(ownerId) {
      const user = Meteor.users.findOne(ownerId);
      ownerArray.push({ userId: ownerId, role: user.profile.title });
      lodash.forEach(permissions, function(permittedUserIds, permissionKey) {
        permissions[permissionKey].push(ownerId);
      });
    });
    const textArray = text.split('\n');
    lodash.forEach(textArray, function(text) {
      if (text) {
        const projectId = Projects.insert({
          title: text,
          courseId,
          supervisors: ownerArray,
          deadline: course.deadline,
          permissions,
        });
      }
    });
  },
});

export const publishDraft = new ValidatedMethod({
  name: 'projects.publishDraft',
  validate: new SimpleSchema({
    draftId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({ draftId }) {
    const draft = Drafts.findOne(draftId);
    if (!lodash.includes(draft.permissions.editInfos, this.userId)
    || !lodash.includes(draft.permissions.manageMembers, this.userId)
    || !lodash.includes(draft.permissions.manageCourses, this.userId)
    || !lodash.includes(draft.permissions.deleteProject, this.userId)) {
      throw new Meteor.Error('projects.publishDraft.unauthorized',
        'Cannot publish draft that is not yours');
    }
    return Projects.insert(draft);
  },
});

export const deleteAllProjects = new ValidatedMethod({
  name: 'deleteAllProjects',
  validate: new SimpleSchema({
    courseId: String,
  }).validator(),
  run({ courseId }) {
    const course = Courses.findOne(courseId);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('deleteAllProjects.unauthorized',
      'Cannot delete draft that is not yours');
    }
    const ownersAsSupervisors = [];
    lodash.forEach(course.owner, function(ownerId) {
      const owner = Meteor.users.findOne(ownerId);
      ownersAsSupervisors.push({ userId: owner._id, role: owner.profile.title });
    });
    Projects.remove({ courseId, supervisors: { $in: ownersAsSupervisors } });
  },
});

export const deleteEditableCourse = new ValidatedMethod({
  name: 'deleteEditableCourse',
  validate: new SimpleSchema({
    collectionName: {
      type: String,
      allowedValues: ['drafts', 'projects'],
    },
    docId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),
  run({ collectionName, docId }) {
    currentCollection = Mongo.Collection.get(collectionName);
    const doc = currentCollection.findOne(docId);
    const course = Courses.findOne(doc.courseId)
    if (!lodash.includes(doc.permissions.manageCourses, this.userId)) {
      throw new Meteor.Error(`${collectionName}deleteEditableCourse.unauthorized`,
      'You are not allowed to edit courses in this document');
    }
    lodash.forEach(doc.supervisors, function(supervisor){
      if(lodash.includes(course.owner, supervisor.userId) && (supervisor.userId != this.userId)){
        deleteEditableArrayItem.call({
          collectionName: collectionName,
          docId: doc._id,
          arrayField: 'supervisors',
          item: { userId: supervisor.userId, role: supervisor.role },
        }, (err, res) => {
          if (err) {
            alert(err);
          }
        });
      }
    });
    currentCollection.update(docId, { $unset: { courseId: '' } });
  },
});

export const deleteCourse = new ValidatedMethod({
  name: 'deleteCourse',
  validate: new SimpleSchema({
    courseId: String,
  }).validator(),
  run({ courseId }) {
    const course = Courses.findOne(courseId);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('deleteCourse.unauthorized',
      'Cannot delete Course that is not yours');
    }
    Courses.remove(courseId);
  },
});

export const leaveCourse = new ValidatedMethod({
  name: 'leaveCourse',
  validate: new SimpleSchema({
    courseId: String,
  }).validator(),
  run({ courseId }) {
    const course = Courses.findOne(courseId);
    if (!lodash.includes(course.owner, this.userId) && !lodash.includes(course.member, this.userId)) {
      throw new Meteor.Error('leaveCourse.unauthorized',
      'Cannot leave Course');
    }
    if (course && lodash.includes(course.owner, this.userId)){
      const courseProjects = Projects.find({ courseId: courseId, supervisors: { $elemMatch: { userId: this.userId } } });
      Courses.update(courseId, { $pull: { owner: this.userId } });
      if (courseProjects) {
        courseProjects.forEach(function(project) {
          Projects.update(project._id, { $pull: { supervisors: { userId: this.userId } } });
        });
      }
    } else {
      const courseProjects = Projects.find({ courseId: courseId, team: { $elemMatch: { userId: this.userId } } });
      Courses.update(courseId, { $pull: { member: this.userId } });
      if (courseProjects) {
        courseProjects.forEach(function(project) {
          Projects.update(project._id, { $pull: { team: { userId: this.userId } } });
        });
      }
    }
  },
});

export const addMemberToDraft = new ValidatedMethod({
  name: 'drafts.addMember',
  validate: memberSchema.validator(),
  run({ docId, member }) {
    const draft = Drafts.findOne(docId);
    if (!lodash.includes(draft.permissions.manageMembers, this.userId)
      || !lodash.includes(draft.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('drafts.addMember.unauthorized',
      'You are not allowed to add a member to this draft');
    }
    Drafts.update(docId, { $push: { team: member } });
    lodash.forEach(member.permissions, function(hasPermission, permissionName) {
      if (hasPermission) {
        const addObj = {};
        addObj[`permissions.${permissionName}`] = member.userId;
        Drafts.update(docId, { $addToSet: addObj });
      }
    });
    if (draft && draft.courseId){
      Courses.update(draft.courseId, { $push: { 'member': member.userId } });
    }
  },
});

export const addMemberToProject = new ValidatedMethod({
  name: 'projects.addMember',
  validate: memberSchema.validator(),
  run({ docId, member }) {
    const project = Projects.findOne(docId);
    if (!lodash.includes(project.permissions.manageMembers, this.userId)
      || !lodash.includes(project.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('projects.addMember.unauthorized',
      'You are not allowed to add a member to this project');
    }
    Projects.update(docId, { $push: { team: member } });
    lodash.forEach(member.permissions, function(hasPermission, permissionName) {
      if (hasPermission) {
        const addObj = {};
        addObj[`permissions.${permissionName}`] = member.userId;
        Projects.update(docId, { $addToSet: addObj });
      }
    });
    if (project && project.courseId){
      Courses.update(project.courseId, { $push: { 'member': member.userId } });
    }
  },
});

export const addSupervisorToCourse = new ValidatedMethod({
  name: 'addSupervisorToCourse',
  validate: courseOwnerSchema.validator(),
  run({ docId, userId }) {
    const course = Courses.findOne(docId);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('addSupervisorToCourse.unauthorized',
      'You cannot edit course that is not yours');
    }
    const courseProjects = Projects.find({ courseId: docId, supervisors: { $elemMatch: { userId: Meteor.userId() } } });
    const user = Meteor.users.findOne(userId);
    Courses.update(docId, { $push: { owner: userId } });
    if (courseProjects) {
      courseProjects.forEach(function(project) {
        Projects.update(project._id, { $addToSet: { supervisors: { userId, role: user.profile.title } } });
        lodash.forEach(project.permissions, function(value, permissionName) {
          const addObj = {};
          addObj[`permissions.${permissionName}`] = userId;
          Projects.update(project._id, { $addToSet: addObj });
        });
      });
    }
  },
});

export const addSupervisorToDraft = new ValidatedMethod({
  name: 'drafts.addSupervisor',
  validate: supervisorSchema.validator(),
  run({ docId, supervisor }) {
    const draft = Drafts.findOne(docId);
    if (!lodash.includes(draft.permissions.manageMembers, this.userId)
      || !lodash.includes(draft.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('drafts.addMember.unauthorized',
      'You are not allowed to add a supervisor to this draft');
    }
    if (draft.courseId && !lodash.includes(draft.permissions.manageCourses, this.userId)) {
      throw new Meteor.Error('drafts.addMember.unauthorized',
      'You are not allowed to add a supervisor to this course draft');
    }
    const user = Meteor.users.findOne(supervisor.userId);
    supervisor.role = user.profile.title;
    Drafts.update(docId, { $push: { supervisors: supervisor } });
    lodash.forEach(draft.permissions, function(value, permissionName) {
      const addObj = {};
      addObj[`permissions.${permissionName}`] = supervisor.userId;
      Drafts.update(docId, { $addToSet: addObj });
    });
  },
});

export const addSupervisorToProject = new ValidatedMethod({
  name: 'projects.addSupervisor',
  validate: supervisorSchema.validator(),
  run({ docId, supervisor }) {
    const project = Projects.findOne(docId);
    if (!lodash.includes(project.permissions.manageMembers, this.userId)
      || !lodash.includes(project.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('projects.addMember.unauthorized',
      'You are not allowed to add a supervisor to this project');
    }
    if (project.courseId && !lodash.includes(project.permissions.manageCourses, this.userId)) {
      throw new Meteor.Error('projects.addMember.unauthorized',
      'You are not allowed to add a supervisor to this course project');
    }
    const user = Meteor.users.findOne(supervisor.userId);
    supervisor.role = user.profile.title;
    Projects.update(docId, { $push: { supervisors: supervisor } });
    lodash.forEach(project.permissions, function(value, permissionName) {
      const addObj = {};
      addObj[`permissions.${permissionName}`] = supervisor.userId;
      Projects.update(docId, { $addToSet: addObj });
    });
  },
});

export const deleteEditableArrayItem = new ValidatedMethod({
  name: 'editable.deleteArrayItem',
  validate: new SimpleSchema({
    collectionName: {
      type: String,
      allowedValues: ['drafts', 'projects', 'users'],
    },
    docId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    arrayField: {
      type: String,
    },
    item: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ collectionName, docId, arrayField, item }) {
    currentCollection = Mongo.Collection.get(collectionName);
    const doc = currentCollection.findOne(docId);
    if (lodash.includes(['teamCommunication', 'jobs', 'contacts'], arrayField)) {
      if (!lodash.includes(doc.permissions.editInfos, this.userId)) {
        throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.unauthorized`,
        `You are not allowed to delete items from ${arrayField} in this document.`);
      }
    } else if (lodash.includes(['profile.contacts', 'profile.links'], arrayField)) {
      if (doc._id != this.userId) {
        throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.unauthorized`,
        'You are not allowed to edit profile that is not yours.');
      }
    } else if (lodash.includes(['team', 'supervisors'], arrayField)) {
      const adminMembers = () => lodash.filter(doc.team, function(member) {
        return member.permissions.editInfos && member.permissions.manageMembers
            && member.permissions.manageCourses && member.permissions.deleteProject;
      });
      const isUserAdminMember = (team, userId) => {
        const member = lodash.find(team, function(member) {
          return member.userId == userId;
        });
        if (member && member.permissions.editInfos && member.permissions.manageMembers
          && member.permissions.manageCourses && member.permissions.deleteProject) {
          return true;
        }
        return false;
      };
      const isUserInGroup = (group, userId) => {
        let foundUser = false;
        lodash.forEach(group, function(value) {
          if (lodash.includes(value, userId)) {
            foundUser = true;
            return false; // breaks the loop
          }
        });
        return foundUser;
      };

      if (arrayField == 'team') {
        if (this.userId == item.userId) {
          if (doc.isNewProject && !isUserInGroup(doc.supervisors, this.userId)) {
            throw new Meteor.Error(`drafts.editable.deleteArrayItem.${arrayField}.leaveDraftImpossible`,
            'You cannot leave your own draft');
          }
          if (isUserAdminMember(doc.team, this.userId) && adminMembers().length === 1
          && (!doc.supervisors || doc.supervisors.length === 0)) {
            throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.lastAdmin`,
            `You cannot leave ${arrayField} because you are the only member with all permissions.`);
          }
        } else if (!lodash.includes(doc.permissions.manageMembers, this.userId)) {
          throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.unauthorized`,
            `You are not allowed to delete member from ${arrayField} in this document.`);
        }
      }
      if (arrayField == 'supervisors') {
        if (this.userId == item.userId) {
          if (doc.isNewProject && !isUserInGroup(doc.team, this.userId)) {
            throw new Meteor.Error(`editable.deleteArrayItem.${arrayField}.leaveDraftImpossible`,
            'You cannot leave your own draft');
          }
          if (doc.supervisors.length === 1 && adminMembers().length === 0) {
            throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.lastAdmin`,
            `You cannot leave ${arrayField} because you are the only member with all permissions.`);
          }
        } else if (!lodash.includes(doc.permissions.manageMembers, this.userId)) {
          throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.unauthorized`,
            `You are not allowed to delete member from ${arrayField} in this document.`);
        } else if (doc.courseId && !lodash.includes(doc.permissions.manageCourses, this.userId)) {
          throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.unauthorized`,
          'You are not allowed to delete supervisors from this course project.');
        }
      }
    } else {
      throw new Meteor.Error(`${collectionName}.editable.deleteArrayItem.missingPermissionCheck`,
      `Please provide permissions checks to let only the right users delete items from ${arrayField}`);
    }

    const pullObj = {};
    pullObj[arrayField] = item;
    currentCollection.update(docId, { $pull: pullObj });

    if (lodash.includes(['team', 'supervisors'], arrayField)) {
      updateEditPermissions.call({
        collectionName,
        docId,
      }, (err, res) => {
        if (err) {
          console.log(err);
        }
      });
    }
  },
});

export const addCourseToProject = new ValidatedMethod({
  name: 'projects.addCourse',
  validate: addCourseSchema.validator(),
  run({ docId, courseId, inputKey }) {
    if(!this.isSimulation){
      const project = Projects.findOne(docId);
      const course = Courses.findOne(courseId);
      if (!lodash.includes(project.permissions.manageCourses, this.userId)) {
        throw new Meteor.Error('projects.addCourse.unauthorized',
        'You are not allowed to add courses to this project.');
      }
      if (course.courseKey != inputKey) {
        throw new Meteor.Error('projects.addCourse.unauthorized',
        'Wrong key!!');
      }
      if(project.courseId){
        deleteEditableCourse.call({
          collectionName: "projects",
          docId: project._id,
        }, (err, res) => {
          if (err) {
            alert(err);
          }
        });
      }
      lodash.forEach(course.owner, function(ownerId) {
        const user = Meteor.users.findOne(ownerId);
        Projects.update(docId, { $addToSet: { supervisors: { userId: user._id, role: user.profile.title } } });
        Projects.update(docId, { $addToSet: { 'permissions.editInfos': user._id } });
        Projects.update(docId, { $addToSet: { 'permissions.manageMembers': user._id } });
        Projects.update(docId, { $addToSet: { 'permissions.manageCourses': user._id } });
        Projects.update(docId, { $addToSet: { 'permissions.deleteProject': user._id } });
      });
      Projects.update(docId, { $set: { courseId } });
      if (course.deadline) {
        Projects.update(docId, { $set: { deadline: course.deadline } });
      }
      if (project.team){
        lodash.forEach(project.team, function(member) {
          if(!lodash.includes(course.team, member.userId)){
            Courses.update(course._id, { $push: { 'member': member.userId } });
          }
        });
      }
      if (project.supervisors){
        lodash.forEach(project.supervisors, function(supervisor) {
          if(!lodash.includes(course.owner, supervisor.userId)){
            Courses.update(course._id, { $push: { 'owner': supervisor.userId } });
          }
        });
      }
    }
  },
});

export const addCourseToDraft = new ValidatedMethod({
  name: 'drafts.addCourse',
  validate: addCourseSchema.validator(),
  run({ docId, courseId, inputKey }) {
    if(!this.isSimulation){
      const draft = Drafts.findOne(docId);
      const course = Courses.findOne(courseId);
      if (!lodash.includes(draft.permissions.manageCourses, this.userId)) {
        throw new Meteor.Error('drafts.addCourse.unauthorized',
        'You are not allowed to add courses to this draft.');
      }
      if (course.courseKey != inputKey) {
        throw new Meteor.Error('drafts.addCourse.unauthorized',
        'Wrong key!!');
      }
      if(draft.courseId){
        deleteEditableCourse.call({
          collectionName: "drafts",
          docId: draft._id,
        }, (err, res) => {
          if (err) {
            alert(err);
          }
        });
      }
      lodash.forEach(course.owner, function(ownerId) {
        const user = Meteor.users.findOne(ownerId);
        Drafts.update(docId, { $addToSet: { supervisors: { userId: user._id, role: user.profile.title } } });
        Drafts.update(docId, { $addToSet: { 'permissions.editInfos': user._id } });
        Drafts.update(docId, { $addToSet: { 'permissions.manageMembers': user._id } });
        Drafts.update(docId, { $addToSet: { 'permissions.manageCourses': user._id } });
        Drafts.update(docId, { $addToSet: { 'permissions.deleteProject': user._id } });
      });
      Drafts.update(docId, { $set: { courseId } });
      if (course.deadline) {
        Drafts.update(docId, { $set: { deadline: course.deadline } });
      }
      if (draft.team){
        lodash.forEach(draft.team, function(member) {
          if(!lodash.includes(course.team, member.userId)){
            Courses.update(course._id, { $push: { 'member': member.userId } });
          }
        });
      }
      if (draft.supervisors){
        lodash.forEach(draft.supervisors, function(supervisor) {
          if(!lodash.includes(course.owner, supervisor.userId)){
            Courses.update(course._id, { $push: { 'owner': supervisor.userId } });
          }
        });
      }
    }
  },
});

export const addCourseToCourse = new ValidatedMethod({
  name: 'courses.addCourse',
  validate: addCourseToCourseSchema.validator(),
  run({ courseId, courseInput }) {
    if(!this.isSimulation){
      const course = Courses.findOne(courseId);
      if (!this.userId || (course.courseKey != courseInput)){
        throw new Meteor.Error("courses.addCourse.unauthorized",
        "Wrong key!");
      }
      else if ((lodash.includes(course.member, this.userId)) || (lodash.includes(course.owner, this.userId))){
        throw new Meteor.Error("courses.addCourse.unauthorized",
        "Wrong key!");
      }
      Courses.update(courseId, { $push: { 'member': this.userId } });
    }
  },
});

export const saveGrading = new ValidatedMethod({
  name: 'saveGrading',
  validate: new SimpleSchema({
    value: String,
    userId: String,
    projectId: String,
  }).validator(),
  run({ value, userId, projectId }) {
    const project = Projects.findOne(projectId);
    const isUserInGroup = (group, userId) => {
      let foundUser = false;
      lodash.forEach(group, function(value) {
        if (lodash.includes(value, userId)) {
          foundUser = true;
          return false; // breaks the loop
        }
      });
      return foundUser;
    };
    if (!isUserInGroup(project.supervisors, this.userId)) {
      throw new Meteor.Error("saveGrading.unauthorized",
      "You are not allowed to Grading the Project");
    }
    Projects.update({_id: projectId, team:{$elemMatch:{userId: userId}}}, { $set: { 'team.$.grading': value }});
  },
});

export const setDraftIdInProfile = new ValidatedMethod({
  name: 'users.addDraftId',
  validate: new SimpleSchema({
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    draftId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },

    courseId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  }).validator(),
  run({ userId, draftId, courseId }) {
    if (userId != this.userId) {
      throw new Meteor.Error('users.addDraftId.unauthorized',
      'You cannot add draft to profile that is not yours');
    }
    Meteor.users.update(userId, { $addToSet: { 'profile.drafts': { courseId, draftId } } });
  },
});

export const updateMemberInDraft = new ValidatedMethod({
  name: 'drafts.updateMember',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const draft = Drafts.findOne(_id);
    if (!lodash.includes(draft.permissions.manageMembers, this.userId)
      || !lodash.includes(draft.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('drafts.addMember.unauthorized',
      'You are not allowed to edit members in this draft');
    }
    if (modifier.$set) {
      const regExpMemberUserIdKey = /^team\.\d\.userId$/;
      const userIdKey = lodash.find(lodash.keys(modifier.$set), function(value) {
        return regExpMemberUserIdKey.test(value);
      });
      const memberIndex = lodash.keys(modifier.$set)[0].match(/\d/)[0];

      if (draft.team[memberIndex].userId === this.userId) {
        if (modifier.$set[userIdKey] && (modifier.$set[userIdKey] != this.userId)) {
          throw new Meteor.Error('drafts.updateEditable.changeOwnMemberImpossible',
          "You cannot change your own member item's user or permissions");
        }
        const permissionKeys = ['editInfos', 'manageMembers', 'manageCourses', 'deleteProject'];
        const changingPermissions = lodash.filter(permissionKeys, function(permissionKey) {
          if (modifier.$set[`team.${memberIndex}permissions.${permissionKey}`]) {
            return modifier.$set[`team.${memberIndex}permissions.${permissionKey}`] !== draft.team[memberIndex].permissions[permissionKey];
          }
          return false;
        });
        if (changingPermissions.length > 0) {
          throw new Meteor.Error('drafts.updateEditable.changeOwnMemberImpossible',
          "You cannot change your own member item's user or permission");
        }
      }
    }
    Drafts.update({ _id }, modifier);
    updateEditPermissions.call({
      collectionName: 'drafts',
      docId: _id,
    }, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  },
});

export const updateMemberInProject = new ValidatedMethod({
  name: 'projects.updateMember',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const project = Projects.findOne(_id);
    if (!lodash.includes(project.permissions.manageMembers, this.userId)
      || !lodash.includes(project.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('projects.addMember.unauthorized',
      'You are not allowed to edit members in this project');
    }
    if (modifier.$set) {
      const regExpMemberUserIdKey = /^team\.\d\.userId$/;
      const userIdKey = lodash.find(lodash.keys(modifier.$set), function(value) {
        return regExpMemberUserIdKey.test(value);
      });
      const memberIndex = lodash.keys(modifier.$set)[0].match(/\d/)[0];

      if (project.team[memberIndex].userId === this.userId) {
        if (modifier.$set[userIdKey] && (modifier.$set[userIdKey] != this.userId)) {
          throw new Meteor.Error('projects.updateEditable.changeOwnMemberImpossible',
          "You cannot change your own member item's user or permissions");
        }
        const permissionKeys = ['editInfos', 'manageMembers', 'manageCourses', 'deleteProject'];
        const changingPermissions = lodash.filter(permissionKeys, function(permissionKey) {
          if (modifier.$set[`team.${memberIndex}permissions.${permissionKey}`]) {
            return modifier.$set[`team.${memberIndex}permissions.${permissionKey}`] !== project.team[memberIndex].permissions[permissionKey];
          }
          return false;
        });
        if (changingPermissions.length > 0) {
          throw new Meteor.Error('projects.updateEditable.changeOwnMemberImpossible',
          "You cannot change your own member item's user or permission");
        }
      }
    }
    Projects.update({ _id }, modifier);
    updateEditPermissions.call({
      collectionName: 'projects',
      docId: _id,
    }, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  },
});

export const updateEditableInfoInDraft = new ValidatedMethod({
  name: 'drafts.updateEditableInfo',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const draft = Drafts.findOne(_id);
    if (!lodash.includes(draft.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('drafts.updateEditableInfo.unauthorized',
      'You are not allowed to edit this info field of the draft');
    }
    if (draft.courseId && modifier.$set.deadline) {
      if (!lodash.includes(draft.permissions.manageCourses, this.userId)) {
        throw new Meteor.Error('drafts.updateEditableInfo.unauthorized',
        'You are not allowed to edit course infos in this draft');
      }
    }
    Drafts.update({ _id }, modifier);
  },
});

export const updateEditableInfoInProject = new ValidatedMethod({
  name: 'projects.updateEditableInfo',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const project = Projects.findOne(_id);
    if (!lodash.includes(project.permissions.editInfos, this.userId)) {
      throw new Meteor.Error('projects.updateEditableInfo.unauthorized',
      'You are not allowed to edit this info field of the project');
    }
    if (project.courseId && modifier.$set.deadline) {
      if (!lodash.includes(project.permissions.manageCourses, this.userId)) {
        throw new Meteor.Error('projects.updateEditableInfo.unauthorized',
        'You are not allowed to edit course infos in this project');
      }
    }
    Projects.update({ _id }, modifier);
  },
});

export const updateEditableSupervisorNotesInDraft = new ValidatedMethod({
  name: 'drafts.updateEditableSupervisorNotes',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const draft = Drafts.findOne(_id);
    const isUserInGroup = (group, userId) => {
      let foundUser = false;
      lodash.forEach(group, function(value) {
        if (lodash.includes(value, userId)) {
          foundUser = true;
          return false; // breaks the loop
        }
      });
      return foundUser;
    };
    if (!isUserInGroup(draft.supervisors, this.userId)) {
      throw new Meteor.Error('drafts.updateEditableInfo.unauthorized',
      'You are not allowed to edit this supervisor notes in this draft');
    }
    Drafts.update({ _id }, modifier);
  },
});

export const updateEditableSupervisorNotesInProject = new ValidatedMethod({
  name: 'projects.updateEditableSupervisorNotes',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const project = Projects.findOne(_id);
    const isUserInGroup = (group, userId) => {
      let foundUser = false;
      lodash.forEach(group, function(value) {
        if (lodash.includes(value, userId)) {
          foundUser = true;
          return false; // breaks the loop
        }
      });
      return foundUser;
    };
    if (!isUserInGroup(project.supervisors, this.userId)) {
      throw new Meteor.Error('projects.updateEditableInfo.unauthorized',
      'You are not allowed to edit this supervisor notes in this project');
    }
    Projects.update({ _id }, modifier);
  },
});

export const enterProject = new ValidatedMethod({
  name: 'enterProject',
  validate: new SimpleSchema({
    projectId: String,
    input: String,
  }).validator(),
  run({ projectId, input }) {
    if(!this.isSimulation){
      const project = Projects.findOne(projectId);
      const course = Courses.findOne(project.courseId);
      //var decryptKey = CryptoJS.AES.decrypt(course.courseKey, 'courseKeyCrypt').toString(CryptoJS.enc.Utf8);
      //console.log(decryptKey);
      if (!this.userId || (course.courseKey != input)){
        throw new Meteor.Error("enterProject.unauthorized",
        "Wrong key!");
      }
      const member = {
        userId: Meteor.userId(),
        role: 'Selbsteingeschriebenes Mitglied',
        permissions: {
          editInfos: true,
          manageMembers: false,
          manageCourses: false,
          deleteProject: false,
        },
      };
      Projects.update(projectId, { $push: { team: member } });
      lodash.forEach(member.permissions, function(hasPermission, permissionName) {
        if (hasPermission) {
          const addObj = {};
          addObj[`permissions.${permissionName}`] = member.userId;
          Projects.update(projectId, { $addToSet: addObj });
        }
      });
    }
  },
});

export const setSelfEnter = new ValidatedMethod({
  name: 'setSelfEnter',
  validate: new SimpleSchema({
    buttonEvent: Boolean,
    courseId: String,
  }).validator(),
  run({ buttonEvent, courseId }) {
    const course = Courses.findOne(courseId);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('setSelfEnter.unauthorized',
      'Cannot Update in current course');
    }
    if (buttonEvent) {
      Courses.update(courseId, { $set: { selfEnter: false } });
    } else {
      Courses.update(courseId, { $set: { selfEnter: true } });
    }
  },
});

export const updateEditableInCourse = new ValidatedMethod({
  name: 'courses.updateEditable',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const course = Courses.findOne(_id);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('courses.updateEditable.unauthorized',
      'You cannot edit Course that is not yours');
    }
    return Courses.update({
      _id: _id
    }, modifier);
  },
});

export const insertCourseInCourses = new ValidatedMethod({
  name: 'courses.insert',
  validate: courseSchema.validator(),
  run(fields) {
    if (!this.userId || (Meteor.user().profile.role != 'Mitarbeiter')) {
      throw new Meteor.Error('courses.insert.unauthorized',
      'You cannot edit Courses that is not yours');
    }
    return Courses.insert(fields);
  },
});

export const setCourseDeadline = new ValidatedMethod({
  name: 'setCourseDeadline',
  validate: new SimpleSchema({
    _id: String,
    modifier: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ modifier, _id }) {
    const course = Courses.findOne(_id);
    if (!lodash.includes(course.owner, this.userId)) {
      throw new Meteor.Error('courses.insert.unauthorized',
      'You cannot edit Courses that is not yours');
    }
    const courseProjects = Projects.find({ courseId: _id }, { supervisors: { $elemMatch: { userId: Meteor.userId() } } });
    if (courseProjects) {
      courseProjects.forEach(function(project) {
        Projects.update({
          _id: project._id,
        }, modifier);
      });
    }
    return Courses.update({
      _id,
    }, modifier);
  },
});
