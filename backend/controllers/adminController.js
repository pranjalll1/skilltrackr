const User = require('../models/User');
const Assessment = require('../models/Assessment');

const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const completedAssessments = await Assessment.countDocuments({ completed: true });
    
    const recentUsers = await User.find().select('-password').sort('-createdAt').limit(5);

    res.json({
      totalUsers,
      totalAssessments,
      completedAssessments,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin) return res.status(400).json({ message: 'Cannot delete admin users' });

    await Assessment.deleteMany({ user: user._id });
    await user.deleteOne();
    res.json({ message: 'User and their data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlatformStats, deleteUser };
