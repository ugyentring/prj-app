// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract NFT_TICKET is ERC721URIStorage, Ownable {
    struct Ticket {
    uint256 tokenId;
    string eventId;
    string tokenUri;
    }
    string public currentEventID;
    uint256 public totalSupply;
    uint256 public ticketCount;
    bool public isMintEnabled;
    uint256 public ticketPrice;
    string public baseTokenURI;
    string public contractURI = "https://api.npoint.io/a8766d3f38484c5496eb";
    address public proxyRegistryAddress;
    mapping(uint256 => address) public ticketBuyers;
    mapping(uint256 => Ticket) public tokenIdToDetails;
    mapping(string => uint256) public eventIDToTokenCounter;
    mapping(string => uint256[]) public eventIDToTokenIds;

    event TicketMinted(address indexed buyer, uint256 indexed tokenId,string indexed eventID);
    event TicketPurchased(
        address indexed buyer,
        address indexed seller,
        uint256 indexed tokenId);
    event TicketTransfered(
        address indexed sender,
        address indexed receiver,
        uint256 indexed tokenId
    );

    constructor(
        address _proxyRegistryAddress
    ) payable ERC721("DIGI_Token", "DGT") Ownable() {
        ticketCount=0;
        currentEventID ="1";
        baseTokenURI = "https://api.npoint.io/ad21034fd9f52d8c15b7";
        proxyRegistryAddress = _proxyRegistryAddress;
        ticketPrice = 0.001 ether;
    }

    function toggleIsMintEnabled() external {
        isMintEnabled = !isMintEnabled;
    }
    function mint() external payable {
    // require(isMintEnabled, "minting not enabled");
    require(bytes(currentEventID).length > 0, "Current event not set");
    uint256 tokenId = eventIDToTokenCounter[currentEventID] + 1;
    eventIDToTokenCounter[currentEventID] = tokenId;
    eventIDToTokenIds[currentEventID].push(tokenId);
    totalSupply++;
    ticketCount++;
    string memory tokenUri = string(
        abi.encodePacked(baseTokenURI, "/", Strings.toString(tokenId))
    );
    
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenUri);
    ticketBuyers[tokenId] = msg.sender;
    tokenIdToDetails[tokenId] = Ticket(tokenId, currentEventID, tokenUri);
    emit TicketMinted(msg.sender, tokenId, currentEventID);
}


    function getBuyerInfo(uint256 tokenId) external view returns (address) {
        require(tokenId > 0 && tokenId <= totalSupply, "Invalid Token ID");
        return ticketBuyers[tokenId];
    }

    function purchaseTicket(uint256 tokenId) external payable {
        // require(isMintEnabled, "Minting not enabled");
        require(tokenId > 0 && tokenId <= totalSupply, "Invalid Token ID");
        address seller = ownerOf(tokenId);
        require(seller != address(0), "Invalid seller");
        require(msg.sender != seller, "You already own this ticket");
        require(msg.value > 0, "No funds provided");
        require(msg.value >= ticketPrice, "Insufficient funds");
        // Transfer ownership from the seller to the buyer
        _transfer(seller, msg.sender, tokenId);
        // Transfer funds to the seller
        payable(seller).transfer(ticketPrice);

        ticketBuyers[tokenId] = msg.sender;
        ticketCount--;

        emit TicketPurchased(msg.sender, seller, tokenId);
    }
    function transferTicket(address _to, uint256 tokenId) external{
        address seller = ownerOf(tokenId);
        _transfer(seller,_to,tokenId);
        emit TicketTransfered(msg.sender,_to,tokenId);
    }
     function getTicketDetails(uint256 tokenId)
        external
        view
        returns (uint256, string memory, string memory)
    {
        require(tokenId > 0 && tokenId <= totalSupply, "Invalid Token ID");

        // Find the eventID associated with the tokenId
        string memory eventId = "";
        for (uint256 i = 1; i <= totalSupply; i++) {
            for (
                uint256 j = 0;
                j < eventIDToTokenIds[Strings.toString(i)].length;
                j++
            ) {
                if (eventIDToTokenIds[Strings.toString(i)][j] == tokenId) {
                    eventId = Strings.toString(i);
                    break;
                }
            }
        }

        // Get the tokenURI associated with the tokenId
        string memory tokenUri = tokenURI(tokenId);

        return (tokenId, eventId, tokenUri);
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(baseTokenURI, "/", Strings.toString(_tokenId))
            );
    }

    function getContractURI() public view returns (string memory) {
        return contractURI;
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
    // Whitelist OpenSea proxy contract for easy trading.
    ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
    if (address(proxyRegistry.proxies(owner)) == operator) {
        return true;
    }
    return super.isApprovedForAll(owner, operator);
}
}
