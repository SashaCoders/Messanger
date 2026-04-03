const  socket = io();
form.addEventListener('submit', function (e){
    e.preventDefault();
if(input.value){
    socket.emit('new_message', input.value);
input.value = '';
}
});

localStorage.getItem("msg");
socket.on('message', function (msg){
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

});