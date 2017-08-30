
//***************Beginn Coursefeature****************
FlowRouter.route('/courses', {
  name: 'courses',
  action() {
    BlazeLayout.render('layout', { content: 'course' });
  },
});
//die URL baut sich aus die ID und dem namen des Kurses auf
FlowRouter.route('/courses/:courseId/:courseName', {
  name: 'course',
  action() {
    BlazeLayout.render('layout', { content: 'currentCourse' });
  },
});

FlowRouter.route('/courses/:courseId/:courseName/members', {
  name: 'courseMembers',
  action() {
    BlazeLayout.render('layout', { content: 'courseList' });
  },
});
//***************End Coursefeature****************
