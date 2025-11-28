# ApprovIt

Regulatory Approval SaaS - Municipality Sign Approval Presentation Tool

## Description

ApprovIt is a web-based tool designed to help create presentation documents for municipality regulator approval of proposed sign sites. The application allows users to:

- **Upload Plan Drawings**: Upload images (JPEG, PNG, GIF) and PDF files of your plan drawings
- **Map Integration**: Interactive map with GPS coordinate entry for specifying the proposed sign location
- **Project Details**: Enter project information including applicant name, site address, and sign description
- **Document Generation**: Generate a formatted presentation document for municipality approval

## Features

- 📤 Drag-and-drop file upload for plan drawings
- 📍 Interactive Leaflet map with click-to-set location
- 🔢 Manual GPS coordinate entry with validation
- 📋 Project details form for sign information
- 📊 Live preview of presentation document
- 📥 Generate downloadable presentation document

## Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Upload Plan Drawings**: Drag and drop your plan drawings onto the upload area or click to select files
2. **Set Location**: Enter GPS coordinates manually or click on the map to set the proposed sign location
3. **Enter Project Details**: Fill in the project name, applicant name, site address, and sign description
4. **Generate Document**: Click "Generate Presentation Document" to download a formatted text document

## API Endpoints

- `GET /` - Serve the main application
- `POST /api/upload` - Upload plan drawing files
- `GET /api/files` - List uploaded files
- `DELETE /api/files/:filename` - Delete an uploaded file

## Technology Stack

- **Backend**: Node.js with Express
- **File Upload**: Multer
- **Frontend**: HTML5, CSS3, JavaScript
- **Map Integration**: Leaflet with OpenStreetMap tiles

## License

MIT
