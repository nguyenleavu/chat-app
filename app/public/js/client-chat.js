// image
const ironMan =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ0U1xOVGARv-JxdbW30g2uawIOjCmRdR3Tg&usqp=CAU';

const captain =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB99d5mDDArJoe78EvkTpmx9NwHX8DegP9Eg&usqp=CAU';

// add a message
const appendMessage = (name, img, side, text) => {
    //   Simple solution for small apps
    const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>
  
        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${text.createAt}</div>
          </div>
  
          <div class="msg-text">${text.message}</div>
        </div>
      </div>
    `;

    msgerChat.insertAdjacentHTML('beforeend', msgHTML);
    msgerChat.scrollTop += 500;
};

// add a location message
const appendLocationMessage = (name, img, side, text) => {
    //   Simple solution for small apps
    const msgHTML = `
      <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
          <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${text.createAt}</div>
          </div>
          <div class='googleMap'>
            <a class="msg-text location" href="${text.message}" target="_blank" >Location of ${text.username}</a>
          </div>
        </div>
      </div>
    `;
    msgerChat.insertAdjacentHTML('beforeend', msgHTML);
    msgerChat.scrollTop += 500;
};

// welcome text
const appendWelcomeText = (text) => {
    //   Simple solution for small apps
    const msgHTML = `
    <p class='join-chat'>${text}</p>
  `;

    msgerChat.insertAdjacentHTML('beforeend', msgHTML);
    msgerChat.scrollTop += 100;
};

// request for server connect to client
const socket = io();

const form = document.querySelector('.msger-inputarea');
const input = document.querySelector('.msger-input');
const msgerChat = document.querySelector('.msger-chat');
const btnLocation = document.querySelector('#location');

// form
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const acknowledgement = (error) => {
        console.log(error);
    };

    if (input.value) {
        socket.emit('client_sendMessage', input.value, acknowledgement);
        input.value = '';
    }
});

socket.on('server_joinChat', (welcome) => {
    appendWelcomeText(welcome);
});

socket.on('server_sendMessage', (messageText) => {
    if (messageText.socketId === socket.id) {
        appendMessage(messageText.username, ironMan, 'right', messageText);
    } else {
        appendMessage(messageText.username, captain, 'left', messageText);
    }
});

// location
btnLocation.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            socket.emit('client_sendLocation', { latitude, longitude });
        });
    } else {
        console.log('Browser does not support geolocation');
    }
});

socket.on('server_sendLocation', (data) => {
    if (data.socketId === socket.id) {
        console.log(data);
        appendLocationMessage(data.username, ironMan, 'right', data);
    } else {
        console.log(data);
        appendLocationMessage(data.username, captain, 'left', data);
    }
});

// query string
const params = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const { room, username } = params;

socket.emit('client_joinChat', { room, username });

// users list
socket.on('server_getUserList', (userList) => {
    console.log(userList);
});
