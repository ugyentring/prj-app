
module.exports = {
  networks: {
    development: {
      host: "host.docker.internal",// Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",
        optimizer: {
          enabled: true,
          runs: 200
        },
      },
    }, 
  db: {
    enabled: false
  }
};