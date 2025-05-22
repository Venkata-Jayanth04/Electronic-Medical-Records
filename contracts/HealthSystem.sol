// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthSystem {
    struct Patient {
        string name;
        string email;
        string fileHash;
    }

    struct Doctor {
        string name;
        string email;
        string specialty;
    }

    struct Meeting {
        address patient;
        address doctor;
        string description;
        string time;
        bool isVerified;
    }

    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => string[]) public prescriptions;

    address[] public doctorList;
    Meeting[] public meetings;

    // Register Patient
    function registerPatient(string memory _name, string memory _email) public {
        require(bytes(patients[msg.sender].name).length == 0, "Already registered");
        patients[msg.sender] = Patient(_name, _email, "");
    }

    // Register Doctor
    function registerDoctor(string memory _name, string memory _email, string memory _specialty) public {
        require(bytes(doctors[msg.sender].name).length == 0, "Already registered");
        doctors[msg.sender] = Doctor(_name, _email, _specialty);
        doctorList.push(msg.sender);
    }

    // Upload medical file by patient
    function uploadRecord(string memory _fileHash) public {
        require(bytes(patients[msg.sender].name).length > 0, "Not a patient");
        patients[msg.sender].fileHash = _fileHash;
    }

    // Upload prescription to a patient (doctor only)
    function uploadPrescription(address _patient, string memory _fileHash) public {
        require(bytes(doctors[msg.sender].name).length > 0, "Only doctors can upload");
        require(bytes(patients[_patient].name).length > 0, "Invalid patient");
        prescriptions[_patient].push(_fileHash);
    }

    // Get prescriptions for a patient
    function getPrescriptions(address _patient) public view returns (string[] memory) {
        return prescriptions[_patient];
    }

    // Book a meeting
    function createMeeting(address _doctor, string memory _desc, string memory _time) public {
        require(bytes(patients[msg.sender].name).length > 0, "Not a patient");
        require(bytes(doctors[_doctor].name).length > 0, "Doctor not found");
        meetings.push(Meeting(msg.sender, _doctor, _desc, _time, false));
    }

    // Accept a meeting (doctor only)
    function acceptMeeting(uint _index) public {
        require(meetings[_index].doctor == msg.sender, "Unauthorized");
        meetings[_index].isVerified = true;
    }

    // Get patient details
    function getPatient(address _addr) public view returns (string memory, string memory, string memory) {
        Patient memory p = patients[_addr];
        return (p.name, p.email, p.fileHash);
    }

    // Get doctor details
    function getDoctor(address _addr) public view returns (string memory, string memory, string memory) {
        Doctor memory d = doctors[_addr];
        return (d.name, d.email, d.specialty);
    }

    // Get list of registered doctors
    function getDoctorList() public view returns (address[] memory) {
        return doctorList;
    }

    // Get all meetings for a doctor
    function getDoctorMeetings(address _doctor) public view returns (Meeting[] memory) {
        uint count;
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].doctor == _doctor) count++;
        }

        Meeting[] memory result = new Meeting[](count);
        uint j;
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].doctor == _doctor) {
                result[j++] = meetings[i];
            }
        }
        return result;
    }

    // Get all meetings for a patient
    function getPatientMeetings(address _patient) public view returns (Meeting[] memory) {
        uint count;
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].patient == _patient) count++;
        }

        Meeting[] memory result = new Meeting[](count);
        uint j;
        for (uint i = 0; i < meetings.length; i++) {
            if (meetings[i].patient == _patient) {
                result[j++] = meetings[i];
            }
        }
        return result;
    }
}
