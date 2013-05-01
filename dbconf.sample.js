var DB_CONFIGURATION = {
  HOST: 'localhost',
  PORT: '27017',
  DATABASE: 'bartender',
  OPTIONS: {
    server: {
      poolSize: 5,
      socketOptions: {
        keeepAlive: 1
      }
    },
    user : '',
    pass: ''
  }
};

module.exports = DB_CONFIGURATION;