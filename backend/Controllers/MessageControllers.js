import Message from '../Models/Message.js';

export const sendMessage = async (req, res) => {
  const { sender, receiver, groupId, encryptedText, type } = req.body;
  const message = await Message.create({ sender, receiver, groupId, encryptedText, type });
  res.json(message);
};

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
};

