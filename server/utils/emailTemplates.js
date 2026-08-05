/**
 * HTML Email Templates with sleek, modern UI styling
 */

const baseEmailStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f8fafc;
  margin: 0;
  padding: 40px 20px;
  color: #1e293b;
`;

const containerStyle = `
  max-width: 560px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid #e2e8f0;
`;

const logoHeader = `
  <div style="text-align: center; margin-bottom: 32px;">
    <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: linear-gradient(135deg, #2563eb, #4f46e5); border-radius: 12px; color: #ffffff; font-weight: bold; font-size: 22px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
      S
    </div>
    <h2 style="margin: 12px 0 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px;">AuthSecure</h2>
  </div>
`;

const footerStyle = `
  <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9; text-align: center; color: #94a3b8; font-size: 13px; line-height: 1.5;">
    <p style="margin: 0 0 8px;">If you didn't request this email, please ignore it or contact our support.</p>
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} AuthSecure Systems Inc. All rights reserved.</p>
  </div>
`;

/**
 * OTP Verification Email Template
 */
const getVerificationEmailTemplate = (name, otp) => {
  return `
    <div style="${baseEmailStyle}">
      <div style="${containerStyle}">
        ${logoHeader}
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-align: center;">Verify Your Email Address</h1>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 28px;">Thank you for registering with AuthSecure. Please use the following 6-digit One-Time Password (OTP) to verify your account. This code is valid for <strong>5 minutes</strong>.</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 14px; padding: 18px 36px; font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #1d4ed8;">
            ${otp}
          </div>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 16px; background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          🔒 <strong>Security Tip:</strong> Never share this code with anyone. AuthSecure staff will never ask for your OTP.
        </p>

        ${footerStyle}
      </div>
    </div>
  `;
};

/**
 * Password Reset OTP Email Template
 */
const getPasswordResetTemplate = (name, otp) => {
  return `
    <div style="${baseEmailStyle}">
      <div style="${containerStyle}">
        ${logoHeader}
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-align: center;">Reset Your Password</h1>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 28px;">We received a request to reset your password. Use the OTP code below to verify your identity and reset your account password. This code will expire in <strong>5 minutes</strong>.</p>
        
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background: #fef2f2; border: 2px dashed #ef4444; border-radius: 14px; padding: 18px 36px; font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #dc2626;">
            ${otp}
          </div>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 16px; background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #ef4444;">
          ⚠️ If you did not request a password reset, your account is still secure. No action is required.
        </p>

        ${footerStyle}
      </div>
    </div>
  `;
};

/**
 * Welcome Email Template (Post verification)
 */
const getWelcomeEmailTemplate = (name) => {
  return `
    <div style="${baseEmailStyle}">
      <div style="${containerStyle}">
        ${logoHeader}
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-align: center;">Welcome to AuthSecure! 🎉</h1>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">Your email address has been successfully verified, and your account is now fully active!</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px; font-size: 16px; color: #166534; font-weight: 600;">What you can do now:</h3>
          <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 1.6;">
            <li>Access your personal dashboard</li>
            <li>Manage profile settings & avatars</li>
            <li>Enjoy high-security enterprise authentication</li>
          </ul>
        </div>

        ${footerStyle}
      </div>
    </div>
  `;
};

/**
 * Password Changed Notification Email Template
 */
const getPasswordChangedTemplate = (name) => {
  return `
    <div style="${baseEmailStyle}">
      <div style="${containerStyle}">
        ${logoHeader}
        <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px; text-align: center;">Password Changed Successfully</h1>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">This email confirms that the password for your AuthSecure account was recently changed.</p>
        
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
            If you made this change, you can safely ignore this email. If you did <strong>NOT</strong> change your password, please contact security immediately to secure your account.
          </p>
        </div>

        ${footerStyle}
      </div>
    </div>
  `;
};

module.exports = {
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
  getWelcomeEmailTemplate,
  getPasswordChangedTemplate
};
