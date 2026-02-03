const EventEmitter = require('events');
const readline = require('readline');

const emitter = new EventEmitter();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let currentUser = null;
let userEvents = {};

function track(user, event) {
  if (!userEvents[user]) {
    userEvents[user] = {};
  }
  userEvents[user][event] = (userEvents[user][event] || 0) + 1;
}

emitter.on('login', (username) => {
  currentUser = username;
  track(username, 'login');
  console.log(`User ${username} logged in`);
});

emitter.on('logout', () => {
  track(currentUser, 'logout');
  console.log(`User ${currentUser} logged out`);
  currentUser = null;
});

emitter.on('purchase', (item) => {
  track(currentUser, 'purchase');
  console.log(`${currentUser} purchased ${item}`);
});

emitter.on('update-profile', (newName) => {
  userEvents[newName] = userEvents[currentUser] || {};
  delete userEvents[currentUser];
  currentUser = newName;
  track(newName, 'profile-update');
  console.log(`Username updated to ${newName}`);
});

emitter.on('summary', () => {
  console.log('\n--- SUMMARY ---');
  for (let user in userEvents) {
    console.log(user);
    for (let ev in userEvents[user]) {
      console.log(`  ${ev}: ${userEvents[user][ev]}`);
    }
  }
  console.log('---------------\n');
});

function showMenu() {
  console.log('\n1. Login');
  console.log('2. Logout');
  console.log('3. Purchase');
  console.log('4. Update Profile');
  console.log('5. Summary');
  console.log('6. Exit');
}

function start() {
  showMenu();
  rl.question('Choose option: ', (choice) => {

    if (choice === '1') {
      rl.question('Enter username: ', (name) => {
        emitter.emit('login', name);
        start();
      });

    } else if (choice === '2') {
      if (!currentUser) {
        console.log('No user logged in');
        start();
      } else {
        emitter.emit('logout');
        start();
      }

    } else if (choice === '3') {
      if (!currentUser) {
        console.log('Login first');
        start();
      } else {
        rl.question('Enter item: ', (item) => {
          emitter.emit('purchase', item);
          start();
        });
      }

    } else if (choice === '4') {
      if (!currentUser) {
        console.log('Login first');
        start();
      } else {
        rl.question('Enter new username: ', (newName) => {
          emitter.emit('update-profile', newName);
          start();
        });
      }

    } else if (choice === '5') {
      emitter.emit('summary');
      start();

    } else if (choice === '6') {
      console.log('Bye!');
      rl.close();

    } else {
      console.log('Invalid choice');
      start();
    }
  });
}

start();
