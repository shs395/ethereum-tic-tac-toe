const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
  networks: {
    // ganache 
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
  }
};
