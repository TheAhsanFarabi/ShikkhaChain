// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string course;
        string institution;
        string duration;
        string grade;
        string credentialType;
        uint256 issueDate;
        bool isValid;
    }

    address public admin;
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bytes32[]) public userCertificates;

    event CertificateIssued(
        bytes32 certHash,
        string studentName,
        string course,
        string institution,
        string duration,
        string grade,
        string credentialType,
        uint256 issueDate
    );

    event CertificateRevoked(bytes32 certHash);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(
        string memory _studentName,
        string memory _course,
        string memory _institution,
        string memory _duration,
        string memory _grade,
        string memory _credentialType
    ) public onlyAdmin returns (bytes32) {
        bytes32 certHash = keccak256(abi.encodePacked(
            _studentName,
            _course,
            _institution,
            _duration,
            _grade,
            _credentialType,
            block.timestamp
        ));

        certificates[certHash] = Certificate(
            _studentName,
            _course,
            _institution,
            _duration,
            _grade,
            _credentialType,
            block.timestamp,
            true
        );

        userCertificates[msg.sender].push(certHash);

        emit CertificateIssued(
            certHash,
            _studentName,
            _course,
            _institution,
            _duration,
            _grade,
            _credentialType,
            block.timestamp
        );

        return certHash;
    }

    function verifyCertificate(bytes32 certHash) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint256,
        bool
    ) {
        Certificate memory cert = certificates[certHash];
        return (
            cert.studentName,
            cert.course,
            cert.institution,
            cert.duration,
            cert.grade,
            cert.credentialType,
            cert.issueDate,
            cert.isValid
        );
    }

    function revokeCertificate(bytes32 certHash) public onlyAdmin {
        require(certificates[certHash].isValid, "Certificate does not exist or already revoked");
        certificates[certHash].isValid = false;
        emit CertificateRevoked(certHash);
    }

    function getMyCertificates() public view returns (bytes32[] memory) {
        return userCertificates[msg.sender];
    }
}
