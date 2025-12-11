// ==UserScript==
// @name         Generate Kiosk Form Data
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add a button to generate test data for the kiosk enlisting form
// @author       REYVIC-DEV
// @match        *://*/kiosk/enlisting/new/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js

// @updateURL   https://raw.githubusercontent.com/REYVIC-DEV/tamper_monkey/refs/heads/main/Generate_Kiosk_Form_Data.js
// @downloadURL https://raw.githubusercontent.com/REYVIC-DEV/tamper_monkey/refs/heads/main/Generate_Kiosk_Form_Data.js
// ==/UserScript==


(function() {
    'use strict';

    console.log('Tampermonkey script loaded');

    // Wait for the page to load
    window.addEventListener('load', function() {
        console.log('Page loaded, looking for form container');
        addButton();
    });

    // Also try immediately in case load already fired
    if (document.readyState === 'complete') {
        console.log('Document ready, adding button');
        addButton();
    }

    function addButton() {
        // Check if button already exists
        if (document.getElementById('generate-test-data-btn')) {
            console.log('Button already exists');
            return;
        }

        // Create a fixed floating button
        const generateBtn = document.createElement('button');
        generateBtn.id = 'generate-test-data-btn';
        generateBtn.type = 'button';
        generateBtn.textContent = '🎲 Generate Data';
        generateBtn.onclick = generateFormData;

        // Style the button as a small fixed floating button
        Object.assign(generateBtn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '10px 15px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
        });

        // Add hover effect
        generateBtn.onmouseover = () => {
            generateBtn.style.backgroundColor = '#218838';
            generateBtn.style.transform = 'scale(1.05)';
        };
        generateBtn.onmouseout = () => {
            generateBtn.style.backgroundColor = '#28a745';
            generateBtn.style.transform = 'scale(1)';
        };

        // Append to body
        document.body.appendChild(generateBtn);
        console.log('Floating button added to page');
    }

    function generateFormData() {
        console.log('Starting form data generation...');

        // Delay execution to ensure all form elements are loaded
        setTimeout(() => {
            try {
                const faker = window.Faker || window.faker;
                console.log('Faker loaded:', !!faker);

                // Helper functions
                const getMiddleName = () => {
                    try {
                        return faker.person.middleName();
                    } catch (e) {
                        return faker.name.firstName();
                    }
                };

                const generatePhoneNumber = (pattern) => {
                    try {
                        return faker.phone.number(pattern);
                    } catch (e) {
                        // Fallback: generate a random 10-digit number
                        const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000;
                        return '09' + randomNum.toString().slice(2);
                    }
                };

                const getFullName = () => {
                    try {
                        return faker.person.fullName();
                    } catch (e) {
                        return faker.name.firstName() + ' ' + faker.name.lastName();
                    }
                };

                const getCompanyName = () => {
                    try {
                        return faker.company.name();
                    } catch (e) {
                        try {
                            return faker.company.companyName();
                        } catch (e2) {
                            return 'Sample School';
                        }
                    }
                };

                console.log('Filling student information...');
                // Student Information
                setValue('lastname', faker.name.lastName());
                setValue('firstname', faker.name.firstName());
                setValue('middlename', getMiddleName());
                setRadioValue('gender', 'Male');
                setValue('citizenship', 'Filipino');
                setValue('religion', 'Catholic');
                setValue('birthdate', faker.date.past(20, '2005-01-01').toISOString().split('T')[0]);
                setValue('birthplace', 'Manila, Philippines');
                setValue('street_number', faker.address.streetAddress());
                setValue('contactnumber', generatePhoneNumber('09#########'));
                setValue('email', faker.internet.email());
                setRadioValue('is_transferee', '0');

                // Father Information
                setValue('fatherlastname', faker.name.lastName());
                setValue('fatherfirstname', faker.name.firstName());
                setValue('fathermiddlename', getMiddleName());
                setValue('fatherCitizenship', 'Filipino');
                setValue('father_occupation', faker.name.jobTitle());
                setValue('fatherMobileNumber', generatePhoneNumber('09#########'));
                setValue('father_email', faker.internet.email());

                // Mother Information
                setValue('motherlastname', faker.name.lastName());
                setValue('motherfirstname', faker.name.firstName());
                setValue('mothermiddlename', getMiddleName());
                setValue('motherCitizenship', 'Filipino');
                setValue('mother_occupation', faker.name.jobTitle());
                setValue('mothernumber', generatePhoneNumber('09#########'));
                setValue('mother_email', faker.internet.email());

                // Parents Marital Status
                setValue('parents_marital_status', 'married');

                console.log('Filling siblings...');
                // Siblings (fill all 3 default rows)
                for (let i = 0; i < 3; i++) {
                    setArrayValue('sibling_name[]', i, getFullName());
                    setArrayValue('sibling_birthdate[]', i, faker.date.past(25 - (i * 5), new Date(2000 - (i * 5), 0, 1)).toISOString().split('T')[0]);
                    setArrayValue('sibling_educational_attainment[]', i, i === 0 ? 'College Graduate' : i === 1 ? 'High School Graduate' : 'Elementary Graduate');
                }

                console.log('Filling relatives...');
                // Relatives (fill all 3 default rows)
                for (let i = 0; i < 3; i++) {
                    setArrayValue('relative_name[]', i, getFullName());
                    setArrayValue('relative_birthdate[]', i, faker.date.past(30 - (i * 5), new Date(1990 - (i * 5), 0, 1)).toISOString().split('T')[0]);
                    setArrayValue('relative_educational_attainment[]', i, i === 0 ? 'College Graduate' : i === 1 ? 'High School Graduate' : 'Vocational Graduate');
                }

                console.log('Filling scholastic information...');
                // Scholastic Information - departments are already filled and readonly
                const schools = ['Pre-School', 'Elementary', 'Junior High School', 'Senior High School'];
                const lastLevels = ['Nursery', 'Grade 6', 'Grade 10', 'Grade 12'];
                schools.forEach((school, index) => {
                    setArrayValue('scholastic_school_name[]', index, getCompanyName() + ' ' + school);
                    setArrayValue('scholastic_school_last_level_attended[]', index, lastLevels[index]);
                    setArrayValue('scholastic_school_year[]', index, (2024 - (schools.length - index)).toString());
                    setArrayValue('scholastic_awards[]', index, index === 0 ? 'Best in Math' : index === 1 ? 'Honor Student' : index === 2 ? 'With High Honors' : 'Valedictorian');
                });

                // Organizations
                setArrayValue('organization_name[]', 0, 'Student Council');
                setArrayValue('organization_position[]', 0, 'President');
                setArrayValue('organization_year[]', 0, '2023');

                // Special Skills
                const skills = ['computer', 'dancing', 'singing', 'public_speaking'];
                skills.forEach(skill => {
                    const checkbox = document.querySelector(`input[name="${skill}"]`);
                    if (checkbox) checkbox.checked = true;
                });
                setValue('other_skill_name', 'Basketball');

                // Emergency Contact
                setValue('emergencyRelationshipToChild', 'Father');
                setValue('emergencyaddress', faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.country());
                setValue('emergencyhomephone', generatePhoneNumber('02#######'));

                // Legal Guardian Information (if guardian is selected)
                setValue('legal_guardian_lastname', faker.name.lastName());
                setValue('legal_guardian_firstname', faker.name.firstName());
                setValue('legal_guardian_middlename', getMiddleName());
                setValue('legal_guardian_citizenship', 'Filipino');
                setValue('legal_guardian_occupation', faker.name.jobTitle());
                setValue('legal_guardian_contact_number', generatePhoneNumber('09#########'));

                // Authorized Person (fill all 3 default rows)
                const relationships = ['Uncle', 'Aunt', 'Grandfather'];
                for (let i = 0; i < 3; i++) {
                    setArrayValue('authorized_person_name[]', i, getFullName());
                    setArrayValue('authorized_person_relationship[]', i, relationships[i]);
                }

                // Ensure address dropdowns are properly selected
                setTimeout(() => {
                    const barangaySelect = document.getElementById('barangay');
                    if (barangaySelect && barangaySelect.options.length > 1 && barangaySelect.selectedIndex === 0) {
                        barangaySelect.selectedIndex = 1;
                        barangaySelect.dispatchEvent(new Event('change'));
                    }
                }, 2000);

                console.log('Form filling completed successfully!');
                alert('Test data generated successfully! Please review and adjust as needed.');
            } catch (error) {
                console.error('Error generating form data:', error);
                alert('Error generating form data. Please check the console for details.');
            }
        }, 500); // Wait 500ms for form to be fully loaded
    }

    function setValue(name, value) {
        const element = document.querySelector(`[name="${name}"]`);
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function setRadioValue(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function setArrayValue(name, index, value) {
        const elements = document.querySelectorAll(`[name="${name}"]`);
        console.log(`Setting ${name}[${index}] to "${value}". Found ${elements.length} elements.`);
        if (elements[index]) {
            console.log(`Setting value on element:`, elements[index]);
            elements[index].value = value;
            elements[index].dispatchEvent(new Event('input', { bubbles: true }));
            elements[index].dispatchEvent(new Event('change', { bubbles: true }));
            console.log(`Set ${name}[${index}] to "${elements[index].value}"`);
        } else {
            console.log(`Element ${name}[${index}] not found`);
        }
    }
})();
