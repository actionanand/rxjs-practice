## RxJs Practice Repo

This course repository is updated to Angular v14:

# Installation pre-requisites

Please use Node 16 (Long Term Support version).

# Installing the Angular CLI

With the following command the angular-cli will be installed globally in your machine:

```bash
npm install -g @angular/cli 
```

# To Run the Development Backend Server

In order to be able to provide realistic examples, we will need in our playground a small REST API backend server. We can start the sample application backend with the following command:

```bash
npm run server
```

This is a small Node REST API server.

# To run the Development UI Server

To run the frontend part of our code, we will use the Angular CLI:

```bash
npm start 
```

- The application is visible at port 4200: [http://localhost:4200](http://localhost:4200)

# Initializing a clean Angular Material Project

These are the commands and steps needed to scaffold a new Angular Material project from scratch,
from an empty folder.

Please make sure to have the latest CLI, and at least NPM 5.

When is doubt, its recommended to update to the latest version of node using a node versioning tool
such as for example [nave](https://github.com/isaacs/nave) or [nvm-windows](https://github.com/coreybutler/nvm-windows).

# Step 1 - Scaffold a clean project using the Angular CLI

With a CLI version 1.5 or above, let's scaffold a new project with routing:

```bash
ng new angular-material-hello-world --routing
```

# Step 2 - Installing Angular Material dependencies

Next, let's install these dependencies:

```bash
npm install @angular/material @angular/cdk  @angular/animations hammerjs
```

# Step 3 - Adding Google Material Icons Font

Let's add this to our index.html:

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

# Step 4 - choosing a Theme

Before starting to import components, let's choose a widget theme, have a look at the themes available

inside `node_modules/@angular/material/prebuild-themes`.

We can for example use the Indigo Pink theme by adding this line to our styles.css file:

```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
```