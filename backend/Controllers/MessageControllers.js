import Message from '../Models/Message.js';

// 📨 Send message (1-to-1 or group)
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, groupId, encryptedText, type } = req.body;

    // Create message (receiver OR groupId must be present)
    const message = await Message.create({
      sender,
      receiver: receiver || null,
      groupId: groupId || null,
      encryptedText,
      type,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error('Send Message Error:', err.message);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// 📥 Get 1-to-1 chat history
export const getPrivateMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Get Private Messages Error:', err.message);
    res.status(500).json({ error: 'Failed to load messages' });
  }
};

// 👥 Get group chat history
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Get Group Messages Error:', err.message);
    res.status(500).json({ error: 'Failed to load group messages' });
  }
};
