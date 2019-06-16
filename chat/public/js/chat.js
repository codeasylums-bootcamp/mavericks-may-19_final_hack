// var socket= io();
// socket.on('connect', function (){
//   console.log('connected to server');
//
//
// });
// socket.on('disconnect',function (){
//   console.log('Disconnected from server');
// });
// socket.on('newMessage', function(message){
//   console.log('New message',message);
// });
var socket = io();
function scrollToBottom(){

  var messages= jQuery('#messages');
var newMessage= messages.children('li:last-child')
  var clientHeight= messages.prop('clientHeight');
  var scrollTop= messages.prop('scrollTop');
  var scrollHeight= messages.prop('scrollHeight');
  var newMessageHeight= newMessage.innerHeight();
  var lastMessageHeight= newMessage.prev().innerHeight();
  if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight>=scrollHeight)
  {
    messages.scrollTop(scrollHeight);
  }
}
socket.on('connect', function () {

var params= jQuery.deparam(window.location.search);
socket.emit('join', params, function(err){
  if(err)
  {

    alert(err);
    window.location.href='/';
  }
  else {
    console.log('no error');
  }
});
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');

});
socket.on('updateUserList', function (users){
  //console.log('heyyyyyyyy');
  var ol=jQuery('<ol></ol>');
  users.forEach(function (user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
  console.log(users);
});
socket.on('newMessage', function (message) {

  var formattedTime= moment(message.createdAt).format('h:mm a');
  var template= jQuery('#message-template').html();
  var html=Mustache.render(template,{
    from: message.from,
    createdAt: formattedTime,
    text: message.text
  });

  jQuery('#messages').append(html);
    scrollToBottom();
});
socket.on('newLocationMessage', function(locationmessage){

    var formatTime= moment(locationmessage.createdAt).format('h:mm a');


var template= jQuery('#location-message-template').html();
var html= Mustache.render(template,{
  from: locationmessage.from,
  createdAt: formatTime,
  url:locationmessage.url
});

    jQuery('#messages').append(html);
      scrollToBottom();
});

var messageTextBox= jQuery('[name=message]');
jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from: 'User',
    text: messageTextBox.val()
  }, function(){
    messageTextBox.val('');

  });
});
var llocation= jQuery('#send-location');
llocation.on('click', function(){
  if(!navigator.geolocation)
  {
  return  alert('geolocation not supported by your browser');
  }
  llocation.attr('disabled','disabled').text('Sending Location... ');
  navigator.geolocation.getCurrentPosition(function (position){
    llocation.removeAttr('disabled').text('Send Location');
     socket.emit('createLocationMessage', {latitude: position.coords.latitude,
longitude: position.coords.longitude
     }
     );

  }, function (){
      llocation.removeAttr('disabled').text('Send Location');
    alert('unable to fetch location');
  });
});
