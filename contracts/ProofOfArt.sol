// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProofOfArt
 * @dev Smart contract for storing verifiable proof of AI-generated artwork
 * Links creator, prompt, output, and timestamp on blockchain
 */
contract ProofOfArt {
    struct ArtProof {
        address creator;
        string promptHash;
        string outputHash;
        string combinedHash;
        uint256 timestamp;
        string ipfsLink;
        bool exists;
    }

    // Mapping from combined hash to proof
    mapping(string => ArtProof) public proofs;
    
    // Mapping from creator address to their proof hashes
    mapping(address => string[]) public creatorProofs;
    
    // Array of all proof hashes
    string[] public allProofHashes;

    event ProofRegistered(
        address indexed creator,
        string indexed combinedHash,
        string promptHash,
        string outputHash,
        uint256 timestamp,
        string ipfsLink
    );

    /**
     * @dev Register a new proof of art
     * @param _promptHash SHA-256 hash of the prompt
     * @param _outputHash SHA-256 hash of the generated output
     * @param _combinedHash SHA-256 hash of (prompt + output + user + timestamp)
     * @param _ipfsLink IPFS CID for storing the actual files
     */
    function registerProof(
        string memory _promptHash,
        string memory _outputHash,
        string memory _combinedHash,
        string memory _ipfsLink
    ) public {
        require(bytes(_combinedHash).length > 0, "Combined hash cannot be empty");
        require(!proofs[_combinedHash].exists, "Proof already exists");

        ArtProof memory newProof = ArtProof({
            creator: msg.sender,
            promptHash: _promptHash,
            outputHash: _outputHash,
            combinedHash: _combinedHash,
            timestamp: block.timestamp,
            ipfsLink: _ipfsLink,
            exists: true
        });

        proofs[_combinedHash] = newProof;
        creatorProofs[msg.sender].push(_combinedHash);
        allProofHashes.push(_combinedHash);

        emit ProofRegistered(
            msg.sender,
            _combinedHash,
            _promptHash,
            _outputHash,
            block.timestamp,
            _ipfsLink
        );
    }

    /**
     * @dev Verify if a proof exists
     * @param _combinedHash The combined hash to verify
     * @return exists Whether the proof exists
     * @return creator The creator's address
     * @return timestamp The timestamp of creation
     */
    function verifyProof(string memory _combinedHash)
        public
        view
        returns (
            bool exists,
            address creator,
            uint256 timestamp,
            string memory ipfsLink
        )
    {
        ArtProof memory proof = proofs[_combinedHash];
        return (
            proof.exists,
            proof.creator,
            proof.timestamp,
            proof.ipfsLink
        );
    }

    /**
     * @dev Get all proofs created by an address
     * @param _creator The creator's address
     * @return Array of combined hashes
     */
    function getCreatorProofs(address _creator)
        public
        view
        returns (string[] memory)
    {
        return creatorProofs[_creator];
    }

    /**
     * @dev Get total number of proofs registered
     * @return Total count
     */
    function getTotalProofs() public view returns (uint256) {
        return allProofHashes.length;
    }

    /**
     * @dev Get proof details
     * @param _combinedHash The combined hash
     * @return Full proof struct
     */
    function getProof(string memory _combinedHash)
        public
        view
        returns (ArtProof memory)
    {
        require(proofs[_combinedHash].exists, "Proof does not exist");
        return proofs[_combinedHash];
    }
}





