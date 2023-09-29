const User = require("../../registeration/models/registering_model");
const Team = require("../../tasks/models/team_model");
const Invitation = require("../models/invitations_model");

// Create an invitation
exports.createInvite = async (req, res) => {
  try {
    const { senderId, recipientId, teamId } = req.body;

    const invite = new Invitation({
      senderId,
      recipientId,
      teamId,
    });

    await invite.save();

    res.json(invite);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the invitation." });
  }
};

// Accept an invitation
exports.acceptInvite = async (req, res) => {
  try {
    const inviteId = req.params.inviteId;

    const invitation = await Invitation.findById(inviteId);

    if (!invitation) {
      return res.status(404).json({ error: "Invitation not found." });
    }

    const { senderId, recipientId, teamId } = invitation;

    // Add the user to the team
    const user = await User.findById(recipientId);
    const team = await Team.findById(teamId);

    if (!user || !team) {
      return res.status(404).json({ error: "User or team not found." });
    }

    // Check if the user is already a member of the team
    if (team.members.includes(recipientId)) {
      return res.status(400).json({ error: "User is already a member of the team." });
    }

    // Initialize the arrays if they are undefined
    user.teams = user.teams || [];
    team.members = team.members || [];

    // Update the user's teams and the team's members
    user.teams.push(teamId);  
    team.members.push(recipientId);

    await user.save();
    await team.save();

    // Delete the invitation
    await Invitation.findByIdAndDelete(inviteId);

    res.json({ message: "Invitation accepted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept the invitation." });
  }
};
// Decline an invitation
exports.declineInvite = async (req, res) => {
  try {
    const inviteId = req.params.inviteId;

    await Invitation.findByIdAndDelete(inviteId);

    res.json({ message: "Invitation declined successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to decline the invitation." });
  }
};

// Get all invitations for a user
exports.getUserInvitations = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId)

    const invitations = await Invitation.find({ recipientId: userId });

    res.json(invitations);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user invitations." });
  }
};