let isExpanded = true;
const toggleButton = document.querySelector(".sidebar .toggle-sidebar");
const sidebar = document.querySelector(".sidebar");
const logo = document.querySelector(".sidebar .logo");

const collapseLink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Thu nhỏ</title><path d="M18.41,7.41L17,6L11,12L17,18L18.41,16.59L13.83,12L18.41,7.41M12.41,7.41L11,6L5,12L11,18L12.41,16.59L7.83,12L12.41,7.41Z" /></svg>`;

const expandLink = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Mở rộng</title><path d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z" /></svg>`;

function updateTogglePosition(px = sidebar.width - 10) {
  toggleButton.style.left = `${px}px`;
}

toggleButton.addEventListener("click", () => {
  isExpanded = !isExpanded;

  if (!isExpanded) {
    document.querySelectorAll(".sidebar .text").forEach(text => text.style.display = 'none');
    sidebar.classList.add("sidebar-collapse");
    logo.style.width = "50px";
    toggleButton.innerHTML = expandLink;
    updateTogglePosition(45);
  } else {
    document.querySelectorAll(".sidebar .text").forEach(text => text.style.display = 'block');
    sidebar.classList.remove("sidebar-collapse");
    logo.style.width = "100px";
    toggleButton.innerHTML = collapseLink;
    updateTogglePosition(185);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const chatLink = document.getElementById('chat-link');
  const chatBox = $('#chat-box');
  const conversationList = document.getElementById('conversation-list');
  const messageList = document.getElementById('message-list');
  const chatInput = document.getElementById('chat-input');
  const sendMessage = document.getElementById('send-message');

  chatLink.addEventListener('click', function (event) {
    event.preventDefault();
    chatBox.modal('show');
    loadConversations();
  });

  function loadConversations() {
    // Fetch conversations from the server (this is just a placeholder)
    const conversations = [
      { id: 1, name: 'Cuộc hội thoại 1' },
      { id: 2, name: 'Cuộc hội thoại 2' },
    ];

    conversationList.innerHTML = '';
    conversations.forEach(conversation => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = conversation.name;
      li.addEventListener('click', function () {
        loadMessages(conversation.id);
      });
      conversationList.appendChild(li);
    });
  }

  function loadMessages(conversationId) {
    // Fetch messages from the server (this is just a placeholder)
    const messages = [
      { sender: 'User', text: 'Hello' },
      { sender: 'Other', text: 'Hi there' },
    ];

    messageList.innerHTML = '';
    messages.forEach(message => {
      const div = document.createElement('div');
      div.className = 'list-group-item';
      div.textContent = `${message.sender}: ${message.text}`;
      messageList.appendChild(div);
    });
  }

  sendMessage.addEventListener('click', function () {
    const messageText = chatInput.value;
    if (messageText.trim() !== '') {
      // Send message to the server (this is just a placeholder)
      const div = document.createElement('div');
      div.className = 'list-group-item';
      div.textContent = `You: ${messageText}`;
      messageList.appendChild(div);
      chatInput.value = '';
    }
  });
});

// Cập nhật vị trí nút toggle sau khi trang load
window.addEventListener("load", updateTogglePosition);
window.addEventListener("resize", updateTogglePosition);
