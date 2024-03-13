const fs = require('fs');

class DataProcessing {
    constructor() {
        this.rawUserData = [];
        this.formattedUserData = [];
        this.cleanedUserData = [];
    }

    loadCSV(filename) {
        const data = fs.readFileSync(`${filename}.csv`, 'utf8');
        this.rawUserData = data.split('\n').map(row => row.split(','));
    }

    formatData() {
        this.formattedUserData = this.rawUserData.map(row => {
            if (row.length < 5) {
                console.error('Incomplete data:', row);
                return null; // Skip processing this row
            }
    
            const [title, name, dob, age, email] = row;
            const [first_name, middle_name, surname] = name.split(' ');
    
            let dobDate;
            if (dob.includes('/')) {
                const [day, month, year] = dob.split('/');
                dobDate = new Date(`${year}-${month}-${day}`);
            } else {
                console.error('Invalid date format:', dob);
                return null; // Skip processing this row
            }
    
            const parsedAge = parseFloat(age);
            if (isNaN(parsedAge)) {
                console.error('Invalid age:', age);
                return null; // Skip processing this row
            }
    
            const formattedEmail = email ? email.trim().toLowerCase() : ''; // Check if email exists before converting to lowercase
    
            return {
                title,
                first_name: this.capitalize(first_name),
                middle_name: this.capitalize(middle_name),
                surname: this.capitalize(surname),
                date_of_birth: dobDate,
                age: parsedAge,
                email: formattedEmail
            };
        }).filter(user => user !== null); // Filter out rows with incomplete or invalid data
    }
    
    cleanData() {
        this.cleanedUserData = this.formattedUserData.map(user => {
            // Your data cleaning logic goes here
            // For example, you could trim strings, parse dates, convert age to number, etc.
            // We'll leave this for you to implement based on your specific requirements
            return user;
        });
    }
    mostCommonSurname() {
        if (this.cleanedUserData.length === 0) {
            return "No data available to calculate most common surname.";
        }
    
        const surnameCount = {};
        this.cleanedUserData.forEach(user => {
            surnameCount[user.surname] = (surnameCount[user.surname] || 0) + 1;
        });
        const mostCommon = Object.keys(surnameCount).reduce((a, b) => surnameCount[a] > surnameCount[b] ? a : b);
        return mostCommon;
    }
    
    averageAge() {
        // Implement logic to calculate average age
        const totalAge = this.cleanedUserData.reduce((sum, user) => sum + parseFloat(user.age), 0);
        return (totalAge / this.cleanedUserData.length).toFixed(3);
    }

    youngestDr() {
        // Implement logic to find the youngest individual with title "Dr"
        const drs = this.cleanedUserData.filter(user => user.title === 'Dr');
        if (drs.length > 0) {
            const youngest = drs.reduce((prev, curr) => parseFloat(prev.age) < parseFloat(curr.age) ? prev : curr);
            return youngest;
        } else {
            return "No individuals with title 'Dr' found.";
        }
    }

    mostCommonMonth() {
        // Implement logic to find the most common month
        const monthCounts = {};
        this.cleanedUserData.forEach(user => {
            const month = new Date(user.date_of_birth).getMonth() + 1;
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
        const maxCount = Math.max(...Object.values(monthCounts));
        const mostCommonMonth = Object.keys(monthCounts).find(key => monthCounts[key] === maxCount);
        return mostCommonMonth;
    }

    percentageTitles() {
        // Implement logic to calculate percentage of each title
        const titleCount = {};
        this.cleanedUserData.forEach(user => {
            titleCount[user.title] = (titleCount[user.title] || 0) + 1;
        });
        const totalUsers = this.cleanedUserData.length;
        const percentageTitles = {};
        Object.keys(titleCount).forEach(title => {
            percentageTitles[title] = ((titleCount[title] / totalUsers) * 100).toFixed(2);
        });
        return percentageTitles;
    }

    percentageAltered() {
        // Implement logic to calculate percentage of altered values
        const alteredCount = this.cleanedUserData.filter(user => user.email.includes('@example.com')).length;
        return ((alteredCount / this.cleanedUserData.length) * 100).toFixed(2);
    }

    capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    writeCleanedDataToFile(filename) {
        fs.writeFileSync(filename, JSON.stringify(this.cleanedUserData, null, 2));
        console.log('Cleaned data written to', filename);
    }
}

const processor = new DataProcessing();
processor.loadCSV('Raw_User_Data');
processor.formatData();
processor.cleanData();
processor.writeCleanedDataToFile('Cleaned_User_Data.json');

// Log the calculated statistics`
console.log('Most common surname:', processor.mostCommonSurname());
console.log('Average age:', processor.averageAge());
console.log('Youngest Dr:', processor.youngestDr());
console.log('Most common month:', processor.mostCommonMonth());
console.log('Percentage titles:', processor.percentageTitles());
console.log('Percentage altered:', processor.percentageAltered());
