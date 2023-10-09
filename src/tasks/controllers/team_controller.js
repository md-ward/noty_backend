const Team = require('../models/team_model');
const User = require('../../registeration/models/registering_model');

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, members } = req.body.data;
    console.log(name)
    const teamAdminId = req.user.userId; // Extracting teamAdminId from the request headers
    if (!teamAdminId) {
      throw ('Unauthorized user');
    }

    else {// Create the team with the teamAdminId
      const team = await Team.create({ name, members, teamAdminId });

      // Update the members' teams field
      await User.updateMany(
        { _id: { $in: members } },
        { $push: { teams: team._id } }
      );

      res.status(201).json(team);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};
// Get teams of creator and team members
exports.getAllTeams = async (req, res) => {
  try {
    const teamAdminId = req.user.userId; // Extracting teamAdminId from the request headers

    if (!teamAdminId) {
      throw ('Unauthorized user');
    } else {
      // Find the teams where the teamAdminId is the creator or one of the members
      const teams = await Team.find({
        $or: [
          { teamAdminId }, // Teams created by the user
          { members: { $in: [teamAdminId] } } // Teams that the user is a member of
        ]
      }).populate('members', 'name').populate('teamAdminId', 'name -_id');

     
        const modifiedTeams = teams.map((team) => ({
          teamId: team._id,
          teamName: team.name,
          members: team.members
        }));

        res.status(200).json(modifiedTeams);
      
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};
// Remove a member from a team
exports.removeMemberFromTeam = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const teamAdminId = req.user.userId; // Extracting teamAdminId from the request headers
    if (!teamAdminId) {
      throw ('Unauthorized user');
    }
    else {
      // Find the team owned by the current team admin and remove the member
      const team = await Team.findOneAndUpdate(
        { _id: teamId, teamAdminId },
        { $pull: { members: memberId } },
        { new: true }
      );

      // Update the member's teams field
      await User.findByIdAndUpdate(memberId, { $pull: { teams: teamId } });

      if (!team) {
        return res.status(404).json({ message: 'Team not found or you are not authorized.' });
      }

      res.json(team);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};