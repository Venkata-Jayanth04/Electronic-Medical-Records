const HealthSystem = artifacts.require("HealthSystem");

module.exports = function (deployer) {
  deployer.deploy(HealthSystem);
};