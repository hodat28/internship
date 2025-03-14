import serverUrl from "./config.js";
import { socketUrl } from './config.js';

const selectedReceiverId = '26';  // ID người nhận được chọn từ giao diện
const selectedPostId = '62';
     // Post ID sẽ được lấy từ API hoặc giao diện

// lấy token từ cookie
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
}
const token = getCookie('user_token');
const connection_url = `${socketUrl}?token=${token}`;

console.log("Token:", token);
console.log("Connection URL:", connection_url);

// Mở kết nối WebSocket
let socket = new WebSocket(socketUrl, ["token", token]);
if (!socket) {
    console.error('Failed to create WebSocket connection!');
} else {
    console.log('WebSocket connection created successfully!');
}

// Xử lý khi kết nối thành công
socket.addEventListener('open', function(event) {
    console.log('WebSocket is connected.');
});

// Xử lý khi có lỗi xảy ra
socket.addEventListener('error', function(event) {
    console.error('WebSocket error:', event);
});

// Xử lý khi nhận được phản hồi từ server
socket.addEventListener('message', function(event) {
    console.log('Message from server ', event.data);
    const messageData = JSON.parse(event.data);
    if (messageData.type === 'chat') {
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.innerHTML += `<p><strong>${messageData.receiverid}:</strong> ${messageData.content}</p>`;
    }
});
// API HTTP: Nhận thông tin chi tiết của 1 person khi nhấp vào
function loadPersonDetails(receiverid) {
    fetch(`${serverUrl}/users/${receiverid}`)
        .then(response => response.json())
        .then(data => {
            const personInfo = data.data;  // Giả sử API trả về dữ liệu trong 'data'

            // Cập nhật thông tin vào phần "Details"
            const infoName = document.querySelector('.info-name');
            const infoAvatar = document.querySelector('.info-avatar');
            const profileLink = document.createElement('a');

            infoName.textContent = personInfo.username || "Unknown User";
            infoAvatar.style.backgroundImage = `url(${personInfo.avatar_url || 'default-avatar.png'})`;
            infoAvatar.style.backgroundSize = 'cover';
            infoAvatar.style.backgroundPosition = 'center';

            // Link tới trang cá nhân (profile)
            profileLink.href = personInfo.profile_link || "#";
            profileLink.textContent = "View Profile";
            profileLink.target = "_blank";

            // Thêm link vào chi tiết
            const detailsDiv = document.querySelector('.info-actions');
            detailsDiv.innerHTML = ''; // Xóa nội dung cũ
            detailsDiv.appendChild(profileLink);
        })
        .catch(error => {
            console.error('Error fetching person details:', error);
        });
}
// Xử lý sự kiện khi nhấn nút gửi tin nhắn
document.querySelectorAll('.contact').forEach(contact => {
    contact.addEventListener('click', function() {
        const receiverid = this.dataset.receiverId;
        
        // Gọi hàm để tải thông tin chi tiết của person vào phần Details
        loadPersonDetails(receiverid);
    });
});
document.getElementById('submit-send').addEventListener('click', function() {
    const messageContent = document.getElementById('message-input').value;

    // Kiểm tra nếu người dùng chưa chọn người nhận hoặc chưa nhập tin nhắn
    if (!selectedReceiverId) {
        alert("Please select a recipient before sending a message!");
        return;
    }
    if (messageContent.trim() === "") {
        alert("Please enter a message before sending!");
        return;
    }

    // Dữ liệu được lấy từ giao diện người dùng thực
    const chatData = {
        type: 'chat',
        receiverid: selectedReceiverId,  // ID người nhận được chọn từ giao diện
        content: messageContent,         // Nội dung tin nhắn
        postid: selectedPostId           // Post ID được lấy từ giao diện hoặc API
    };

    // Gửi dữ liệu qua WebSocket
    socket.send(JSON.stringify(chatData));

    // Hiển thị tin nhắn của người dùng trong khung chat ngay lập tức
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML += `<p><strong>You:</strong> ${messageContent}</p>`;

    // Xóa nội dung input sau khi gửi tin nhắn
    document.getElementById('message-input').value = '';

    // Ghi log thông báo thành công gửi tin nhắn
    console.log('Message sent:', chatData);
});

// API HTTP: Nhận thông tin cuộc trò chuyện
fetch(`${serverUrl}/chat/conversations`)
    .then(response => response.json())
    .then(data => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.innerHTML = '<h2>Contacts</h2>'; // Xóa nội dung cũ và thêm tiêu đề "Contacts"

        // Hiển thị danh sách người dùng từ API
        data.forEach(person => {
            const contactDiv = document.createElement('div');
            contactDiv.classList.add('contact', 'd-flex', 'align-items-center', 'p-2', 'mb-3', 'bg-white', 'rounded', 'shadow-sm');

            // Avatar của người dùng
            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('avatar', 'bg-secondary', 'rounded-circle', 'mr-3');
            avatarDiv.style.width = '40px';
            avatarDiv.style.height = '40px';

            // Tên và tin nhắn cuối cùng của người dùng
            const contactNameDiv = document.createElement('div');
            contactNameDiv.classList.add('contact-name', 'font-weight-bold');
            contactNameDiv.textContent = person.username || "Unknown User";

            const lastMessageDiv = document.createElement('p');
            lastMessageDiv.textContent = person.lastMessage;
            if (person.lastMessageStatus === "unread") {
                lastMessageDiv.style.fontWeight = "bold"; // In đậm nếu tin nhắn chưa đọc
            }

            // Xử lý sự kiện khi nhấp vào person
            contactDiv.addEventListener('click', function() {
                // Nếu trạng thái là "unread", đổi thành "received" và bỏ in đậm
                if (person.lastMessageStatus === "unread") {
                    person.lastMessageStatus = "received";
                    lastMessageDiv.style.fontWeight = "normal"; // Bỏ in đậm
                }
                // Có thể thực hiện thêm các hành động khác khi nhấp vào person
            });

            // Gán các phần tử vào sidebar
            contactDiv.appendChild(avatarDiv);
            contactDiv.appendChild(contactNameDiv);
            contactDiv.appendChild(lastMessageDiv);
            sidebar.appendChild(contactDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching conversation data:', error);
    });

// Giả sử selectedPostId đã được chọn từ giao diện trước đó
if (selectedPostId) {
    fetch(`https://nodejs-cgor.onrender.com/api/posts/${selectedPostId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const product = data.data;

                // Tạo phần hiển thị thông tin sản phẩm
                const productInfoDiv = document.getElementById('product-info');
                productInfoDiv.innerHTML = `
                    <h3>${product.product_name}</h3>
                    <p>Giá: ${product.price} VND</p>
                    <img src="${product.images[0].image_url}" alt="${product.product_name}" style="max-width: 200px;"/>
                `;
            } else {
                // Không có sản phẩm
                document.getElementById('product-info').innerHTML = '<p>No product found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
} else {
    // Không có postid, để trống phần sản phẩm
    document.getElementById('product-info').innerHTML = '';
}
