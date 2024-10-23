# Executor App Frontend

Welcome to the Executor App Frontend project! This project serves as the front end for managing and executing commands across a fleet of executors. It's designed to provide an intuitive and interactive interface for efficient command execution.

## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [Scripts](#scripts)

## Technologies

- **React**: The primary library for building user interfaces.
- **Flowbite React**: UI components for React.
- **ApexCharts**: For data visualization.
- **Webpack**: Module bundler.
- **Tailwind CSS**: For styling.
- **TypeScript**: For static typing.

## Setup

### Prerequisites

- Node.js
- NPM (Node Package Manager)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/executor-app.git
    cd executor-app/frontend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Generate TypeScript types from OpenAPI spec:
    ```sh
    npm run gen-types
    ```

4. Start the development server:
    ```sh
    npm start
    ```

### Building for Production

1. Build the project for production:
    ```sh
    npm run build-prod
    ```

## Usage

1. Ensure the backend grpc and gateway server are running.
2. Open your browser and navigate to `http://localhost:8080`.

## Scripts

- **`start`**: Starts the development server.
- **`gen-types`**: Generates TypeScript types from OpenAPI specification.
- **`build`**: Builds the project for development.
- **`build-prod`**: Builds the project for production.
- **`test`**: Runs tests using Jest.
- **`clean`**: Cleans the build directory.

