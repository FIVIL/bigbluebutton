import Users from '/imports/api/users';
import Meetings from '/imports/api/meetings';
import Note from '/imports/api/note';
import Auth from '/imports/ui/services/auth';
import Settings from '/imports/ui/services/settings';
import mapUser from '/imports/ui/services/user/mapUser';

const NOTE_CONFIG = Meteor.settings.public.note;

const getNoteId = () => {
  const noteId = Note.findOne({ meetingId: Auth.meetingID }).noteId;
  return noteId;
};

const getReadOnlyNoteId = () => {
  const readOnlyNoteId = Note.findOne({ meetingId: Auth.meetingID }).readOnlyNoteId;
  return readOnlyNoteId;
};

const getLang = () => {
  const locale = Settings.application.locale;
  const lang = locale.toLowerCase();
  return lang;
};

const getCurrentUser = () => {
  const User = Users.findOne({ userId: Auth.userID });
  return User;
};

const getNoteParams = () => {
  let config = NOTE_CONFIG.config;
  const User = getCurrentUser();
  config.userName = User.name;
  config.userColor = User.color;
  config.lang = getLang();

  let params = [];
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      params.push(key + '=' + encodeURIComponent(config[key]));
    }
  }
  return params.join('&');
};

const isLocked = () => {
  const meeting = Meetings.findOne({});
  const user = getCurrentUser();

  if (meeting.lockSettingsProps && mapUser(user).isLocked) {
    return meeting.lockSettingsProps.disableNote;
  }
  return false;
};

const getReadOnlyURL = () => {
  const readOnlyNoteId = getReadOnlyNoteId();
  const url = Auth.authenticateURL(NOTE_CONFIG.url + '/p/' + readOnlyNoteId);
  return url;
};

const getNoteURL = () => {
  const noteId = getNoteId();
  const params = getNoteParams();
  const url = Auth.authenticateURL(NOTE_CONFIG.url + '/p/' + noteId + '?' + params);
  return url;
};

const isEnabled = () => {
  const note = Note.findOne({ meetingId: Auth.meetingID });
  return NOTE_CONFIG.enabled && note;
};

export default {
  getNoteURL,
  getReadOnlyURL,
  isLocked,
  isEnabled,
};
