const { Router } = require("express");
const inviteController = require("../controllers/inviteController");
const invitationRouter = Router();

// Create an invitation
invitationRouter.post("/create", inviteController.createInvite);

// Accept an invitation
invitationRouter.post("/:inviteId/accept", inviteController.acceptInvite);

// Decline an invitation
invitationRouter.post("/:inviteId/decline", inviteController.declineInvite);

// Get all invitations for a user
invitationRouter.get("/:userId", inviteController.getUserInvitations);
module.exports = invitationRouter;