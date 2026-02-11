const generateNickname = (role) => {
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return `${role}${randomNum}`;
};

module.exports = {
  generateNickname
};