#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const { createInterface } = require("readline");

const checklist = {
  intro:
    "Make sure to follow these steps before you click on the merge button. We know that you are excited to merge your things, but let's be safe first.",
  sections: [
    {
      title: "Mobile",
      description:
        "Make sure to verify your feature on the app and mobile browser",
      items: ["Check on Android", "Check on IOS", "Check on mobile browser"],
    },
    {
      title: "Unit test",
      description: "Make sure to add proper unit tests to your feature.",
      items: [
        "Add tests to your feature thinking about the customer actions (ex. clicks, hovers, focus, etc.)",
        "If there are more variants make sure to cover all of them.",
        "Make sure to verify a11y and (if necessary) add a11y tests.",
      ],
    },
    {
      title: "Cross browser test",
      description:
        "Sometimes browsers act different, and customers can have a different browser than you, so make sure to tests your features on the most common browsers.",
      items: ["Firefox", "Chrome", "Safari (if needed)"],
    },
    {
      title: "Different accounts",
      description:
        "If you think is necessary to verify, make sure to login into a business account and test your feature.",
      items: ["Check with Business Account"],
    },
    {
      title: "Translations",
      description: "Our texts needs to be translated so follow these steps.",
      items: [
        "Add texts to rosetta (stg and pro)",
        "Request translations to french.",
      ],
    },
    {
      title: "Mock data",
      description:
        "We have generated mock data based on rosetta texts, but sometimes we need different edge cases, and the generated texts is not the best option, so make sure to follow these steps.",
      items: [
        "Verify long texts (ex. product names, partner names)",
        "Verify special texts (ex. dynamic data)",
      ],
    },
    {
      title: "Happy flows",
      description:
        "Make sure to execute your whole flow, doing manual tests, like what happens if we have an error, what happen if we don't have data, or maybe we have a slow connection:",
      items: [
        "Check what happens if error occured",
        "Check what happens if data isn't there (empy states?)",
        "Check what happen if we have slow connection.",
        "Check with long status/messages/names",
        "Double check by other frontend on feature env.",
        "Verify the story of your feature and make sure it is aligned, if something is not covered check with the reporter.",
        "Check if is necessary to add cypress tests (this can also be in a separate story).",
      ],
    },
    {
      title: "After merging",
      description:
        "You are done but sort of, your MR is merged but it is important to keep an eye on your feature, so follow these steps to make sure all is good:",
      items: [
        "Check logs",
        "Check performance",
        "Check translations and make sure that your feature looks good on both languages, if not check with your favorite designer for the best option.",
        "Verify that tagging it is correct on stg and pro, and double check with your favorite business person. (optional)",
        "Checked with design before going to PRO",
      ],
    },
  ],
};

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

program
  .version("1.0.0")
  .description("A pre-push checklist tool")
  .action(async () => {
    console.log(chalk.blue("Pre-Push Checklist:"));
    console.log(chalk.gray(checklist.intro));
    console.log();

    const uncheckedItems = [];
    let allChecked = true;
    for (const [sectionIndex, section] of checklist.sections.entries()) {
      console.log(chalk.yellow(`${sectionIndex + 1}. ${section.title}`));
      console.log(chalk.gray(section.description));

      for (const [itemIndex, item] of section.items.entries()) {
        const answer = await new Promise((resolve) => {
          rl.question(`${item} (y/N) `, resolve);
        });

        if (answer.toLowerCase() !== "y") {
          allChecked = false;
          uncheckedItems.push(`${section.title}: ${item}`);
        }
      }

      console.log(); // Add a newline between sections
    }

    rl.close();

    if (allChecked) {
      console.log(
        chalk.green(
          "Great! You have completed all checks. You can proceed with your push."
        )
      );
      process.exit(0);
    } else {
      console.log(chalk.red("The following items are still unchecked:"));
      uncheckedItems.forEach((item) => console.log(chalk.red(`- ${item}`)));
      console.log(chalk.red("Please complete all checks before pushing."));
      process.exit(1);
    }
  });

program.parse(process.argv);
