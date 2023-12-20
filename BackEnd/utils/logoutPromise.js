const logoutPromise = logout =>
  new Promise((resolve, reject) =>
    logout(error => (error ? reject(error) : resolve()))
  );

module.exports = logoutPromise;
