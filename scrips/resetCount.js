const fs = require('fs');
const path = require('path');

// Path to the input.json file
const filePath = path.join(__dirname, './expert/src/data/input.json');

// Function to reset the count
const resetSelectionCount = () => {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync(filePath);
    const data = JSON.parse(rawData);

    // Reset selectedCount to 0 for each post
    data.posts.forEach(post => {
      post.selectedCount = 0;
    });

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log('Post selection counts have been reset to 0.');
  } catch (error) {
    console.error('Error resetting selection count:', error);
  }
};

resetSelectionCount();