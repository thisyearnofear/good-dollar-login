// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title VennNFT
 * @dev ERC721 for minted diagram NFTs with G$ payment and royalty, 10% donation to GoodDAO.
 */
contract VennNFT is ERC721URIStorage, Ownable, ERC2981 {
    IERC20 public immutable goodDollar;
    address public immutable goodDAOWallet;
    uint256 public tokenIdCounter;

    uint256 public constant MINT_PRICE = 10e18; // 10 G$
    uint256 public constant DONATION_BPS = 1000; // 10% (basis points)

    constructor(
        string memory name_,
        string memory symbol_,
        address _goodDollar,
        address _goodDAOWallet,
        uint96 royaltyFeeBps
    ) ERC721(name_, symbol_) {
        require(_goodDollar != address(0), "Zero G$");
        require(_goodDAOWallet != address(0), "Zero DAO wallet");
        goodDollar = IERC20(_goodDollar);
        goodDAOWallet = _goodDAOWallet;
        _setDefaultRoyalty(owner(), royaltyFeeBps);
        tokenIdCounter = 1;
    }

    /**
     * @dev Mint NFT, charge 10 G$ and send 10% to DAO.
     * @param to recipient address
     * @param tokenURI metadata URI (ipfs://cid)
     */
    function mint(address to, string memory tokenURI) external {
        require(
            goodDollar.transferFrom(msg.sender, address(this), MINT_PRICE),
            "Payment failed"
        );
        uint256 donation = (MINT_PRICE * 10) / 100;
        require(goodDollar.transfer(goodDAOWallet, donation), "Donation failed");

        uint256 tokenId = tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    /**
     * @dev Withdraw remaining G$ to owner.
     */
    function withdraw() external onlyOwner {
        uint256 bal = goodDollar.balanceOf(address(this));
        require(goodDollar.transfer(owner(), bal), "Withdraw failed");
    }

    // ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}