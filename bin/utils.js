const fs = require('fs');
const os = require('os');
const xlsx = require('xlsx');
const fs_extra = require('fs-extra');
const readlineSync = require('readline-sync');
const readline = require('readline'); // Add this line
const { execSync } = require('child_process');

const path = require('path'); // Import the path module
const generateHTML = require('./generate-html');
const packageJson = require('../package.json');
const { cyan, red, green, reset ,yellow} = require('./colors_easier');

const easierInfo = {
  name: "Easier",
  description: "A versatile CLI tool designed to simplify development and templating processes for various frameworks like React Native, React.js, Angular, and more. Make development and project setup easier!",
  contact: "Contact us at easier@gmail.com",
};

const banner = `
  ************************************************************
  *                                                          *
  *                 ${green}EASIER CLI Tool${reset}          *
  *                                                          *
  *                                                          *
  *                                                          *
  ************************************************************
  `;


function displayVersion() {
  console.log(`Version: ${packageJson.version}`);
}
function displayHelp() {
  console.log('\nUsage: easier [command] [options]\n');
  console.log('Commands:\n');
  console.log(`  ${cyan}easier${reset}\t\t\tDisplay information about easier.`);
  console.log(`  ${cyan}generate, -g <name>${reset}\t\tGenerate an HTML file with the specified name.`);
  console.log(`  ${cyan}create, -c <folderName>${reset}\tCreate a new folder with the specified name.`);
  console.log(`  ${cyan}create-file, -cf <subfolderName> <file-name>${reset}\tCreate a new file in a subfolder.`);
  console.log(`  ${cyan}tree, -t <directory-path>${reset}\tDisplay the directory tree of a specified path.`);
  console.log(`  ${cyan}generate-react-native <app-name> <template-repo-url>${reset}\tGenerate a React Native app from a EASIER template.\n`);
  console.log('Options:\n');
  console.log(`  ${cyan}--version, -v${reset}\tDisplay the version of the CLI tool`);
  console.log(`  ${cyan}--display-history, -dh${reset}\tDisplay the command history`);
  console.log(`  ${cyan}--info, -i${reset}\tDisplay additional information about EASIER`);
  console.log(`  ${cyan}--remove, -r${reset}\tRemove the EASIER cli`);
  console.log(`  ${cyan}--help, -h${reset}\tDisplay this help message`);




  // rl.question('\nDo you want more details about any specific command? (yes/no): ', (answer) => {
  //   if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
  //     // You can add more detailed help information here
  //     console.log('Additional details about specific commands...');
  //   }

  //   rl.close();
  // });
}

let commandStartTime = Date.now();


function writeHistoryToExcel(workbook, excelFilePath, commandName, commandTime, duration) {
  try {
    const sheetName = 'CommandHistory';

    if (!workbook.Sheets[sheetName]) {
      workbook.Sheets[sheetName] = xlsx.utils.json_to_sheet([], { header: ['CommandName', 'CommandTime', 'Duration'] });
      workbook.SheetNames.push(sheetName);
    }

    const worksheet = workbook.Sheets[sheetName];

    const lastRow = worksheet['!ref'] ? xlsx.utils.decode_range(worksheet['!ref']).e.r + 1 : 1;

    xlsx.utils.sheet_add_json(worksheet, [{ CommandName: commandName, CommandTime: commandTime, Duration: duration }], { header: ['CommandName', 'CommandTime', 'Duration'], skipHeader: true, origin: lastRow });

    // Save the workbook to the Excel file
    xlsx.writeFile(workbook, excelFilePath);

    // Update the command start time for the next command
    commandStartTime = Date.now();
  } catch (error) {
    if (error.code === 'EBUSY') {
      // If the file is busy, retry after a short delay
      //setTimeout(() => writeHistoryToExcel(workbook, excelFilePath, commandName, commandTime, duration), 1000);
      writeHistoryToExcel(workbook, excelFilePath, commandName, commandTime, duration)
    } else {
      console.error(`Error writing to Excel file: ${error.message}`);
    }
  }
}


function historyCommands(commandArgs) {
  
  const historyFilePath = `${os.homedir()}/command_history.eas`;
  const excelFilePath = `${os.homedir()}/command_history.xlsx`;

  const commandHistory = `${new Date().toISOString()} - ${commandArgs.join(' ')}\n`;

  fs.appendFileSync(historyFilePath, commandHistory);

  // Calculate duration if command start time is available
  const duration = commandStartTime ? (Date.now() - commandStartTime) / 1000 : 'N/A';

  // Create or load the Excel file
  let workbook;
  try {
    const existingWorkbook = xlsx.readFile(excelFilePath);
    workbook = existingWorkbook;
  } catch (error) {
    workbook = { Sheets: {}, SheetNames: [] };
  }

  // Add data to the Excel file
  const commandName = commandArgs[0] || 'easier'; // Adjust this based on your command structure
  const commandTime = new Date().toLocaleDateString();

  writeHistoryToExcel(workbook, excelFilePath, commandName, commandTime, duration);
}

function displayCommandHistory() {
  const historyFilePath = `${os.homedir()}/command_history.eas`;

  try {
    const historyContent = fs.readFileSync(historyFilePath, 'utf-8');
    console.log(`Command History:\n${historyContent}`);
  } catch (error) {
    console.error(`${red}Error reading command history: ${error.message}${reset}`);
  }
}

function displayeasierInfo() {
  console.log(banner);
  console.log(`${green}${easierInfo.name}${reset}`);
  console.log(easierInfo.description);
  console.log(easierInfo.contact);
}

function generateHTMLFile(name) {
  const htmlContent = generateHTML(name);
  const fileName = `${name.toLowerCase()}.html`;

  fs.writeFile(fileName, htmlContent, (err) => {
    if (err) {
      console.error(`${red}Error creating ${fileName}: ${err.message}${reset}`);
      process.exit(1);
    }
    console.log(`${green}HTML file ${fileName} has been generated successfully.${reset}`);
  });
}
function createFileInSubfolder(subfolderPath, fileName) {
  const filePath = `${subfolderPath}/${fileName}`;

  fs.mkdir(subfolderPath, { recursive: true }, (err) => {
    if (err) {
      console.error(`${red}Error creating ${subfolderPath} folder: ${err.message}${reset}`);
    } else {
      fs.writeFile(filePath, '', (err) => {
        if (err) {
          console.error(`${red}Error creating ${fileName} in ${subfolderPath}: ${err.message}${reset}`);
        } else {
          console.log(`${green}File ${fileName} has been created in ${subfolderPath} successfully.${reset}`);
        }
      });
    }
  });
}

function createFolder(folderName) {
    fs.mkdir(folderName, (err) => {
      if (err) {
        console.error(`${red}Error creating folder ${folderName}: ${err.message}${reset}`);
        process.exit(1);
      }
      console.log(`${green}Folder ${folderName} has been created successfully.${reset}`);
    });
  }
  function displayDirectoryTree(directoryPath = process.cwd(), exportToFile = false) {
    function traverseDirectory(currentPath, indent = '') {
      const items = fs.readdirSync(currentPath);
      const output = [];
  
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
  
        if (stats.isDirectory()) {
          output.push(`${indent}${cyan}${item}${reset}/`);
          output.push(...traverseDirectory(itemPath, `${indent}  `));
        } else {
          output.push(`${indent}${item}`);
        }
      }
  
      return output;
    }
  
    const treeOutput = [`${cyan}Directory tree for: ${directoryPath}${reset}`, ...traverseDirectory(directoryPath)].join('\n');
  
    if (exportToFile) {
      const exportFileName = 'directory_tree.txt';
      fs.writeFileSync(exportFileName, treeOutput);
      console.log(`Directory tree has been exported to ${exportFileName}`);
    } else {
      console.log(treeOutput);
    }
  }
  function generateReactNativeApp(appName) {
    try {
      const templateRepoUrl = 'https://github.com/HAFDIAHMED/react-native-firebase';
  
      console.log(`
  ************************************************************
  *                                                          *
  *             EASIER CLI Tool                           *
  *             Generating your React Native app...          *
  *             Please wait...                               *
  *                                                          *
  ************************************************************
      `);
  
      // Clone the GitHub repository to a temporary directory.
      const tempDir = `temp_${Date.now()}`;
      execSync(`git clone ${templateRepoUrl} ${tempDir}`);
  
      // Create a new directory for the app.
      fs_extra.ensureDirSync(appName);
  
      // Copy the cloned template to the app directory.
      fs_extra.copySync(tempDir, appName);
  
      // Remove the temporary directory.
      fs_extra.removeSync(tempDir);
  
      console.log(`React Native app '${appName}' generated from the GitHub template.`);
      
      // Change the current working directory to the newly created app directory.
      process.chdir(appName);
  
      // Run 'yarn install' to install Node.js modules.
      execSync('yarn install', { stdio: 'inherit' });
  
      console.log('Node.js modules installed successfully.');
    } catch (error) {
      console.error(`Error generating the app: ${error.message}`);
    }
  }
  
  function removeEasier() {
    try {
      // Execute the command to remove EASIER
      execSync('npm uninstall -g easier-cli', { stdio: 'inherit' });
      console.log('EASIER has been removed successfully.');
    } catch (error) {
      console.error('Error removing EASIER:', error.message);
    }
  }
  function checkEasierFile() {
    const projectPath = process.cwd(); // Get the current working directory
  
    // Check if 'easier.eas' file exists in the project
    const filePath = path.join(projectPath, 'temp.eas');
  
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(`${red}The file 'easier.eas' does not exist in the project.${reset}`);
      } else {
        console.log(`${green}The file 'easier.eas' exists in the project.${reset}`);
      }
    });
  }



  function replaceProjectNameTokens(filePath, projectName, packageName,jobName) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      const updatedContent = fileContent
      .replace(/\${project.name\.easier}/g, projectName)
      .replace(/\${JOB.NAME\.easier}/g, jobName)
      .replace(/\${package.name\.easier}/g, packageName);
      fs.writeFileSync(filePath, updatedContent);
      console.log(`File '${filePath}' ${green}updated successfully.${reset}`);
    } catch (error) {
      console.error(`Error replacing tokens in file '${filePath}': ${error.message}`);
    }
  }
  
  function processDirectory(directoryPath, projectName, packageName,jobName,commonVersion) {
    try {
      // Read all files in the directory
      const files = fs.readdirSync(directoryPath);
  
      // Process each file in the directory
      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
  
        if (stats.isDirectory()) {
          // Recursively process subdirectories
          processDirectory(filePath, projectName, packageName,jobName,commonVersion);
        } else {
          // Replace tokens in each file
          replaceProjectNameTokens(filePath, projectName, packageName,jobName);
          // Rename the file if it contains ${JOB.NAME.easier} common.version.easier
          const newFileName = file.replace(/\${JOB.NAME\.easier}/g, jobName.toUpperCase()).replace(/\${common.version\.easier}/g,commonVersion);
          if (newFileName !== file) {
            const newFilePath = path.join(directoryPath, newFileName);
            fs.renameSync(filePath, newFilePath);
            console.log(`File '${filePath}' ${yellow}renamed to '${newFileName}' successfully.${reset}`);
          }
        }
      });
    } catch (error) {
      console.error(`Error processing directory '${directoryPath}': ${error.message}`);
    }
  }
  
  async function generateSpringBatchProject(projectName, templatePath) {
    try {
      console.log(`
    ************************************************************
    *                                                          *
    *             EASIER CLI Tool                              *
    *             Generating your Spring Batch project...      *
    *             Please wait...                               *
    *                                                          *
    ************************************************************
      `);
      // Create a new directory for the project.
      createFolder(projectName);
      // Copy the template to the project directory.
      fs_extra.copySync(templatePath, projectName);
      // Get the package name synchronously
      console.log('Description : \n');
      const description = readlineSync.question('Enter the description of ' + yellow + projectName + reset + ': ');
      // Get the package name synchronously
      console.log('Package : \n');
      const packageName = readlineSync.question('Enter the package name: ');
      //get database name 
      console.log('Data Base  : \n');
      const dataBaseName = readlineSync.question('Enter the database name: ');
       //get job name 

       console.log('Job Name  : \n');
       const jobName = readlineSync.question('Enter the Job name: ');

       console.log('common Version  : \n');
       const commonVersion = readlineSync.question('Enter the abb flux  common version: ');

      // Process the project directory and replace tokens
      processDirectory(projectName, projectName, packageName,jobName.toUpperCase(),commonVersion);
      // Add or update the description in the README.md file
      const readmeFilePath = path.join(projectName, 'README.md');
      const readmeContent = fs.readFileSync(readmeFilePath, 'utf-8');
      // Look for the existence of a description section
      const descriptionSectionRegex = /## Description([\s\S]*?)(?=##|$)/;
      const hasDescriptionSection = descriptionSectionRegex.test(readmeContent);
      // If a description section exists, update it; otherwise, add a new section
      const updatedReadmeContent = hasDescriptionSection
        ? readmeContent.replace(descriptionSectionRegex, `## Description\n\n${description}\n\n`)
        : readmeContent + `\n\n## Description\n\n${description}\n\n`;
      fs.writeFileSync(readmeFilePath, updatedReadmeContent);
      console.log(`Spring Batch project '${projectName}' generated from the template.`);
    } catch (error) {
      console.error(`Error generating the Spring Batch project: ${error.message}`);
    }
  }
  
  
module.exports = { displayVersion, displayHelp,
   displayeasierInfo,createFolder, generateHTMLFile,
   createFileInSubfolder,displayDirectoryTree,generateReactNativeApp,
   historyCommands,displayCommandHistory,removeEasier,checkEasierFile,
   generateSpringBatchProject,
  cyan, red, green, reset };
