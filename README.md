# Version / Analytics server

Small server that exposes a single endpoint that returns the latests GitHub releases. The application can use this to check if it's on the latest version.

The server also saves incoming requests based on the hash of the app's URL (which makes it anonymous) so we have an idea of how many people are using Directus.

## Installation

Clone this repo and install the `npm` dependencies by running

```bash
$ npm install
```

## Usage

Duplicate the `.env.example` to `.env` and add the values.

Run the application by running `npm start`
