// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Boat Interface
 * @dev Defines the standard interface for Boat contracts
 */
interface IBoat {
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Receive(address indexed owner, address indexed spender, uint256 value);
    event Mint(bytes32 tokenHash);
    event DebugLog(string message, bytes32 tokenHash, uint256 tokenId);
    event LockStatusChanged(bool locked); // Lock status change event
    
    // View functions
    function name() external view returns (string memory);
    function getToken(uint id) external view returns (bytes32 tokenHash);
    function numTokens() external view returns (uint256);
    function owner() external view returns (address);
    function isLocked() external view returns (bool); // Lock status check
    function tokenExists(uint256 tokenId) external view returns (bool); // Token exists check
    
    // State-changing functions
    function mint(bytes32 tokenHash, string memory metadataURI) external;
    function send(uint tokenId, address to) external;
    function _receive(bytes32 tokenHash) external;
    function lock() external; // Lock function
    function unlock() external; // Unlock function
}

/**
 * @title BoatFactory Interface
 * @dev Interface for the BoatFactory contract to be used by Boat contracts
 */
interface IBoatFactory {
    function isBoat(address boatAddress) external view returns (bool);
}

/**
 * @title Boat Contract
 * @dev Implementation of the Boat interface with locking feature
 */
contract Boat is IBoat {
    string private _name;
    address private _owner;
    address private _factoryAddress;
    bool private _locked; // Lock state
    
    struct Token {
        bytes32 tokenHash;
        string metadataURI;
        bool exists;
    }
    
    // Mapping from token ID to Token struct
    mapping(uint => Token) private _tokens;
    
    // Total number of tokens
    uint256 private _tokenCount;
    
    // Mapping from token hash to token ID for quick lookups
    mapping(bytes32 => uint) private _tokenHashToId;
    
    /**
     * @dev Constructor sets the name, owner, and factory address
     * @param boatName Name of the boat contract
     * @param initialOwner Address of the boat owner
     * @param factoryAddress Address of the factory that created this boat
     */
    constructor(string memory boatName, address initialOwner, address factoryAddress) {
        _name = boatName;
        _owner = initialOwner;
        _factoryAddress = factoryAddress;
        _locked = false; // Unlocked by default
    }
    
    /**
     * @dev Modifier to check if caller is the owner
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, "Boat: caller is not the owner");
        _;
    }
    
    /**
     * @dev Returns the name of the boat
     */
    function name() external view override returns (string memory) {
        return _name;
    }
    
    /**
     * @dev Returns the token hash for a given token ID
     * @param id Token ID to query
     */
    function getToken(uint id) external view override returns (bytes32 tokenHash) {
        require(_tokens[id].exists, "Boat: token does not exist");
        return _tokens[id].tokenHash;
    }
    
    /**
     * @dev Returns the total number of tokens
     */
    function numTokens() external view override returns (uint256) {
        return _tokenCount;
    }
    
    /**
     * @dev Returns the owner of the boat contract
     */
    function owner() external view override returns (address) {
        return _owner;
    }
    
    /**
     * @dev Returns whether the boat is locked for receives
     */
    function isLocked() external view override returns (bool) {
        return _locked;
    }
    
    /**
     * @dev Checks if a token exists by its ID
     * @param tokenId ID to check
     * @return True if the token exists
     */
    function tokenExists(uint256 tokenId) external view override returns (bool) {
        return _tokens[tokenId].exists;
    }
    
    /**
     * @dev Locks the boat to prevent receiving tokens
     * @notice Once locked, the boat cannot receive tokens until unlocked
     */
    function lock() external override onlyOwner {
        require(!_locked, "Boat: already locked");
        _locked = true;
        emit LockStatusChanged(true);
    }
    
    /**
     * @dev Unlocks the boat to allow receiving tokens
     */
    function unlock() external override onlyOwner {
        require(_locked, "Boat: already unlocked");
        _locked = false;
        emit LockStatusChanged(false);
    }
    
    /**
     * @dev Creates a new token with the given hash and metadata URI
     * @param tokenHash Hash of the file
     * @param metadataURI Link to the metadata
     */
    function mint(bytes32 tokenHash, string memory metadataURI) external override onlyOwner {
        require(tokenHash != bytes32(0), "Boat: token hash cannot be zero");
        require(bytes(metadataURI).length > 0, "Boat: metadata URI cannot be empty");
        
        // Check if the hash already exists
        uint existingId = _tokenHashToId[tokenHash];
        if (existingId != 0) {
            require(!_tokens[existingId].exists, "Boat: token with this hash already exists");
        }
        
        uint newTokenId = _tokenCount;
        _tokens[newTokenId] = Token(tokenHash, metadataURI, true);
        _tokenHashToId[tokenHash] = newTokenId;
        _tokenCount++;
        
        emit Mint(tokenHash);
        emit DebugLog("Token minted", tokenHash, newTokenId);
    }
    
    /**
     * @dev Sends a token to another Boat contract
     * @param tokenId ID of the token to send
     * @param to Address of the recipient Boat contract
     */
    function send(uint tokenId, address to) external override onlyOwner {
        require(_tokens[tokenId].exists, "Boat: token does not exist");
        require(to != address(0), "Boat: cannot send to zero address");
        require(to != address(this), "Boat: cannot send to self");
        
        bytes32 tokenHash = _tokens[tokenId].tokenHash;
        
        // Verify destination is a valid Boat if factory address is set
        if (_factoryAddress != address(0)) {
            bool isValidBoat = IBoatFactory(_factoryAddress).isBoat(to);
            if (!isValidBoat) {
                revert("Boat: destination is not a valid Boat");
            }
        }
        
        // Check if destination boat is locked - this will revert if the call fails
        bool destinationLocked = IBoat(to).isLocked();
        require(!destinationLocked, "Boat: destination boat is locked for receives");
        
        // Call _receive directly - this will revert if the call fails
        IBoat(to)._receive(tokenHash);
        
        // If the call succeeds, proceed with burning the token
        delete _tokenHashToId[tokenHash];
        delete _tokens[tokenId];
        emit Transfer(address(this), to, tokenId);
    }
    
    /**
     * @dev Receives a token from another Boat contract
     * @param tokenHash Hash of the token being received
     */
    function _receive(bytes32 tokenHash) external override {
        // Check if boat is locked for receives
        require(!_locked, "Boat: receiving is locked");
        
        // Zero hash check
        require(tokenHash != bytes32(0), "Boat: token hash cannot be zero");
        
        // Check for hash collision
        uint existingId = _tokenHashToId[tokenHash];
        if (existingId != 0 && _tokens[existingId].exists) {
            revert("Boat: token with this hash already exists");
        }
        
        // Verify sender is a valid Boat if factory address is set
        if (_factoryAddress != address(0)) {
            bool isValidBoat = IBoatFactory(_factoryAddress).isBoat(msg.sender);
            if (!isValidBoat) {
                revert("Boat: sender is not a valid Boat");
            }
        }
        
        uint newTokenId = _tokenCount;
        _tokens[newTokenId] = Token(tokenHash, "", true);
        _tokenHashToId[tokenHash] = newTokenId;
        _tokenCount++;
        
        emit Receive(_owner, msg.sender, newTokenId);
    }
    
    /**
     * @dev Helper function to convert bytes32 to hex string
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x0";
        }
        
        bytes memory buffer = new bytes(64);
        for (uint256 i = 63; i >= 0 && value > 0; i--) {
            buffer[i] = bytes1(uint8(48 + uint256(value % 16)));
            if (uint8(buffer[i]) > 57) {
                buffer[i] = bytes1(uint8(buffer[i]) + 39);
            }
            value /= 16;
        }
        
        uint256 length = 64;
        for (uint256 i = 0; i < 64; i++) {
            if (buffer[i] != 0) {
                length = 64 - i;
                break;
            }
        }
        
        bytes memory result = new bytes(2 + length);
        result[0] = "0";
        result[1] = "x";
        for (uint256 i = 0; i < length; i++) {
            result[i + 2] = buffer[i + (64 - length)];
        }
        
        return string(result);
    }
    
    /**
     * @dev Returns metadata URI for a given token ID (helper function)
     * @param id Token ID to query
     */
    function getTokenMetadata(uint id) external view returns (string memory) {
        require(_tokens[id].exists, "Boat: token does not exist");
        return _tokens[id].metadataURI;
    }
    
    /**
     * @dev Checks if a token exists by its hash
     * @param tokenHash Hash to check
     */
    function hashExists(bytes32 tokenHash) external view returns (bool) {
        uint id = _tokenHashToId[tokenHash];
        return id != 0 && _tokens[id].exists;
    }
}

/**
 * @title BoatFactory
 * @dev Factory contract to deploy new Boat contracts
 */
contract BoatFactory is IBoatFactory {
    // Event emitted when a new Boat is created
    event BoatCreated(address indexed boatAddress, string name, address indexed owner);
    
    // Mapping to keep track of created boats
    mapping(address => bool) private _isBoat;
    
    // Array to store all created boat addresses
    address[] private _boats;
    
    /**
     * @dev Creates a new Boat contract
     * @param boatName Name for the new Boat
     * @return The address of the newly created Boat contract
     */
    function createBoat(string memory boatName) external returns (address) {
        Boat newBoat = new Boat(boatName, msg.sender, address(this));
        address boatAddress = address(newBoat);
        
        _isBoat[boatAddress] = true;
        _boats.push(boatAddress);
        
        emit BoatCreated(boatAddress, boatName, msg.sender);
        
        return boatAddress;
    }
    
    /**
     * @dev Checks if an address is a Boat created by this factory
     * @param boatAddress Address to check
     * @return True if the address is a Boat created by this factory
     */
    function isBoat(address boatAddress) external view override returns (bool) {
        return _isBoat[boatAddress];
    }

    /**
     * @dev Gets a specific Boat address by its ID
     * @param id The index of the Boat in the array
     * @return The address of the Boat at the specified index
     */
    function getBoatById(uint256 id) external view returns (address) {
        require(id < _boats.length, "BoatFactory: boat ID out of bounds");
        return _boats[id];
    }
    
    /**
     * @dev Gets the total number of Boats created by this factory
     * @return Number of Boats
     */
    function getBoatCount() external view returns (uint256) {
        return _boats.length;
    }
    
    /**
     * @dev Gets information about a specific Boat
     * @param boatAddress Address of the Boat to query
     * @return name The name of the Boat
     * @return ownerAddress The owner of the Boat
     * @return tokenCount The number of tokens in the Boat
     * @return locked Whether the boat is locked for receives
     */
    function getBoatInfo(address boatAddress) external view returns (
        string memory name,
        address ownerAddress,
        uint256 tokenCount,
        bool locked
    ) {
        require(_isBoat[boatAddress], "BoatFactory: not a valid Boat");
        
        IBoat boat = IBoat(boatAddress);
        name = boat.name();
        ownerAddress = boat.owner();
        tokenCount = boat.numTokens();
        locked = boat.isLocked();
    }
}
