#!/usr/bin/env node
const readline = require('readline');
const path = require('path');

const { 
  displayVersion, 
  displayHelp, 
  displayeasierInfo, 
  generateHTMLFile, 
  createFolder,
  createFileInSubfolder,
  displayDirectoryTree,
  generateReactNativeApp,
  downloadEasierLanguage,  // Import the new function
  historyCommands,
  displayCommandHistory,
  removeEasier,
  checkEasierFile,
  generateSpringBatchProject,
  cyan, red, green, reset 
} = require('./utils');

function main() {
  const commandArgs = process.argv.slice(2);
  historyCommands(commandArgs);

  if (commandArgs.length === 0 || (commandArgs.length === 1 && commandArgs[0] ===el)) {
    // Display help if no arguments or onlyel is provided
    displayHelp();
  }
  else if (commandArgs[0] === '--version' || commandArgs[0] === '-v') {
    displayVersion();
  } 
  else if (commandArgs[0] === '--help' || commandArgs[0] === '-h') {
    displayHelp();
  } 
  else if (commandArgs[0] === '--info' || commandArgs[0] === '-i') {
    displayeasierInfo();
  } 
  else if (commandArgs[0] === '--display-history' || commandArgs[0] === '-dh') {
    displayCommandHistory();
  }
  else if (commandArgs[0] === '--remove' || commandArgs[0] === '-r') {
    // Ask the user if they want to remove EASIER
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Do you want to remove EASIER? (yes/no): ', (answer) => {
      rl.close();
      
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        removeEasier();
      } else {
        console.log('Removal canceled.');
      }
    });
  }
  else if (commandArgs[0] === 'generate' || commandArgs[0] === '-g') {
    if (commandArgs.length !== 2) {
      console.error(`Usage: ${red}generate <name>${reset}`);
      process.exit(1);
    } else {
      generateHTMLFile(commandArgs[1]);
    }
  } 
  else if (commandArgs[0] === 'create' || commandArgs[0] === '-c') {
    if (commandArgs.length !== 2) {
      console.error(`Usage: ${red}create <folderName>${reset}`);
      process.exit(1);
    } else {
      createFolder(commandArgs[1]);
    }
  }
  else if (commandArgs[0] === 'create-file' || commandArgs[0] === '-cf') {
    if (commandArgs.length !== 3) {
      console.error(`Usage: ${red}create-file <subfolderName> <file-name>${reset}`);
      process.exit(1);
    } else {
      createFileInSubfolder(commandArgs[1], commandArgs[2]);
    }
  } 
  else if (commandArgs[0] === 'tree' || commandArgs[0] === '-t') {
    if (commandArgs.length !== 2) {
      console.error(`Usage: ${red}tree <directory-path>${reset}`);
      process.exit(1);
    } else {
      displayDirectoryTree(commandArgs[1], true);
    }
  }
  else if (commandArgs[0] === 'generate-react-native') {
    if (commandArgs.length !== 2) {
      console.error(`Usage: ${red}generate-react-native <app-name>${reset}`);
      process.exit(1);
    } else {
      const appName = commandArgs[1];
      generateReactNativeApp(appName);
    }
  } 
  // NEW: Download Easier Language command
  else if (commandArgs[0] === 'download-language' || commandArgs[0] === '-dl') {
    if (commandArgs.length !== 2) {
      console.error(`Usage: ${red}download-language <project-name>${reset}`);
      console.log(`Example: ${cyan}easier download-language my-easier-project${reset}`);
      process.exit(1);
    } else {
      const projectName = commandArgs[1];
      downloadEasierLanguage(projectName);
    }
  }
  else if (commandArgs[0] === 'check-file' || commandArgs[0] === '-chk') {
    checkEasierFile();
  } 
  else {
    console.error(`${red}Error: Unknown command '${commandArgs[0]}'${reset}`);
    console.log(`${cyan}Run 'easier --help' to see available commands.${reset}`);
    process.exit(1);
  }
}

main();
