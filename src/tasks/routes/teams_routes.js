const { Router } = require("express");
const { createTeam, getAllTeams, removeMemberFromTeam } = require("../controllers/team_controller");

const teamRouter = Router();

// Create a new team
teamRouter.post('/new_team', createTeam);

// Get all teams
teamRouter.get('/', getAllTeams);

// Remove a member from a team
teamRouter.delete('/:teamId/members/:memberId', removeMemberFromTeam);

module.exports = teamRouter;