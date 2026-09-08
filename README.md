# Weather Intelligence App

## Project Brief
A single-page web application built with React and Tailwind CSS that provides real-time weather data and forecasts for any city in the world. 

**Key Features:**
* **Current Conditions:** Displays real-time temperature, "feels like" temp, humidity, wind speed, and Air Quality Index (AQI), alongside the accurate local time of the searched city.
* **Hourly Forecast:** A responsive 12-hour forecast grid.
* **7-Day Forecast:** An interactive row of daily forecasts that expands to show precipitation and wind details.
* **Data Visualizations:** Temperature trend line charts and precipitation bar charts built with Recharts.
* **Dynamic Theming:** The app's color palette subtly shifts to reflect the current weather (e.g., warm tones for sunny skies, cool blues for rain, dark slate for thunderstorms).
* **API Integration:** Powered by the free Open-Meteo Geocoding, Air Quality, and Weather APIs (no API key required).

## Editing with Gemini AI Studio
This project is designed to be easily iteratively modified using Google AI Studio's agentic environment. 

**How to edit:**
1. Open the project within the AI Studio Build environment.
2. Use the chat interface to describe your desired changes in natural language (e.g., *"Add a UV index to the current conditions"* or *"Change the font family"*).
3. The AI agent will automatically locate the relevant React components, write the TypeScript code, and compile the application.
4. View your changes instantly in the live preview window.

## Version Control & Deployment (GitHub + Cloudflare)

### Step 1: Version Control with GitHub
1. **Export Code:** From the AI Studio interface, use the export menu to download the project as a ZIP file or export directly to a GitHub repository if the integration is set up.
2. **Initialize Git (if downloaded manually):** Open your terminal in the project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit from AI Studio"
   ```
3. **Push to GitHub:** Create a new repository on GitHub and push your local code to the `main` branch.

### Step 2: Updating the Cloudflare Deployment
Cloudflare Pages provides seamless hosting that automatically syncs with your GitHub repository. To deploy updates to your live application:

1. Make your code changes and commit them to your local repository.
2. Push your changes to the `main` branch on GitHub.
3. Cloudflare will automatically detect the new commit, build the app, and deploy the updated version to your live URL.
4. You can monitor the build progress, review deployment logs, or adjust settings by logging into your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigating to **Workers & Pages**.
