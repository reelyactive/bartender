var DB_CONFIGURATION = {
  HOST: 'localhost',
  PORT: '27017',
  DATABASE: 'bartender',
  opts: {
    server: {
      poolSize: 5
    },
    user : '',
    pass: ''
  }
};

module.exports = DB_CONFIGURATION;