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
            return {
                title: row[0],
                first_name: row[1],
                middle_name: row[2],
                surname: row[3],
                date_of_birth: row[4],
                age: row[5],
                email: row[6]
            };
        });
    }

    cleanData() {
        this.cleanedUserData = this.formattedUserData.map(user => {
            // Your data cleaning logic goes here
            return user;
        });
    }

    mostCommonSurname() {
        // Implement logic to find the most common surname
    }

    averageAge() {
        // Implement logic to calculate average age
    }

    youngestDr() {
        // Implement logic to find the youngest individual with title "Dr"
    }

    mostCommonMonth() {
        // Implement logic to find the most common month
    }

    percentageTitles() {
        // Implement logic to calculate percentage of each title
    }

    percentageAltered() {
        // Implement logic to calculate percentage of altered values
    }
}

const processor = new DataProcessing();
processor.loadCSV('Raw_User_Data');
processor.formatData();
processor.cleanData();

// Output cleaned data to a JSON file
fs.writeFileSync('Cleaned_User_Data.json', JSON.stringify(processor.cleanedUserData, null, 2));

// You can call the query functions here and log their results
