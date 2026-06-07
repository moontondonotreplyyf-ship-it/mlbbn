const mlbbService = require('../services/mlbbService');

// Check Ban Status
exports.checkBanStatus = async (req, res) => {
  try {
    const { user_id, username } = req.query;

    if (!user_id && !username) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide user_id or username'
      });
    }

    const result = await mlbbService.checkBanStatus(user_id || username);
    
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('Error checking ban status:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to check ban status'
    });
  }
};

// Get Ban History
exports.getBanHistory = async (req, res) => {
  try {
    const { user_id, limit = 10 } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide user_id'
      });
    }

    const history = await mlbbService.getBanHistory(user_id, limit);
    
    res.json({
      status: 'success',
      data: history
    });
  } catch (error) {
    console.error('Error getting ban history:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get ban history'
    });
  }
};

// Get Account Info
exports.getAccountInfo = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide user_id'
      });
    }

    const info = await mlbbService.getAccountInfo(user_id);
    
    res.json({
      status: 'success',
      data: info
    });
  } catch (error) {
    console.error('Error getting account info:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to get account info'
    });
  }
};

// Report Ban
exports.reportBan = async (req, res) => {
  try {
    const { user_id, reason, evidence } = req.body;

    if (!user_id || !reason) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide user_id and reason'
      });
    }

    const report = await mlbbService.reportBan({
      user_id,
      reason,
      evidence,
      reported_at: new Date()
    });
    
    res.status(201).json({
      status: 'success',
      message: 'Ban report submitted successfully',
      data: report
    });
  } catch (error) {
    console.error('Error reporting ban:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to submit ban report'
    });
  }
};