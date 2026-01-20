const { Notification } = require('../models');

class NotificationService {
  /**
   * Create a notification for admins
   * @param {string} title - Notification title
   * @param {string} message - Notification body
   * @param {string} type - 'info', 'success', 'warning', 'error'
   * @param {string} link - Optional link to navigate to
   */
  static async notifyAdmin(title, message, type = 'info', link = null) {
    try {
      await Notification.create({
        title,
        message,
        type,
        actionLink: link,
        forAdmin: true,
        isPublic: false,
        isRead: false
      });
      console.log(`[Notification] Admin alerted: ${title}`);
    } catch (error) {
      console.error('[Notification] Failed to create admin notification:', error);
    }
  }

  /**
   * Create a public announcement for all users
   */
  static async createAnnouncement(title, message, type = 'announcement') {
    try {
      await Notification.create({
        title,
        message,
        type,
        forAdmin: false,
        isPublic: true
      });
    } catch (error) {
      console.error('[Notification] Failed to create announcement:', error);
    }
  }
}

module.exports = NotificationService;
