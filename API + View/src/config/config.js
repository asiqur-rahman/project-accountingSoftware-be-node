const config = require('../../config/config.json');
module.exports.dbConfig = {
    host: config.development.host,
    user: config.development.username,
    pass: config.development.password,
    dbname: config.development.database,
    dialect: config.development.dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

module.exports.appConfig = {
  SECRET_KEY: 'Asiq Application',
  SECRET_JWT: 'Asiq Application',
  SessionTimeOut: 60 * 60 * 1000 * 6, //6Hours
  FaceVerificationConfidence:config.brainTechSolution_Setting.faceVerificationConfidence,
  httpsRedirection:config.brainTechSolution_Setting.httpsRedirection,
  runHttps:config.brainTechSolution_Setting.runHttps
};

module.exports.organizationInfo = {
  orgName: config.organizationInfo.orgName,
  devOrgName: config.organizationInfo.devOrgName,
  devOrgLink: config.organizationInfo.devOrgLink
};

module.exports.emailSetting = {
  name: config.emailSettings.name,
  host: config.emailSettings.host,
  port: config.emailSettings.port,
  email: config.emailSettings.email,
  password: config.emailSettings.password
};