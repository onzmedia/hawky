// Message model placeholder
class Message {
  constructor(id, chatId, senderId, content, type, timestamp) {
    this.id = id;
    this.chatId = chatId;
    this.senderId = senderId;
    this.content = content; // encrypted
    this.type = type; // text, image, audio, emoji
    this.timestamp = timestamp;
  }
}
module.exports = Message;
