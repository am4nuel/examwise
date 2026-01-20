const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', 'exam-wise-1c66a-firebase-adminsdk-fbsvc-0ba06d0391.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

class FirebaseService {
  /**
   * Send a push notification to a specific user via their FCM token
   * @param {string} token - The FCM token of the target device
   * @param {string} title - The notification title
   * @param {string} body - The notification body
   * @param {object} data - Optional data payload
   */
  static async sendIndividualNotification(token, title, body, data = {}) {
    if (!token) return { success: false, message: 'No FCM token provided' };

    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: data,
      token: token
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent individual message:', response);
      return { success: true, response };
    } catch (error) {
      if (error.code === 'messaging/registration-token-not-registered') {
        console.warn(`FCM Token not registered (user likely uninstalled or cleared data): ${token}`);
        return { success: false, error: 'Token not registered', invalidToken: true }; // Custom flag
      }
      console.error('Error sending individual message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a push notification to all users (broadcast)
   * @param {string} title - The notification title
   * @param {string} body - The notification body
   * @param {object} data - Optional data payload
   */
  static async sendBroadcastNotification(title, body, data = {}) {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      data: data,
      topic: 'all_users' // Assumes all clients subscribe to 'all_users' topic
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent broadcast message:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Error sending broadcast message:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get app versions from Firestore
   */
  static async getVersions() {
    try {
      const doc = await admin.firestore().collection('versions').doc('current').get();
      if (!doc.exists) {
        // Create default if not exists
        const defaultData = {
          androidCurrentVersion: '1.0.0',
          iosCurrentVersion: '1.0.0',
          playStoreUrl: '',
          appStoreUrl: ''
        };
        await admin.firestore().collection('versions').doc('current').set(defaultData);
        return { success: true, data: defaultData };
      }
      return { success: true, data: doc.data() };
    } catch (error) {
      console.error('Error fetching versions:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update app versions in Firestore
   * @param {object} data - Version data
   */
  static async updateVersions(data) {
    try {
      await admin.firestore().collection('versions').doc('current').set(data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating versions:', error);
      return { success: false, error: error.message };
    }
  }
    
  /**
   * Get support configuration from Firestore
   */
  static async getSupportConfig() {
    try {
      const doc = await admin.firestore().collection('settings').doc('support').get();
      if (!doc.exists) {
        // Create default if not exists
        const defaultData = {
          phoneNumber: '+251799483850',
          email: 'support@examwise.com',
          facebookUrl: 'https://www.facebook.com/share/17YmoN2XvF/',
          telegramUrl: 'https://t.me/exam_wise',
          instagramUrl: 'https://www.instagram.com/exam_wise?igsh=eDNpMTZtYmp1ZDVw',
          websiteUrl: 'example.com'
        };
        await admin.firestore().collection('settings').doc('support').set(defaultData);
        return { success: true, data: defaultData };
      }
      return { success: true, data: doc.data() };
    } catch (error) {
      console.error('Error fetching support config:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update support configuration in Firestore
   * @param {object} data - Support data
   */
  static async updateSupportConfig(data) {
    try {
      await admin.firestore().collection('settings').doc('support').set(data, { merge: true });
      return { success: true };
    } catch (error) {
      console.error('Error updating support config:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get Firebase keys from Firestore
   */
  static async getFirebaseKeys() {
    try {
      const snapshot = await admin.firestore().collection('keys').limit(1).get();
      if (snapshot.empty) {
        return { success: true, data: {} };
      }
      const doc = snapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } };
    } catch (error) {
      console.error('Error fetching firebase keys:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update Firebase keys in Firestore
   * @param {object} data - Key data
   */
  static async updateFirebaseKeys(data) {
    try {
      const { id, ...updateData } = data;
      if (id) {
        await admin.firestore().collection('keys').doc(id).set(updateData, { merge: true });
      } else {
        // Find existing or create new
        const snapshot = await admin.firestore().collection('keys').limit(1).get();
        if (!snapshot.empty) {
          await snapshot.docs[0].ref.set(updateData, { merge: true });
        } else {
          await admin.firestore().collection('keys').add(updateData);
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating firebase keys:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = FirebaseService;
