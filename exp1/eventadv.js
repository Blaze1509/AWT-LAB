// Check if user is logged in
if (!localStorage.getItem('currentUser')) {
    window.location.href = 'login.html';
}

class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }
}

const emitter = new EventEmitter();

let currentUser = localStorage.getItem('currentUser');
let userEvents = JSON.parse(localStorage.getItem('userEvents')) || {};

function track(user, event) {
  if (!userEvents[user]) {
    userEvents[user] = {};
  }
  userEvents[user][event] = (userEvents[user][event] || 0) + 1;
  localStorage.setItem('userEvents', JSON.stringify(userEvents));
}

emitter.on('login', (username) => {
  currentUser = username;
  track(username, 'login');
  log(`User ${username} logged in`);
  updateCurrentUser();
});

emitter.on('logout', () => {
  track(currentUser, 'logout');
  log(`User ${currentUser} logged out`);
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userEvents');
  window.location.href = 'login.html';
});

emitter.on('purchase', (item) => {
  track(currentUser, 'purchase');
  log(`${currentUser} purchased ${item}`);
});

emitter.on('update-profile', (newName) => {
  userEvents[newName] = userEvents[currentUser] || {};
  delete userEvents[currentUser];
  currentUser = newName;
  localStorage.setItem('currentUser', newName);
  track(newName, 'profile-update');
  log(`Username updated to ${newName}`);
  updateCurrentUser();
});

emitter.on('summary', () => {
  log('--- SUMMARY ---');
  for (let user in userEvents) {
    log(user);
    for (let ev in userEvents[user]) {
      log(`  ${ev}: ${userEvents[user][ev]}`);
    }
  }
  log('---------------');
});

function log(message) {
  const output = document.getElementById('output');
  output.innerHTML += message + '<br>';
}

function updateCurrentUser() {
  document.getElementById('currentUser').textContent = currentUser || 'None';
}

function logout() {
  emitter.emit('logout');
}

function purchase() {
  if (!currentUser) {
    log('Login first');
  } else {
    const item = document.getElementById('item').value;
    if (item) {
      emitter.emit('purchase', item);
      document.getElementById('item').value = '';
    }
  }
}

function updateProfile() {
  if (!currentUser) {
    log('Login first');
  } else {
    const newName = document.getElementById('newName').value;
    if (newName) {
      emitter.emit('update-profile', newName);
      document.getElementById('newName').value = '';
    }
  }
}

function showSummary() {
  emitter.emit('summary');
}

window.onload = function() {
  updateCurrentUser();
  emitter.emit('login', currentUser);
};
