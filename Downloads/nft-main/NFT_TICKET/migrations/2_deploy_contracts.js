var NFT_Ticket = artifacts.require("NFT_TICKET");
module.exports = async (deployer, network, addresses) => {
let proxyRegistryAddress = "";
if (network === 'sepolia') {
proxyRegistryAddress = "0xaa4Cd3B7706b1BE52E44d115d4683B49542abF69";
} else {
proxyRegistryAddress = "0xaa4Cd3B7706b1BE52E44d115d4683B49542abF69";
}
await deployer.deploy(NFT_Ticket, proxyRegistryAddress);
}