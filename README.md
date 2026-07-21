# Telnyx E2E Automation Tests

This repository contains an automated End-to-End (E2E) testing framework for the [Telnyx](https://telnyx.com/) website. The project is built using **WebdriverIO (v8)**, **TypeScript**, and implements the Page Object Model (POM) design pattern.

## 🚀 Features

- **Cross-Browser Testing:** Configured to run tests on Google Chrome, Mozilla Firefox, and Microsoft Edge.
- **Cross-Environment Execution:** Easily switch between different environments (e.g., Production, QA) using environment variables.
- **Docker Integration:** Containerized setup for seamless execution locally and on CI/CD pipelines.
- **Allure Reporting:** Comprehensive and visual test reports with Allure.
- **CI/CD Pipeline:** GitHub Actions workflow integrated to run tests on push/pull requests and deploy reports to GitHub Pages.

---

## 🛠️ Tech Stack

- **Framework:** WebdriverIO
- **Language:** TypeScript
- **Assertion Library:** Expect-WebdriverIO
- **Reporter:** Allure Reporter
- **Environment Management:** cross-env
- **Containerization:** Docker & Docker Compose

---

## 📦 Installation

1. **Clone the repository:**

```bash
git clone <your-repository-url>
cd telnyx-wdio
```

2. **Install dependencies:**

```bash
npm install
```

---

## 🏃‍♂️ Running Tests (NPM Scripts)

The project includes several predefined scripts in `package.json` for different execution strategies:

| Command	                    | Description                                                                         |
|-------------------------------|-------------------------------------------------------------------------------------|
| npm run test	                | Runs tests using the default configuration (usually all browsers or default setup). |
| npm run test:single -- <path>	| Runs a specific test file using the Chrome configuration.                           |
| npm run test:chrome	        | Runs all tests exclusively in Google Chrome.                                        |
| npm run test:firefox	        | Runs all tests exclusively in Mozilla Firefox.                                      |
| npm run test:edge	            | Runs all tests exclusively in Microsoft Edge.                                       |
| npm run test:qa	            | Runs tests in the QA environment by overriding the BASE_URL.                        |

*Note: Make sure you have the respective browsers installed on your local machine to run these commands successfully.*

---

## 🐳 Running Tests via Docker

To avoid local environment dependencies, you can run the entire test suite inside a Docker container.

1. Build and run the container:

```bash
docker-compose up --build
```

*This command maps the `allure-results` volume, meaning the test results generated inside the container will be saved to your local machine.*

2. Run a specific npm script via Docker:

```bash
docker-compose run wdio-tests npm run test:chrome
```

---

## 📊 Allure Reporting

After executing the tests, an allure-results folder will be generated. To view the HTML report:

1. Generate the report:

```bash
npm run report:generate
```

2. Open the report in your browser:
```bash
npm run report:open
```

---

## 🔄 CI/CD Pipeline & GitHub Pages

This project utilizes GitHub Actions for Continuous Integration.
* The pipeline triggers on pushes to the main branch.
* It executes the full test suite in headless browsers (Chrome, Firefox, Edge).
* Upon completion, Allure generates a static HTML report.
* The report is automatically deployed to GitHub Pages, providing a public URL to view the latest test execution results.

---

## 📁 Project Structure

```Plaintext
├── configs/                  # WebdriverIO configurations per browser
│   ├── wdio.conf.ts          # Base configuration
│   ├── wdio.chrome.conf.ts   # Chrome specific config
│   ├── wdio.firefox.conf.ts  # Firefox specific config
│   └── wdio.edge.conf.ts     # Edge specific config
├── test/
│   ├── pageobjects/          # Encapsulated page elements and methods (POM)
│   ├── specs/                # E2E test files
│   └── data/                 # Test data (URLs, credentials, etc.)
├── .github/workflows/        # GitHub Actions CI pipeline
├── Dockerfile                # Docker image configuration
├── docker-compose.yml        # Docker compose configuration
├── package.json              # Project metadata and dependencies
└── tsconfig.json             # TypeScript compiler options
```

---