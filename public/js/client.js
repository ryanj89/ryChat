$(() => {
  const socket = io();
  const $msgList = $('#messages');
  const $userList = $('#user-list');
  const $isTyping = $('.typing-notification');
  let timeout;

  // Connected to chat
  socket.on('connect', () => {
    $msgList.append($('<h5 class="italic">').text('Welcome to ryChat'));
  });

  // Update users list
  socket.on('update users', (user) => {
    console.log(user);
    $msgList.append($('<li>').text(`${user} has joined the chat.`));
    const $userItem = $('<li>');
    $userItem.append($('<span>').text(user).prepend($('<i class="material-icons left">').text('face')));
    $userItem.append($('<i class="material-icons">').text('chat'));
    $userList.append($userItem);
  });

  // Display notification when a user is typing
  socket.on('typing', (typing, user) => {
    if (typing) {
      $isTyping.text(`${user} is typing...`).fadeIn('slow');
    } else {
      $isTyping.fadeOut('slow');
    }
  });

  // Get new chat message
  socket.on('chat message', (user, msg) => {
    const $name = $('<span class="message-user">').text(user);
    const $msgItem = $('<li>').append($name, ` (${getTimeStamp()}): ${msg}`);
    $msgList.append($msgItem);
  });

  // User disconnected
  socket.on('disconnect', (name, users) => {
    $msgList.append($('<li class="italic">').text(`${name} has left the chat.`));
    console.log(users);
  });

  $('#userMessage').keypress((e) => {
    typing = true;
    socket.emit('typing', typing);
    clearTimeout(timeout);
    timeout = setTimeout(typingTimeout, 2000);
  });

  // Create user name
  $('#new-user-form').submit((e) => {
    e.preventDefault();
    const $name = $('#user-name').val();
    socket.emit('new user', $name);
    $('.new-user-card').addClass('hide');
    $('.chat-section').removeClass('hide');
    const $userItem = $('<li>');
    $userItem.append($('<span>').text($name).prepend($('<i class="material-icons left">').text('face')));
    $userItem.append($('<i class="material-icons">').text('chat'));
    $userList.append($userItem);
  });

  // Send new chat message
  $('#chat-message-form').submit(() => {
    socket.emit('chat message', $('#userMessage').val());
    $('#userMessage').val('');
    return false;
  });

  function typingTimeout() {
    typing = false;
    socket.emit('typing', false);
  }

  // Create formatted timeStamp
  function getTimeStamp() {
      const now = new Date();
      const time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
      // Determine AM or PM based on the hour
      const suffix = ( time[0] < 12 ) ? 'AM' : 'PM';
      // Convert hour from military time
      time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
      // If hour is 0, set it to 12
      time[0] = time[0] || 12;
      // If seconds or minutes are less than 10, prefix with zero
      for ( let i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = '0' + time[i];
        }
      }
      // Return the formatted string
      return time.join(':') + ' ' + suffix;
    }
});
