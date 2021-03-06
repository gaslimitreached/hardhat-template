// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Custom Errors
/// @dev attempted to set baseURI after already being set.
error BaseUriAlreadySet();
/// @dev attempted to mint more than allowed.
error InvalidAmount();
/// @dev message value is not price * num.
error InvalidValue();
/// @dev attempted to mint more than the maximum supply.
error MaxSupplyExceeded();
/// @dev attempted action before provenance hash has been set.
error ProvenanceNotSet();
/// @dev attempted to set provenance hash after already being set.
error ProvenanceAlreadySet();

/// @dev This is an example ERC721 contract
contract ProbablyNothing is ERC721, Ownable {
    event SupplyIncreased(uint256 to);

    using Address for address;

    string public provenance;

    string public baseURI;

    uint256 public max;
    uint256 public price;

    uint256 internal supply;

    constructor(uint256 _max, uint256 _price)
        ERC721("ProbablyNothing", "PROBSNOT")
    {
        max = _max;
        price = _price;
    }

    /// @dev releases the balance of the contract to the owner
    function release() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    /// @dev Mint a token
    /// @param num number of tokens to mint
    function mint(uint256 num) external payable {
        if (bytes(provenance).length == 0) revert ProvenanceNotSet();
        if (num > 2 || num < 1) revert InvalidAmount();
        if (price * num != msg.value) revert InvalidValue();
        if (supply + num > max) revert MaxSupplyExceeded();

	uint256 previous = supply;
	supply += num;
        for (uint256 i = 0; i < num; i++) {
            _safeMint(msg.sender, previous + i);
        }
	delete previous;
	emit SupplyIncreased(supply);
    }

    /// @dev Set the provenance hash for the collection
    /// @param hash string value of hashed assets
    function setProvenance(string calldata hash) external onlyOwner {
        if (bytes(provenance).length > 0) revert ProvenanceAlreadySet();
        provenance = hash;
    }

    /// @dev One-time set base URI of token
    /// @param uri string value of base uri
    function setBaseURI(string calldata uri) external onlyOwner {
        if (bytes(baseURI).length > 1) revert BaseUriAlreadySet();
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

    function totalSupply() external view returns (uint256) {
        return supply;
    }
}
