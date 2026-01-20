const axios = require('axios');

class PaymentService {
  /**
   * Verifies a Chapa transaction using its reference number.
   * Documentation: https://developer.chapa.co/docs/verify-payment/
   */
  static async verifyTransaction(txRef) {
    try {
      const secretKey = process.env.CHAPA_SECRET_KEY;
      
      const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`
        }
      });

      if (response.data && response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Verification failed'
      };
    } catch (error) {
      console.error('Chapa Verification Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Initiates a transfer to a bank account.
   * Documentation: https://developer.chapa.co/transfer/transfers
   */
  static async initiateTransfer(transferData) {
    try {
      const secretKey = process.env.CHAPA_SECRET_KEY?.trim();
      
      const response = await axios.post('https://api.chapa.co/v1/transfers', transferData, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.status === 'success') {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Transfer initiation failed'
      };
    } catch (error) {
      console.error('Chapa Transfer Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Fetches the list of supported banks.
   * Documentation: https://developer.chapa.co/transfer/list-banks
   */
  static async getBanks() {
    try {
      const secretKey = process.env.CHAPA_SECRET_KEY?.trim();
      if (!secretKey) {
        console.error('CHAPA_SECRET_KEY is missing in environment variables');
        return { success: false, message: 'Payment configuration error' };
      }

      const response = await axios.get('https://api.chapa.co/v1/banks', {
        headers: {
          Authorization: `Bearer ${secretKey}`
        }
      });

      // Note: Chapa Banks API sometimes returns { message, data } without a 'status' field
      if (response.data && (response.data.status === 'success' || response.data.data)) {
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: false,
        message: 'Failed to fetch banks'
      };
    } catch (error) {
      console.error('Chapa Get Banks Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  /**
   * Verifies a transfer status.
   * Documentation: https://developer.chapa.co/transfer/verify-transfers
   */
  static async verifyTransfer(reference) {
    try {
      const secretKey = process.env.CHAPA_SECRET_KEY?.trim();
      const response = await axios.get(`https://api.chapa.co/v1/transfers/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`
        }
      });

      if (response.data && response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data
        };
      }

      return {
        success: false,
        message: response.data?.message || 'Transfer verification failed'
      };
    } catch (error) {
      console.error('Chapa Transfer Verify Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Validates a transfer OTP.
   * Documentation: https://developer.chapa.co/transfer/transfers#otp-approval
   */
  static async validateOTP(otp, reference) {
    try {
      const secretKey = process.env.CHAPA_SECRET_KEY?.trim();
      const response = await axios.post('https://api.chapa.co/v1/transfers/OTP-validate', {
        otp,
        reference
      }, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.status === 'success') {
        return {
          success: true,
          message: response.data.message,
          data: response.data.data
        };
      }

      return {
        success: false,
        message: response.data?.message || 'OTP validation failed'
      };
    } catch (error) {
      console.error('Chapa OTP Validate Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
}

module.exports = PaymentService;
