// //Import the StudentList smart contract
// const StudentRecord = artifacts.require('StudentRecord')

// // Use the contract to write all tests
// contract('StudentRecord', (accounts) => {
//     let studentrecordInstance; // Declare the instance variable

//     // Make sure contract is deployed and before we retrieve the studentrecord object for testing
//     beforeEach(async () => {
//         studentrecordInstance = await StudentRecord.new();
//     })

//     // Testing the deployed student contract
//     it('Deployed successfully', async () => {
//         // Get the address which the student object is stored
//         const address = await studentrecordInstance.address;
//         // Test for a valid address
//         isValidAddress(address);
//     })

//     // Testing the content in the contract
//     it('Added the students successfully', async () => {
//         // Reset the contract state by deploying a new instance
//         // studentrecordInstance = await StudentRecord.new();

//         // Check that there is one student initially
//         const initialCount = await studentrecordInstance.studentsCount();
//         assert.equal(initialCount, 1, "Initial student count should be 1");

//         // Add a new student
//         const studentNo = 12210009;
//         const transaction = await studentrecordInstance.addStudent(studentNo, "Jigme Namgyel");
//         isValidAddress(transaction.tx);
//         isValidAddress(transaction.receipt.blockHash);

//         // Check the updated count of students and the student's information
//         const updatedCount = await studentrecordInstance.studentsCount();
//         assert.equal(updatedCount, 2, "Updated student count should be 2");

//         const student = await studentrecordInstance.students(2);
//         assert.equal(student.sid, studentNo);
//     })


//     // This function checks if the address is valid
//     function isValidAddress(address) {
//         assert.notEqual(address, '0x0000000000000000000000000000000000000000');
//         assert.notEqual(address, '');
//         assert.notEqual(address, null);
//         assert.notEqual(address, undefined);
//     }

//     // Find the student
//     it('Successful search of student', async () => {
//         // You can add students and search for them in this test case using the same instance
//         // No need to redeploy the contract
//     })
// })


//Import the StudentList smart contract
const StudentRecord = artifacts.require('StudentRecord')

//Use the contract to write all tests
//variable: account => all accounts in blockchain
contract('StudentRecord', (accounts) => {
    //Make sure contract is deployed and before
    //we retrieve the studentrecord object for testing
    beforeEach(async () => {
        this.studentRecord = await StudentRecord.deployed()
    })
    //Testing the deployed student contract
    it('Deployed successfully', async () => {
        //Get the address which the student object is stored
        const address = await this.studentRecord.address
        //Test for valid address
        isValidAddress(address)
    })
})

//Testing the content in the contract
it('Added the students successfully', async () => {
    return StudentRecord.deployed().then((instance) => {
        studentrecordInstance = instance;
        studentNo = 12210009;
        return studentrecordInstance.addStudent(studentNo, "Jigme Namgyel");
    }).then((transaction) => {
        isValidAddress(transaction.tx)
        isValidAddress(transaction.receipt.blockHash);
        return studentrecordInstance.studentsCount()
    }).then((count) => {
        assert.equal(count, 1)
        return studentrecordInstance.students(1);
    }).then((student) => {
        assert.equal(student.sid, studentNo)
    })
})

// find the student
it('Successful search of student', async () => {
    return StudentRecord.deployed().then(async (instance) => {
        s = instance;
        studentid = 2;
        return s.addStudent(studentid++, "Pema Yangzom").then(async (tx) => {
            return s.addStudent(studentid++, "Rigden Yoesel").then(async (tx) => {
                return s.addStudent(studentid++, "Sonam Tshering").then(async (tx) => {
                    return s.addStudent(studentid++, "Tshering Dorji").then(async (tx) => {
                        return s.addStudent(studentid++, "Bijay Kumar Rai").then(async (tx) => {
                            return s.addStudent(studentid++, "Chencho Dema").then(async (tx) => {
                                return s.studentsCount().then(async (count) => {
                                    assert.equal(count, 7)
                                    return s.findStudent(5).then(async (student) => {
                                        assert.equal(student.name, "Tshering Dorji")
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

// Mark graduation of student
it('Successfully marked graduate students', async () => {
    return StudentRecord.deployed().then(async (instance) => {
        s = instance;
        return s.findStudent(1).then(async (ostudent) => {
            assert.equal(ostudent.name, "Jigme Namgyel")
            assert.equal(ostudent.graduated, false)
            return s.markGraduated(1).then(async (transaction) => {
                return s.findStudent(1).then(async (nstudent) => {
                    assert.equal(nstudent.name, "Jigme Namgyel")
                    assert.equal(nstudent.graduated, true)
                    return
                })
            })
        })
    })
})

//This function check if the address is valid
function isValidAddress(address) {
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
}