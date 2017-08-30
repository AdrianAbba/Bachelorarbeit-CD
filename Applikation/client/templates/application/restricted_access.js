Template.onlyIfLoggedIn.helpers({
  authInProcess() {
    //gibt an das ein Nutzer eingeloggt ist
    return Meteor.loggingIn();
  },
  canShow() {
    return !!Meteor.user();
  },
});
