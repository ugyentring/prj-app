var StudentRecord = artifacts.require("./StudentRecord.sol");
module.exports = function (deployer) {
    deployer.deploy(StudentRecord);
};