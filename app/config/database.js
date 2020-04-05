const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.set('useFindAndModify', false);

require('dotenv').config();

async function connectWithRetry () {
  try {
    // Auto-reconnect only works once we're connected
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/naya-studio',
      {
        useCreateIndex: true
      });
  }
  catch (err) {
    console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
    // Otherwise wee want to try again within a few seconds
    setTimeout(connectWithRetry, 5000);
  }
}

if(process.env.NODE_ENV === 'test') {
  require('mockgoose')(mongoose).then(function() {
    console.log('USING MOCK DATABASE!');
    return mongoose.connect('mongodb://localhost/naya-studio', {
      useCreateIndex: true
    });
  }).catch(function(err) {
    console.log(err);
  });
} else {
  connectWithRetry();
}

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to ' + process.env.MONGO_URI);
});

mongoose.connection.on('error', function () {
  console.error('Mongoose connection error: ' + process.env.MONGO_URI);
});

mongoose.connection.on('disconnected', function () {
  console.error('Mongoose connection disconnected');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});

module.exports = mongoose;
