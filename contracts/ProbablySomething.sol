// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProbablySomething is ERC721, Ownable {
    using Address for address;

    // pudding
    string public PROVENANCE;

    // how centralized are we?
    string public baseURI;

    uint256 public MAX_SUPPLY;
    uint256 public PRICE;

    uint16 internal _totalSupply;

    constructor(uint256 max, uint256 price)
        ERC721("ProbablyNothing", "PROBSNOT")
    {
        MAX_SUPPLY = max;
        PRICE = price;
    }

    // @dev throw unless provenance set
    modifier whenProvincial() {
        require(bytes(PROVENANCE).length > 0, "Provenance not set");
        _;
    }

    function release() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function mint(uint256 num) public payable whenProvincial {
        require(num > 0 && num < 3, "Invalid amount");
        require(_totalSupply + num <= MAX_SUPPLY, "Exceeds max supply");
        require(PRICE * num == msg.value, "Invalid value");

        for (uint256 i; i < num; i++) {
            _totalSupply++;
            _safeMint(msg.sender, _totalSupply);
        }
    }

    function setProvenance(string memory provenance) public onlyOwner {
        require(bytes(PROVENANCE).length == 0, "Provenance set");
        PROVENANCE = provenance;
    }

    function setBaseURI(string memory uri) public onlyOwner {
        require(bytes(baseURI).length < 1, "Already set");
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
        return string(abi.encodePacked(super.tokenURI(tokenId), ".json"));
    }

    function totalSupply() public view returns (uint16) {
        return _totalSupply;
    }
}
