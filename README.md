# timezone-app/timezone-app/README.md

# Timezone App

This project is a web application that allows users to convert time between different timezones. It provides a user-friendly interface for selecting timezones and entering date and time, and it displays the converted time along with additional information.

## Features

- Select from and to timezones using a dropdown menu.
- Input date and time using a datetime picker.
- View conversion results, including input time, converted time, and raw ISO times.
- Theme toggle to switch between light and dark modes.

## Technologies Used

- React
- TypeScript
- Date-fns
- Zod for form validation
- Tailwind CSS for styling

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd timezone-app
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000`.

## Local Development

To run the application locally:

1. Create `.env.local` in the frontend directory if it doesn't exist
2. Run the local development stack:

## Running Locally (Without Docker)

1. Start the backend:

## Docker

To build and run the application using Docker, follow these steps:

1. Build the Docker image:

   ```
   docker build -t timezone-app .
   ```

2. Run the Docker container:

   ```
   docker run -p 3000:3000 timezone-app
   ```

3. Open your browser and go to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.