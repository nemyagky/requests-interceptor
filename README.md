# Proof of Concept for AutoTesting tool

1) Open main-window.ts, set defaultUrl to any website you want
2) run ```npm start```. It will run Electron application with this website inside. You will be able to:
   - Listen for all requests for specific protocol
   - Modify response to any of the requests, e.g. you can prepare lots of different possible responses and test them
   - In separated window you will see all images and links from website
   
It logs all requests and responses, it logs all links you've clicked on website. Supports MacOS, Windows. You can build it in prod using ```npm run electron:build```