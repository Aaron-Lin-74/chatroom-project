# This project is a public chat room using React to build the front-end and Google Firebase as the back-end.

Logged in users could send texts, images, and emojis. The User profile image and display name could be modified.
- Firebase Authentication is used for user email password login as well as using google account login.
- Firebase Firestore Database is used for storing chat messages.
- Firebase Storage is used to store the image message and generate the public URL to be stored in Firestore.
- Local weather data would be fetched via third-party API when the user gave permission to use the geolocation.
- Converted the JavaScript code base over to TypeScript.
- Used React Testing Library to test components.

The live project is hosted using Firebase, feel free to have a play around with it:
https://aaronlin-project-chatroom.web.app/
