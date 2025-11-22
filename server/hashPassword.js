const bcrypt = require('bcryptjs');

(async () => {
  const newPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  console.log("Hashed password:", hashedPassword);
})();
