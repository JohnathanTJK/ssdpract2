import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Add this middleware BEFORE your routes
app.use(express.urlencoded({ extended: true }));

// Get __dirname equivalent (needed in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint
app.post('/check', (req, res) => {
  const input = req.body.userInput;

  if (!endpointValidateInput(input)) {
    // If validation fails, send 400 Bad Request with an error message
    return res.status(400).send('Invalid input');
  }

  // If validation passes, send success response
  res.send(`You submitted: ${input}`);
});

// Helper function to get the current timestamp
export function getCurrentTimestamp() {
  return new Date().toISOString();
}
export function endpointValidateInput(text) {
  return text === "hi";
}

// Start the server
const PORT = 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server };
