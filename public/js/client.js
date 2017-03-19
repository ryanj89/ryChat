$(() => {
   const socket = io();
   const $msgList = $('#messages');

   socket.on('connect', () => {
     $msgList.append($('<li>').text('connected'));
   });

   $('form').submit(() => {
      socket.emit('chat message', $('#userMessage').val());
      $('#userMessage').val('');
      return false;
   });

   socket.on('chat message', (msg) => {
      $msgList.append($('<li>').text(msg));
   });

   socket.on('disconnect', () => {
     $msgList.append($('<li>').text('user disconnected'));
   });
});
