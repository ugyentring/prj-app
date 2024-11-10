const NFT_TICKET = artifacts.require("NFT_TICKET");

contract("NFT_TICKET", (accounts) => {
  let nftTicket;

  beforeEach(async () => {
    // Deploy a new instance of NFT_TICKET before each test
    nftTicket = await NFT_TICKET.new(accounts[0]);
  });

  it("should mint a ticket", async () => {
    await nftTicket.toggleIsMintEnabled(); // Enable minting for the test
    const initialSupply = await nftTicket.totalSupply();
    const tokenId = initialSupply + 1;

    // Mint a ticket
    await nftTicket.mint({ value: await nftTicket.ticketPrice() });

    const newSupply = await nftTicket.totalSupply();
    assert.equal(newSupply.toNumber(), initialSupply.toNumber() + 1, "Total supply should increase by 1");

    const owner = await nftTicket.ownerOf(tokenId);
    assert.equal(owner, accounts[0], "Contract should be the owner of the minted ticket");
  });
  it("should transfer a ticket", async () => {
    await nftTicket.toggleIsMintEnabled(); // Enable minting for the test
    const tokenId = 1; // Assuming there's already a minted ticket with ID 1

    // Mint the ticket
    await nftTicket.mint({ value: await nftTicket.ticketPrice() });

    const buyer = accounts[1];
    const seller = accounts[0];

    // Check the initial owner of the ticket
    const initialOwner = await nftTicket.ownerOf(tokenId);
    assert.equal(initialOwner, seller, "Initial owner should be the seller");

    // Transfer the ticket to the buyer
    await nftTicket.transferFrom(seller, buyer, tokenId, { from: seller });

    // Check the new owner of the ticket
    const newOwner = await nftTicket.ownerOf(tokenId);
    assert.equal(newOwner, buyer, "New owner should be the buyer");
  });
});
