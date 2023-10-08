import db from '../config/dbConfig.js';
import transporter from '../config/mailConfig.js';

const Setting = db.settings;
const User = db.users;

const sendMail = async (mail) => {
  try {
    const site = await Setting.findOne({ where: { value: 'site' } });
    const user = await User.findByPk(mail.user);

    const mailOptions = {
      from: {
        name: site.param1,
        address: site.param2,
      },
      to: user ? user.email : mail.email,
      subject: mail.subject,
      html: mail.message,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return null;
      }
      return 'Success';
    });
    return 'Success';
  } catch (err) {
    return `Error: ${err}`;
  }
};

export default sendMail;
