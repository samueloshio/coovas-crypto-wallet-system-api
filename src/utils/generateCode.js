const generateCode = async () => {
  try {
    // GENERATE 6 RANDOM NUMBERS
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    return otp;
  } catch (error) {
    throw error;
  }
};

export default generateCode;
