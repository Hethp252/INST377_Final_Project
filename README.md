# INST377 Final Project

## Title: Portfolio checker

# Description:

#### Home
Welcome page with a button that leads to the dashboard. With a navigation bar that makes it easier to access different pages.

#### Dashboard
This page connects directly to the Polygon API for current market data and allows users to save target watchlists that they can access later through Supabase. There is a drop-down menu to select between 7 days, 30 days, or 90 days. With an analysis button that uses an API and JavaScript library to graph the data, and there is a watchlist button that adds the ticker to the Supabase database, as shown below. Sometimes you have to use a refresh button to see the Supabase database update. There is a navigation bar that makes it easier to access different pages.

#### About
This page has a short description of the overall project. Then, a map showing where "our headquarters" is, which is shown on an interactive map using the leaflet JavaScript library. "Our headquarters" are located at the Hornbake Library in UMD.

# Target browsers
Any browser can access this website. For example, it can be used on Android and IOS on smartphones if a user is outside where they can't access their computer and wants to check their portfolio. They can also just use it on any computer, whether it is on Windows, Mac, or Linux, as long as the device has a browser, it can be used and accessed.

```
The Developer Manual is below
```


# Developer Manual

They can clone my git repository because it is a public repository. They would need an API key from the Polygon API, which is free with a free account. They would also need a Supabase URL and a Supabase Key, which are also free as long as the developer has a free account. The developer needs a Vercel account and connects the git repo to their Vercel account. Vercel is to compile the web application.

### What different files and folders do

The API folder has the index.js file, which consists of the Supabase URL and the Supabase Key. This file has the code that allows users to add data to the Supabase database. It also has the GET, POST, and all the other endpoints. All the Supabase-related code is found here.

In the public folder, you will find the code for all the web pages. The index.html file has the HTML code for the home page, the Project.html file has the code for the dashboard page, and the about.html has the about page code. Script.js has the code for all the frontend JavaScript code for all the webpages. The Script.js file also has the API key call code and other API requests. Style.css has the CSS code that styles all three web pages. package.json and package-lock.json have all the packages that make the Vercel, node, etc., work together. Vercel.json allows the repository to communicate with Vercel so that the application can compile and be visible to the users. The node_modules folder has the packages/dependencies used by Node, Express, etc.

### Personal recommendation for future development

For future development, my recommendation to the person who will work on my code is that DO NOT touch Vercel.json or any of the package files. Only make changes to the files in the API and Public folders. Most of the code is testing and fixing, so each time you want to test it, you have to commit and push to GitHub, where Vercel will update the deployment. If it doesn't, then redeploy manually after pushing to GitHub.