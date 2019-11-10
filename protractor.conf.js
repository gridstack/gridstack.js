exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['spec/e2e/*-spec.js'],
  capabilities: {
    browserName: 'firefox',
    version: '',
    platform: 'ANY',
    loggingPrefs: {
      browser: 'SEVERE'
    }
  },
};
