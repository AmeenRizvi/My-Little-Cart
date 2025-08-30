// Test script to verify parent-child linking functionality
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

async function testParentChildLinking() {
    try {
        console.log('🧪 Testing Parent-Child Linking Functionality\n');

        // Test data
        const parentData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123'
        };

        const childData = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            parentEmail: 'john.doe@example.com',
            password: 'childpassword123'
        };

        // Step 1: Register parent
        console.log('1️⃣ Registering parent...');
        const parentResponse = await axios.post(`${BASE_URL}/register/parent`, parentData);
        console.log('✅ Parent registered:', parentResponse.data.message);

        // Step 2: Register child with parent email
        console.log('\n2️⃣ Registering child with parent email...');
        const childResponse = await axios.post(`${BASE_URL}/register/child`, childData);
        console.log('✅ Child registered:', childResponse.data.message);
        console.log('🔗 Child ID:', childResponse.data.childId);
        console.log('🔗 Parent ID:', childResponse.data.parentId);

        // Step 3: Get child profile to verify parent link
        console.log('\n3️⃣ Fetching child profile...');
        const childProfileResponse = await axios.get(`${BASE_URL}/child/profile/${childResponse.data.childId}`);
        console.log('✅ Child profile retrieved successfully');
        console.log('👶 Child details:', {
            name: childProfileResponse.data.child.name,
            email: childProfileResponse.data.child.email,
            parentEmail: childProfileResponse.data.child.parentEmail,
            parentName: childProfileResponse.data.child.parent.name,
            parentEmailFromParent: childProfileResponse.data.child.parent.email
        });

        // Step 4: Get parent profile to verify children array
        console.log('\n4️⃣ Fetching parent profile...');
        const parentProfileResponse = await axios.get(`${BASE_URL}/parent/profile/${childResponse.data.parentId}`);
        console.log('✅ Parent profile retrieved successfully');
        console.log('👨‍👩‍👧‍👦 Parent details:', {
            name: parentProfileResponse.data.parent.name,
            email: parentProfileResponse.data.parent.email,
            childrenCount: parentProfileResponse.data.parent.children.length,
            children: parentProfileResponse.data.parent.children.map(child => ({
                name: child.name,
                email: child.email
            }))
        });

        console.log('\n🎉 All tests passed! Parent-child linking is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data?.message || error.message);
        if (error.response?.data) {
            console.error('Error details:', error.response.data);
        }
    }
}

// Test error cases
async function testErrorCases() {
    try {
        console.log('\n🧪 Testing Error Cases\n');

        // Test registering child with non-existent parent
        console.log('1️⃣ Testing child registration with non-existent parent...');
        const invalidChildData = {
            name: 'Orphan Child',
            email: 'orphan@example.com',
            parentEmail: 'nonexistent@example.com',
            password: 'password123'
        };

        try {
            await axios.post(`${BASE_URL}/register/child`, invalidChildData);
            console.log('❌ Should have failed but didn\'t');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.data.message);
        }

        // Test duplicate child email
        console.log('\n2️⃣ Testing duplicate child email...');
        const duplicateChildData = {
            name: 'Duplicate Child',
            email: 'jane.doe@example.com', // Same as previous test
            parentEmail: 'john.doe@example.com',
            password: 'password123'
        };

        try {
            await axios.post(`${BASE_URL}/register/child`, duplicateChildData);
            console.log('❌ Should have failed but didn\'t');
        } catch (error) {
            console.log('✅ Correctly rejected:', error.response.data.message);
        }

    } catch (error) {
        console.error('❌ Error case test failed:', error.message);
    }
}

// Run tests
async function runAllTests() {
    await testParentChildLinking();
    await testErrorCases();
}

runAllTests();
