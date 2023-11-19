# Proof of Concept for AutoTesting tool

1) Open main-window.ts. Set const defaultUrl to any website you want
2) run ```npm start```. It will run Electron application with your URL inside. Features:
   - Listen for all website requests for specific protocol, get their responces.
   - Modify any request params. Modify any responce data. E.g. you can prepare test data for /fetchUsers request and your website will use it
   - There will be second Electron window: You will see all images and links from website there
   
It logs all requests and responses, it logs all links you've clicked on website. Supports MacOS, Windows. You can build it in prod using ```npm run electron:build```
