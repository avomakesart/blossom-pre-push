#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');

const checklist = [
  'Run all tests',
  'Update documentation if necessary',
  'Check for lint errors',
  'Review changes in diff view',
  'Ensure commit messages are clear and descriptive',
  'Check for sensitive information in code',
  'Verify all new files are included',
  'Confirm branch is up-to-date with main/master'
];

program
  .version('1.0.0')
  .description('A pre-push checklist tool')
  .action(() => {
    console.log(chalk.blue('Pre-Push Checklist:'));
    checklist.forEach((item, index) => {
      console.log(chalk.yellow(`${index + 1}. ${item}`));
    });

    inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'confirmed',
          message: 'Have you completed all the checks?',
          default: false,
        },
      ])
      .then((answers) => {
        if (answers.confirmed) {
          console.log(chalk.green('Great! You can proceed with your push.'));
          process.exit(0);
        } else {
          console.log(chalk.red('Please complete all checks before pushing.'));
          process.exit(1);
        }
      });
  });

program.parse(process.argv);