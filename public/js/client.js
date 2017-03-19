$(() => {
  const socket = io();
  const $msgList = $('#messages');
  const $userList = $('#user-list');

  // Connected to chat
  socket.on('connect', () => {
    $msgList.append($('<h5>').text('Connected to ryChat'));
  });

  // Update users list
  socket.on('update users', (user) => {
    console.log(user);
    $msgList.append($('<li>').text(`${user} has joined the chat.`));
    $userList.append($('<li>').text(user));
  });

  // Get new chat message
  socket.on('chat message', (user, msg) => {
    $msgList.append($('<li>').text(`${user}: ${msg}`));
  });

  // User disconnected
  socket.on('disconnect', (name, users) => {
    $msgList.append($('<li>').text(`${name} has left the chat.`));
    console.log(users);

  });

  // Create user name
  $('#new-user-form').submit((e) => {
    e.preventDefault();
    const $name = $('#user-name').val();
    socket.emit('new user', $name);
    $('.new-user-card').addClass('hide');
    $('.chat-section').removeClass('hide');
    $userList.append($('<li>').text($name));
  });

  // Send new chat message
  $('#chat-message-form').submit(() => {
    socket.emit('chat message', $('#userMessage').val());
    $('#userMessage').val('');
    return false;
  });
});
