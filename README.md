# This project is a public chat room using React to build the front-end and Google Firebase as the back-end.

## Features
- Logged in users could send texts, images, and emojis. The User profile image and display name could be modified.
- Firebase Authentication is used for user email password login as well as using google account login.
- Firebase Firestore Database is used for storing chat messages.
- Firebase Storage is used to store the image message and generate the public URL to be stored in Firestore.
- Local weather data would be fetched via third-party API when the user gave permission to use the geolocation.
- Converted the JavaScript code base over to TypeScript.
- Used React Testing Library to test components.
- Used Github actions to perform the CICD.

The live project is hosted using Firebase, feel free to have a play around with it:
https://aaronlin-project-chatroom.web.app/

## Run the application locally
To run the application locally, clone the chatroom repo and install the dependencies:
```console
$ git clone https://github.com/Aaron-Lin-74/chatroom-project.git
$ cd chatroom-project
$ npm install
$ npm start
```
Since the application used Firebase as the backend service, you might need to create your own Firebase account and set up 
the Authentication, Firestore and Storage. And create a .env file for all Firebase secrets. 
Please use the live demo instead.

### Running Tests

To run the test suite, first install the dependencies, then run `npm test`:

```console
$ npm install
$ npm test
```

## License

  [MIT](LICENSE)
