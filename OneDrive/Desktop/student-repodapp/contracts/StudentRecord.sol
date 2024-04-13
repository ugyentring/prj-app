// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract StudentRecord {
    uint public studentsCount = 0;

    // Model a Student
    struct Student {
        uint _id;
        uint sid;
        string name;
        bool graduated;
    }
    mapping(uint => Student) public students;

    // constructor() {
    //     addStudent(12210003, "Choki Lhamo");
    // }

    // Events

    event addStudentEvent(
        uint _id,
        uint indexed sid,
        string name,
        bool graduated
    );

    event markGraduatedEvent(uint indexed sid);

    //Create and add student to storage
    function addStudent(uint _studentNumber, string memory _name)
        public returns (Student memory) {
        studentsCount++;
        students[studentsCount] = Student(studentsCount, _studentNumber, _name,
false);
        // trigger create event
        emit addStudentEvent(studentsCount, _studentNumber, _name, false);

        return students[studentsCount];
    }

    //Change graduation status of student
    function markGraduated(uint _id) public returns (Student memory) {
        students[_id].graduated = true;
        // trigger create event
        emit markGraduatedEvent(_id);
        return students[_id];
    }

    //Fetch student info from storage
    function findStudent(uint _id) public view returns (Student memory) {
        return students[_id];
    }
}
