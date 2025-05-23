<p align="end">
   <a href="https://semantic-release.gitbook.io">
    <img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release">
  </a>
</p>

# ![alt text](public/icon/32.png) ShalaDarpan Quick

This is a browser extension for ShalaDarpan website. It has various utility buttons/functions to make the website experience more seamless.

## Installation 🏗️

1. Go to [releases page](https://github.com/curiosbasant/sd-quick/releases).
2. Download the latest released zip file for your desired browser.
3. Unzip the downloaded file.
4. Open Chrome and go to [chrome://extensions](chrome://extensions).
5. Make sure the `Developer Mode` switch is enabled.
6. Click on `Load unpacked` and select the unzipped folder.
7. You should see the extension icon in the toolbar.
8. And that's it.

## Features ✨

1. Make the **session** last longer by reducing unexpected logouts.
2. Adds clear **page titles** so you can easily identify open tabs.
3. Keeps dropdown menu links on a single line to prevent layout issues.
4. Auto-fill the dropdowns for current session, section, stream, subject, etc.
5. Removes repetitive invalid captcha annoying alert messages.
6. Adds a button to auto-fill random numbers for **monthly WIFS entry**.
7. Generates random marks for optional subjects in **result entry**.
8. Generates random values for **SA Entry**.
9. Adds a button to mark all staff as present with one click.
10. Adds a button to print student Form 5 instantly.
11. Download all class student mark sheets with one click.
12. Filter the TC list by date.
13. _...and much more!_

## Contribution 🚧

We welcome and encourage contributions from everyone! 🚀
Whether you're a seasoned developer, a beginner, or just someone with ideas to improve ShalaDarpan Quick, your input is valuable. If you spot a bug, have a feature suggestion, or want to help with documentation, feel free to open an issue or submit a pull request. Let's make this project better together!

### Project Setup

To set up the project for development, follow these steps:

1. **Install Node.js (version 20.x):**

   - Download and install Node.js v20 from the [official Node.js downloads page](https://nodejs.org/en/download/).
   - You can verify your installation by running `node -v` in your terminal. It should output something like `v20.x.x`.

2. **Clone the repository from GitHub:**

   - Open your terminal and run:
     ```bash
     git clone https://github.com/curiosbasant/sd-quick.git
     ```
   - Change into the project directory:
     ```bash
     cd sd-quick
     ```

3. **Install dependencies using pnpm:**

   - If you don't have [pnpm](https://pnpm.io/installation) installed, install it globally:
     ```bash
     npm install -g pnpm
     ```
   - Then, install the project dependencies:
     ```bash
     pnpm install
     ```

4. **Start the development server:**
   - Run the following command to start the development build:
     ```bash
     pnpm run dev
     ```

### Tools We Use

This project leverages several modern tools and frameworks to ensure a robust, maintainable, and efficient development workflow. Here’s a detailed explanation of each:

1. [**wxt**](https://wxt.dev) \
   **What it is:** `wxt` is a modern framework for building browser extensions using web technologies. \
   **Why we use it:** It provides a powerful, developer-friendly environment for extension development, including hot reloading, manifest generation, and seamless integration with modern build tools. wxt acts as the backbone of our project, handling the build process and extension-specific requirements.

2. [**TypeScript**](https://www.typescriptlang.org/) \
   **What it is:** TypeScript is a superset of JavaScript that adds static type checking. \
   **Why we use it:** TypeScript helps catch errors at compile time, improves code readability, and makes refactoring safer and easier. It ensures our codebase is more reliable and maintainable, especially as the project grows.

3. [**React**](https://react.dev/) \
   **What it is:** React is a popular JavaScript library for building user interfaces, especially single-page applications. \
   **Why we use it:** React enables us to create reusable, interactive UI components. Its declarative nature makes it easier to reason about the UI state and manage complex user interactions within the extension.

4. [**Tailwind CSS**](https://tailwindcss.com/) \
   **What it is:** Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. \
   **Why we use it:** It allows us to style components directly in our markup using utility classes, which speeds up development and keeps our styles consistent and easy to manage. Tailwind’s approach also reduces the need for writing custom CSS.

These tools together provide a solid foundation for building a modern, scalable browser extension with a great developer experience.

### 🛠️ Found a bug? Have a feature request? Want to share your ideas?

We value your feedback and contributions! If you encounter any issues, notice unexpected behavior, or have suggestions for new features and improvements, please don't hesitate to let us know.

- **Open an issue:** Visit our [GitHub Issues page](https://github.com/curiosbasant/sd-quick/issues) to report bugs, request enhancements, or start a discussion.
- **Describe clearly:** When submitting an issue, please provide as much detail as possible—screenshots, steps to reproduce, and your environment (browser, OS, etc.) help us resolve things faster.
- **Suggest improvements:** Even if you just have an idea or a small suggestion, we’d love to hear it!

> Your input helps us make this project better for everyone.
