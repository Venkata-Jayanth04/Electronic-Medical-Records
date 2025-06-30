// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract HealthSystem {
    struct Patient {
        string firstName;
        string lastName;
        string dateOfBirth;
        string email;
        string gender;
        string patientAddress;
        string phoneNumber;
        string bloodGroup;
        address walletAddress;
        string insuranceProvider;
        string policyNumber;
        bool isRegistered;
    }

    struct Doctor {
        string firstName;
        string lastName;
        string specialization;
        string email;
        string phoneNumber;
        address walletAddress;
        bool isRegistered;
        string licensenumber;
        string Doctoraddress;
        string YearsExperience;
    }

    struct ConsultationRequest {
        address patient;
        address doctor;
        bool approvedByPatient;
        bool approvedByDoctor;
        bool exists;
    }

    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(bytes32 => ConsultationRequest) public requests;

    address[] public registeredPatients;
    address[] public registeredDoctors;

    mapping(address => mapping(address => string[])) public patientReports;
    mapping(address => mapping(address => string[])) public doctorPrescriptions;

    event PatientRegistered(address patient);
    event DoctorRegistered(address doctor);
    event ConsultationRequested(address patient, address doctor);
    event ConsultationApproved(address patient, address doctor);
    event ConsultationRejected(address patient, address doctor);
    event ReportSent(address from, address to, string reportHash);
    event PrescriptionSent(address from, address to, string prescriptionHash);

    function registerPatient(
        string memory _firstName,
        string memory _lastName,
        string memory _dateOfBirth,
        string memory _email,
        string memory _gender,
        string memory _patientAddress,
        string memory _phoneNumber,
        string memory _bloodGroup,
        string memory _insuranceProvider,
        string memory _policyNumber
    ) public {
        require(!patients[msg.sender].isRegistered, "Patient already registered");
        patients[msg.sender] = Patient({
            firstName: _firstName,
            lastName: _lastName,
            dateOfBirth: _dateOfBirth,
            email: _email,
            gender: _gender,
            patientAddress: _patientAddress,
            phoneNumber: _phoneNumber,
            bloodGroup: _bloodGroup,
            walletAddress: msg.sender,
            insuranceProvider: _insuranceProvider,
            policyNumber: _policyNumber,
            isRegistered: true
        });
        registeredPatients.push(msg.sender);
        emit PatientRegistered(msg.sender);
    }

    function registerDoctor(
        string memory _firstName,
        string memory _lastName,
        string memory _specialization,
        string memory _email,
        string memory _phoneNumber,
        string memory _Address,
        string memory _Experience,
        string memory _LicenceNumber
    ) public {
        require(!doctors[msg.sender].isRegistered, "Doctor already registered");

        doctors[msg.sender] = Doctor({
            firstName: _firstName,
            lastName: _lastName,
            specialization: _specialization,
            email: _email,
            phoneNumber: _phoneNumber,
            walletAddress: msg.sender,
            isRegistered: true,
            licensenumber: _LicenceNumber,
            Doctoraddress: _Address,
            YearsExperience: _Experience
        });

        registeredDoctors.push(msg.sender);
        emit DoctorRegistered(msg.sender);
    }

    function getDoctorDetails(address _doctor) public view returns (
        string memory firstName,
        string memory lastName,
        string memory specialization,
        string memory email,
        string memory phoneNumber,
        string memory licensenumber,
        string memory Doctoraddress,
        string memory YearsExperience
    ) {
        Doctor memory d = doctors[_doctor];
        require(d.isRegistered, "Doctor not registered");
        return (
            d.firstName,
            d.lastName,
            d.specialization,
            d.email,
            d.phoneNumber,
            d.licensenumber,
            d.Doctoraddress,
            d.YearsExperience
        );
    }

    function getAllRegisteredPatients() public view returns (address[] memory) {
        return registeredPatients;
    }

    function getAllRegisteredDoctors() public view returns (address[] memory) {
        return registeredDoctors;
    }

    function requestConsultation(address _doctor) public {
        require(patients[msg.sender].isRegistered, "Patient not registered");
        require(doctors[_doctor].isRegistered, "Doctor not registered");
        bytes32 key = keccak256(abi.encodePacked(msg.sender, _doctor));
        require(!requests[key].exists, "Request already exists");
        requests[key] = ConsultationRequest({
            patient: msg.sender,
            doctor: _doctor,
            approvedByPatient: true,
            approvedByDoctor: false,
            exists: true
        });
        emit ConsultationRequested(msg.sender, _doctor);
    }

    function doctorApproveConsultation(address _patient) public {
        bytes32 key = keccak256(abi.encodePacked(_patient, msg.sender));
        require(requests[key].exists, "Request does not exist");
        require(requests[key].doctor == msg.sender, "Only doctor can approve");
        requests[key].approvedByDoctor = true;
        emit ConsultationApproved(_patient, msg.sender);
    }

    function doctorRejectConsultation(address _patient) public {
        bytes32 key = keccak256(abi.encodePacked(_patient, msg.sender));
        require(requests[key].exists, "Request does not exist");
        require(requests[key].doctor == msg.sender, "Only doctor can reject");
        delete requests[key];
        emit ConsultationRejected(_patient, msg.sender);
    }

    function isApproved(address _patient, address _doctor) public view returns (bool) {
        bytes32 key = keccak256(abi.encodePacked(_patient, _doctor));
        return requests[key].approvedByPatient && requests[key].approvedByDoctor;
    }

    function sendPrescription(address _patient, string memory _prescriptionHash) public {
        require(doctors[msg.sender].isRegistered, "Only doctor can send prescriptions");
        require(isApproved(_patient, msg.sender), "Doctor not approved by patient");
        doctorPrescriptions[msg.sender][_patient].push(_prescriptionHash);
        emit PrescriptionSent(msg.sender, _patient, _prescriptionHash);
    }

    function sendReport(address _doctor, string memory _reportHash) public {
        require(patients[msg.sender].isRegistered, "Only patient can send reports");
        require(isApproved(msg.sender, _doctor), "Patient not approved doctor");
        patientReports[msg.sender][_doctor].push(_reportHash);
        emit ReportSent(msg.sender, _doctor, _reportHash);
    }

    // === NEW GETTER FUNCTIONS ===

    function getPatientReports(address patient, address doctor) public view returns (string[] memory) {
        return patientReports[patient][doctor];
    }

    function getDoctorPrescriptions(address doctor, address patient) public view returns (string[] memory) {
        return doctorPrescriptions[doctor][patient];
    }
}
