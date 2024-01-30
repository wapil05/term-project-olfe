global.setImmediate = (callback) => setTimeout(callback, 0);
require('jest-fetch-mock').enableMocks()