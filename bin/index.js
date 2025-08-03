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
  downloadEasierLanguage,  // Original GitHub clone method
  downloadEasierLanguageFromArtifacts,  // New artifact download method
  displayContextMemory,
  detectOperatingSystem,
  historyCommands,
  displayCommandHistory,
  removeEasier,
  checkEasierFile,
  generateSpringBatchProject,
  cyan, red, green, reset, yellow
} = require('./utils');

function displayWelcomeBanner() {
  console.log(`
  ************************************************************
  *                                                          *
  *                 ${green}EASIER CLI Tool${reset}                  *
  *                  Enhanced Version                        *
  *               Artifact Download Ready                    *
  *                                                          *
  ************************************************************
  `);
  
  const osInfo = detectOperatingSystem();
  console.log(`${cyan}🖥️  Detected System: ${osInfo.displayName}${reset}`);
  console.log(`${cyan}🏗️  Architecture: ${osInfo.arch}${reset}`);
  console.log(`${cyan}📦 Ready for artifact downloads!${reset}\n`);
}

function main() {
  const commandArgs = process.argv.slice(2);
  
  // Store command in history for context memory
  historyCommands(commandArgs);

  // If no arguments provided, show enhanced welcome
  if (commandArgs.length === 0 || (commandArgs.length === 1 && commandArgs[0] === 'easier')) {
    displayWelcomeBanner();
    displayHelp();
    return;
  }

  // Handle version commands
  if (commandArgs[0] === '--version' || commandArgs[0] === '-v') {
    displayVersion();
  }
  
  // Handle help commands
  else if (commandArgs[0] === '--help' || commandArgs[0] === '-h') {
    displayHelp();
  }
  
  // Handle info commands
  else if (commandArgs[0] === '--info' || commandArgs[0] === '-i') {
    displayeasierInfo();
  }
  
  // Handle history commands
  else if (commandArgs[0] === '--display-history' || commandArgs[0] === '-dh') {
    displayCommandHistory();
  }
  
  // Handle context memory commands (new feature)
  else if (commandArgs[0] === 'context-memory' || commandArgs[0] === '-cm') {
    displayContextMemory();
  }
  
  // Handle remove commands
  else if (commandArgs[0] === '--remove' || commandArgs[0] === '-r') {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
        
    rl.question(`${yellow}Do you want to remove EASIER? (yes/no): ${reset}`, (answer) => {
      rl.close();
            
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        removeEasier();
      } else {
        console.log(`${green}✅ Removal canceled.${reset}`);
      }
    });
  }
  
  // Handle generate HTML commands
  else if (commandArgs[0] === 'generate' || commandArgs[0] === '-g') {
    if (commandArgs.length !== 2) {
      console.error(`${red}Usage: generate <name>${reset}`);
      console.log(`${yellow}Example: easier generate mypage${reset}`);
      process.exit(1);
    } else {
      generateHTMLFile(commandArgs[1]);
    }
  }
  
  // Handle create folder commands
  else if (commandArgs[0] === 'create' || commandArgs[0] === '-c') {
    if (commandArgs.length !== 2) {
      console.error(`${red}Usage: create <folderName>${reset}`);
      console.log(`${yellow}Example: easier create my-project${reset}`);
      process.exit(1);
    } else {
      createFolder(commandArgs[1]);
    }
  }
  
  // Handle create file commands
  else if (commandArgs[0] === 'create-file' || commandArgs[0] === '-cf') {
    if (commandArgs.length !== 3) {
      console.error(`${red}Usage: create-file <subfolderName> <file-name>${reset}`);
      console.log(`${yellow}Example: easier create-file src index.js${reset}`);
      process.exit(1);
    } else {
      createFileInSubfolder(commandArgs[1], commandArgs[2]);
    }
  }
  
  // Handle tree commands
  else if (commandArgs[0] === 'tree' || commandArgs[0] === '-t') {
    if (commandArgs.length !== 2) {
      console.error(`${red}Usage: tree <directory-path>${reset}`);
      console.log(`${yellow}Example: easier tree ./src${reset}`);
      process.exit(1);
    } else {
      displayDirectoryTree(commandArgs[1], true);
    }
  }
  
  // Handle React Native generation
  else if (commandArgs[0] === 'generate-react-native') {
    if (commandArgs.length !== 2) {
      console.error(`${red}Usage: generate-react-native <app-name>${reset}`);
      console.log(`${yellow}Example: easier generate-react-native MyAwesomeApp${reset}`);
      process.exit(1);
    } else {
      const appName = commandArgs[1];
      generateReactNativeApp(appName);
    }
  }
  
  // Handle original download language command (GitHub clone method)
  else if (commandArgs[0] === 'download-language' || commandArgs[0] === '-dl') {
    if (commandArgs.length !== 2) {
      console.error(`${red}Usage: download-language <project-name>${reset}`);
      console.log(`${yellow}Example: easier download-language my-easier-project${reset}`);
      console.log(`${cyan}💡 This command clones the repository from GitHub${reset}`);
      process.exit(1);
    } else {
      const projectName = commandArgs[1];
      downloadEasierLanguage(projectName);
    }
  }
  
  // Handle NEW artifact download command
  else if (commandArgs[0] === 'download-artifacts' || commandArgs[0] === '-da') {
    if (commandArgs.length < 2) {
      console.error(`${red}Usage: download-artifacts <project-name> [repo-owner/repo-name]${reset}`);
      console.log(`${yellow}Examples:${reset}`);
      console.log(`  easier download-artifacts my-project`);
      console.log(`  easier download-artifacts my-project custom-owner/custom-repo`);
      console.log(`${cyan}💡 This command downloads pre-built artifacts with OS selection${reset}`);
      console.log(`${cyan}🎯 Automatically detects your operating system${reset}`);
      process.exit(1);
    } else {
      const projectName = commandArgs[1];
      let repoOwner = 'Daftyon';
      let repoName = 'Easier-language';
      
      // Handle custom repository if provided
      if (commandArgs.length >= 3) {
        const repoArg = commandArgs[2];
        if (repoArg.includes('/')) {
          [repoOwner, repoName] = repoArg.split('/');
        }
      }
      
      console.log(`${cyan}🚀 Starting artifact download...${reset}`);
      console.log(`${yellow}📋 Project: ${projectName}${reset}`);
      console.log(`${yellow}📦 Repository: ${repoOwner}/${repoName}${reset}`);
      
      // Use async/await to handle the promise
      (async () => {
        try {
          await downloadEasierLanguageFromArtifacts(projectName, repoOwner, repoName);
        } catch (error) {
          console.error(`${red}❌ Artifact download failed: ${error.message}${reset}`);
          process.exit(1);
        }
      })();
    }
  }
  
  // Handle check file command
  else if (commandArgs[0] === 'check-file' || commandArgs[0] === '-chk') {
    console.log(`${cyan}🔍 Checking for easier.eas file...${reset}`);
    checkEasierFile();
  }
  
  // Handle Spring Batch project generation
  else if (commandArgs[0] === 'generate-spring-batch' || commandArgs[0] === '-gsb') {
    if (commandArgs.length < 3) {
      console.error(`${red}Usage: generate-spring-batch <project-name> <template-path>${reset}`);
      console.log(`${yellow}Example: easier generate-spring-batch my-batch-project ./templates/spring-batch${reset}`);
      process.exit(1);
    } else {
      const projectName = commandArgs[1];
      const templatePath = commandArgs[2];
      
      console.log(`${cyan}🚀 Generating Spring Batch project...${reset}`);
      generateSpringBatchProject(projectName, templatePath);
    }
  }
  
  // Handle system information command (new feature)
  else if (commandArgs[0] === 'system-info' || commandArgs[0] === '-si') {
    const osInfo = detectOperatingSystem();
    console.log(`${cyan}🖥️  System Information:${reset}`);
    console.log(`${yellow}Platform:${reset} ${osInfo.displayName}`);
    console.log(`${yellow}Architecture:${reset} ${osInfo.arch}`);
    console.log(`${yellow}Release:${reset} ${osInfo.release}`);
    console.log(`${yellow}Download Key:${reset} ${osInfo.downloadKey}`);
    console.log(`${yellow}Node.js Version:${reset} ${process.version}`);
    console.log(`${yellow}Platform:${reset} ${process.platform}`);
    console.log(`${yellow}CPU Architecture:${reset} ${process.arch}`);
  }
  
  // Handle interactive mode (new feature)
  else if (commandArgs[0] === 'interactive' || commandArgs[0] === '-int') {
    console.log(`${cyan}🎮 Entering Interactive Mode...${reset}`);
    console.log(`${yellow}💡 Type 'help' for available commands, 'exit' to quit${reset}\n`);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${green}easier> ${reset}`
    });
    
    rl.prompt();
    
    rl.on('line', (line) => {
      const input = line.trim();
      
      if (input === 'exit' || input === 'quit') {
        console.log(`${green}👋 Goodbye!${reset}`);
        rl.close();
        return;
      }
      
      if (input === 'help') {
        console.log(`${cyan}Available commands in interactive mode:${reset}`);
        console.log(`  help - Show this help`);
        console.log(`  system-info - Show system information`);
        console.log(`  context-memory - Show operation history`);
        console.log(`  clear - Clear screen`);
        console.log(`  exit/quit - Exit interactive mode`);
        console.log(`  Any regular easier command (without 'easier' prefix)`);
      } else if (input === 'clear') {
        console.clear();
        displayWelcomeBanner();
      } else if (input === 'system-info') {
        // Execute system-info command
        process.argv = ['node', 'easier', 'system-info'];
        main();
      } else if (input === 'context-memory') {
        displayContextMemory();
      } else if (input.length > 0) {
        // Execute any other command
        const args = input.split(' ');
        process.argv = ['node', 'easier', ...args];
        try {
          main();
        } catch (error) {
          console.error(`${red}❌ Error executing command: ${error.message}${reset}`);
        }
      }
      
      rl.prompt();
    });
    
    rl.on('close', () => {
      console.log(`${green}Interactive mode ended.${reset}`);
      process.exit(0);
    });
    
    // Don't continue with the rest of the function in interactive mode
    return;
  }
  
  // Handle unknown commands
  else {
    console.error(`${red}❌ Error: Unknown command '${commandArgs[0]}'${reset}`);
    console.log(`${cyan}💡 Run 'easier --help' to see available commands.${reset}`);
    console.log(`${cyan}🎮 Try 'easier interactive' for interactive mode.${reset}`);
    
    // Suggest similar commands
    const suggestions = getSuggestions(commandArgs[0]);
    if (suggestions.length > 0) {
      console.log(`${yellow}🔍 Did you mean one of these?${reset}`);
      suggestions.forEach(suggestion => {
        console.log(`  ${cyan}${suggestion}${reset}`);
      });
    }
    
    process.exit(1);
  }
}

// Helper function to suggest similar commands
function getSuggestions(input) {
  const commands = [
    'generate', 'create', 'create-file', 'tree', 'generate-react-native',
    'download-language', 'download-artifacts', 'check-file', 'system-info',
    'context-memory', 'interactive', '--help', '--version', '--info'
  ];
  
  const suggestions = [];
  
  // Simple similarity check
  commands.forEach(cmd => {
    if (cmd.includes(input) || input.includes(cmd) || 
        levenshteinDistance(input, cmd) <= 2) {
      suggestions.push(cmd);
    }
  });
  
  return suggestions.slice(0, 3); // Return max 3 suggestions
}

// Simple Levenshtein distance calculation for command suggestions
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
  console.error(`${red}💥 Uncaught Exception: ${error.message}${reset}`);
  console.log(`${yellow}📧 Please report this issue to: easier@gmail.com${reset}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(`${red}💥 Unhandled Promise Rejection:${reset}`, reason);
  console.log(`${yellow}📧 Please report this issue to: easier@gmail.com${reset}`);
  process.exit(1);
});

// Add process signal handlers for graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n${yellow}👋 Received SIGINT. Gracefully shutting down...${reset}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`\n${yellow}👋 Received SIGTERM. Gracefully shutting down...${reset}`);
  process.exit(0);
});

// Main execution
if (require.main === module) {
  main();
}

module.exports = { main, getSuggestions, levenshteinDistance };