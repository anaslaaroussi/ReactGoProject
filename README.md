## Description

this project illustrates the offline synchronization between frontend and backend using PWA (Progressive Web App). this projet is build with:

        - GO Language : for the backend
        - React : for the frontend
        - MongoDb : for database
        - Heroku : for deploying
        - Mlab : for deploying mongoDb database

The user could display several profils of users(name,mail,avatar) and edit the profils even if offline. The project should be open in a window , as soon as the user is online , the backend will be synchronized with the frontend

## backend

The backend is deployed in heroku , please check the : <a href="https://afternoon-dusk-12420.herokuapp.com">Link<a/>

### User Schema

{avatar : String , name:String , email : String }

The avatar here is a Strin , the picture file is in base64 to facilitate the integration with mongoDb database

### /user - Method:POST

To add new users

### /user?id=ID - Method:GET

To get user by ID

### /user?id=ID - Method:PUT

To Update a user by ID

### /user/all - Method:GET

get all the users in the database

## Front end

Please check the <a href="https://glacial-reaches-61165.herokuapp.com/">link</a>.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
