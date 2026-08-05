const nodemailer = require('nodemailer');

/**
 * Send email helper function
 * @param {Object} options - { email, subject, html }
 */
const sendEmail = async (options) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, FROM_NAME } = process.env;

  // Check if SMTP options are properly configured
  if (SMTP_USER && SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(SMTP_PORT, 10) || 587,
      secure: parseInt(SMTP_PORT, 10) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"${FROM_NAME || 'AuthSecure'}" <${FROM_EMAIL || SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Delivered] Message ID: ${info.messageId} to ${options.email}`);
    return info;
  } else {
    // Development fallback when SMTP credentials are not set
    console.log('\n=================== DEVELOPMENT EMAIL LOG ===================');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log('--- Content Summary ---');
    console.log(options.html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').substring(0, 300));
    console.log('=============================================================\n');
    return { messageId: 'dev-mode-simulated-id' };
  }
};

module.exports = sendEmail;
