# Hawky Chat Backend API Documentation

## Base URL
```
Production: http://YOUR_VPS_IP:3003
Local: http://localhost:3003
```

## Authentication
- JWT tokens for authentication (implementation pending)
- Include token in headers: `Authorization: Bearer <token>`

---

## 🔐 User Authentication Routes

### Register User
- **Endpoint**: `POST /api/users/register`
- **Description**: Register a new user account
- **Request Body**:
```json
{
  "username": "string (required)",
  "password": "string (required)",
  "email": "string (optional)"
}
```
- **Response**:
```json
{
  "message": "Register endpoint",
  "userId": "string",
  "token": "jwt_token"
}
```

### Login User
- **Endpoint**: `POST /api/users/login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```
- **Response**:
```json
{
  "message": "Login endpoint",
  "token": "jwt_token",
  "user": {
    "id": "string",
    "username": "string"
  }
}
```

### Get Current User
- **Endpoint**: `GET /api/users/me`
- **Description**: Get current logged-in user info
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "message": "GetMe endpoint",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

---

## 💬 Message Routes

### Send Message
- **Endpoint**: `POST /api/messages`
- **Description**: Send a message to a chat
- **Request Body**:
```json
{
  "chatId": "string (required)",
  "senderId": "string (required)",
  "content": "string (required)",
  "type": "text|image|audio|emoji (required)",
  "timestamp": "ISO string (optional)"
}
```
- **Response**:
```json
{
  "message": "SendMessage endpoint",
  "messageId": "string",
  "success": true
}
```

### Get Messages
- **Endpoint**: `GET /api/messages/:chatId`
- **Description**: Get all messages for a specific chat
- **Parameters**: `chatId` - Chat room identifier
- **Response**:
```json
{
  "message": "GetMessages endpoint",
  "messages": [
    {
      "id": "string",
      "chatId": "string",
      "senderId": "string",
      "content": "string",
      "type": "text|image|audio|emoji",
      "timestamp": "ISO string",
      "encrypted": true
    }
  ]
}
```

---

## 📁 Media Routes

### Upload Media
- **Endpoint**: `POST /api/media/upload`
- **Description**: Upload image or audio file
- **Content-Type**: `multipart/form-data`
- **Form Data**:
```
file: File (image/audio)
chatId: string (optional)
```
- **Response**:
```json
{
  "message": "UploadMedia endpoint",
  "file": {
    "filename": "string",
    "originalname": "string",
    "mimetype": "string",
    "size": "number",
    "url": "/uploads/filename"
  }
}
```

### Get Media
- **Endpoint**: `GET /api/media/:filename`
- **Description**: Download/view uploaded media file
- **Parameters**: `filename` - File name to retrieve
- **Response**: Binary file data

---

## 🔌 Socket.io Real-time Events

### Connection
```javascript
const socket = io('http://YOUR_VPS_IP:3003');
```

### Events to Emit (Client → Server)

#### Join Chat Room
```javascript
socket.emit('joinChat', chatId);
```
- **Parameter**: `chatId` (string) - Chat room to join

#### Send Real-time Message
```javascript
socket.emit('sendMessage', {
  chatId: "string",
  senderId: "string", 
  content: "string",
  type: "text|image|audio|emoji",
  timestamp: "ISO string"
});
```

### Events to Listen (Server → Client)

#### Receive Message
```javascript
socket.on('receiveMessage', (data) => {
  // Handle incoming message
  console.log(data);
});
```
- **Data Structure**:
```json
{
  "chatId": "string",
  "senderId": "string",
  "content": "string", 
  "type": "text|image|audio|emoji",
  "timestamp": "ISO string"
}
```

#### Connection Events
```javascript
socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

---

## 📱 Flutter Integration Example

### HTTP Client Setup
```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'http://YOUR_VPS_IP:3003';
  
  // Register user
  static Future<Map<String, dynamic>> register(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/users/register'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'username': username,
        'password': password,
      }),
    );
    return json.decode(response.body);
  }
  
  // Send message
  static Future<Map<String, dynamic>> sendMessage(String chatId, String senderId, String content) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/messages'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'chatId': chatId,
        'senderId': senderId,
        'content': content,
        'type': 'text',
      }),
    );
    return json.decode(response.body);
  }
}
```

### Socket.io Client Setup
```dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  static const String socketUrl = 'http://YOUR_VPS_IP:3003';
  late IO.Socket socket;
  
  void connect() {
    socket = IO.io(socketUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    
    socket.connect();
    
    socket.on('connect', (_) {
      print('Connected to server');
    });
    
    socket.on('receiveMessage', (data) {
      print('Received message: $data');
      // Handle incoming message in your app
    });
  }
  
  void joinChat(String chatId) {
    socket.emit('joinChat', chatId);
  }
  
  void sendMessage(Map<String, dynamic> message) {
    socket.emit('sendMessage', message);
  }
}
```

---

## 🔒 Security Features (To Implement)

### End-to-End Encryption
- Messages encrypted before sending
- Only client devices can decrypt
- Server stores encrypted data only

### Authentication Flow
1. User registers/logs in
2. Server returns JWT token
3. Include token in all API requests
4. Token expires after set time

### Message Security
- All messages encrypted with AES-256
- Unique keys per chat session
- Forward secrecy implementation

---

## 📋 Testing Commands

### Test API Endpoints
```bash
# Register
curl -X POST http://YOUR_VPS_IP:3003/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Send Message  
curl -X POST http://YOUR_VPS_IP:3003/api/messages \
  -H "Content-Type: application/json" \
  -d '{"chatId":"chat123","senderId":"user1","content":"Hello","type":"text"}'

# Get Messages
curl http://YOUR_VPS_IP:3003/api/messages/chat123
```

### Test Socket.io
```bash
node -e "
const io = require('socket.io-client');
const socket = io('http://YOUR_VPS_IP:3003');
socket.on('connect', () => {
  console.log('Connected');
  socket.emit('joinChat', 'test');
  socket.emit('sendMessage', {
    chatId: 'test',
    senderId: 'user1', 
    content: 'Hello Socket.io!',
    type: 'text'
  });
});
socket.on('receiveMessage', console.log);
"
```

---

## 🚀 Deployment Info

- **Server**: Running on PM2 for auto-restart
- **Port**: 3003
- **Environment**: Production ready
- **Monitoring**: `pm2 logs hawky-backend`
- **Status**: `pm2 status`

Replace `YOUR_VPS_IP` with your actual VPS IP address before using in Flutter app.
