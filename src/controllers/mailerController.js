import db from '../config/dbConfig.js';
import transporter from '../config/mailConfig.js';
// import Mailgen from 'mailgen';

const Setting = db.settings;

const signUpMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  try {
    const site = await Setting.findOne({ where: { value: 'site' } });

    // body of the email
    var email = {
      body: {
        name: username,
        intro:
          text || "Welcome to Spooqe! We're very excited to have you on board.",
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    // var emailBody = MailGenerator.generate(email);

    const mailOptions = {
      from: {
        name: site.param1 || process.env.SMPT_MAIL,
        address: site.param2 || process.env.SMPT_MAIL,
      },
      to: userEmail,
      subject: subject,
      html: email, // replace with "html : emailBody" when mailgen is installed
    };

    // send mail
    await transporter
      .sendMail(mailOptions)
      .then(() => {
        return res
          .status(200)
          .send({ msg: 'You should receive an email from us.' });
      })
      .catch((error) => res.status(500).send({ error }));
  } catch (err) {
    return `Error: ${err}`;
  }
};

export default signUpMail;
