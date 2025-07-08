import Group from "../Models/Group.js";
import Message from "../Models/Message.js";

export const createGroup = async (req, res) => {
  const { name, members } = req.body;
  const creator = req.user.id;

  try {
    // Check for duplicate group with same members (basic version)
    const existing = await Group.findOne({
      name,
      members: { $all: [...members, creator], $size: members.length + 1 }
    });

    if (existing) return res.status(400).json({ msg: "Group already exists with same members" });
    const avatarPath = req.file ? `/uploads/groups/${req.file.filename}` : null;
    const group = await Group.create({
      name,
      members: [...members, creator],
      admins: [creator],
      avatar: avatarPath,
    });

    // emit to all members if you want
    req.io.emit("group-created", group);

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: "Failed to create group" });
  }
};


export const addMember = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const requester = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (!group.admins.includes(requester)) {
      return res.status(403).json({ msg: "Only admins can add members" });
    }

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
      req.io.to(groupId).emit("group-updated", group);
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add member" });
  }
};

export const removeMember = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const requester = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (!group.admins.includes(requester)) {
      return res.status(403).json({ msg: "Only admins can remove members" });
    }

    group.members = group.members.filter((id) => id.toString() !== userId);
    await group.save();
    req.io.to(groupId).emit("group-updated", group);

    res.json(group);
  } catch (err) {
    res.status(500).json({ msg: "Failed to remove member" });
  }
};


export const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
