// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/// @dev This is an example ERC721 contract
contract ProbablyNothing is ERC721, Ownable {
    using Address for address;

    // pudding
    string public PROVENANCE;

    // how centralized are we?
    string public baseURI;

    uint256 public MAX_SUPPLY;
    uint256 public PRICE;

    uint256 internal _totalSupply;

    constructor(uint256 max, uint256 price)
        ERC721('ProbablyNothing', 'PROBSNOT')
    {
        MAX_SUPPLY = max;
        PRICE = price;
    }

    /// @dev prevents action unless provenance hash is set
    modifier whenProvincial() {
        require(bytes(PROVENANCE).length > 0, 'Provenance not set');
        _;
    }

    /// @dev releases the balance of the contract to the owner
    function release() public onlyOwner {
        uint256 balance = address(this).balance;
        // TODO: require success status
        payable(owner()).transfer(balance);
    }

    /// @dev Mint a token
    /// @param num number of tokens to mint
    function mint(uint256 num) public payable whenProvincial {
        require(num > 0 && num < 3, 'Invalid amount');
        require(_totalSupply + num <= MAX_SUPPLY, 'Exceeds max supply');
        require(PRICE * num == msg.value, 'Invalid value');

        for (uint256 i; i < num; i++) {
            _totalSupply++;
            _safeMint(msg.sender, _totalSupply);
        }
    }

    /// @dev Set the provenance hash for the collection
    /// @param provenance string value of hashed assets
    function setProvenance(string memory provenance) public onlyOwner {
        // TODO: bytes32 this?
        require(bytes(PROVENANCE).length == 0, 'Provenance set');
        PROVENANCE = provenance;
    }

    /// @dev One-time set base URI of token
    /// @param uri string value of base uri
    function setBaseURI(string memory uri) public onlyOwner {
        require(bytes(baseURI).length < 1, 'Already set');
        baseURI = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        return string(abi.encodePacked(super.tokenURI(tokenId), '.json'));
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
}
