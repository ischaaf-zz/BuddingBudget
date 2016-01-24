# BuddingBudget

You need to install nodejs and npm (node package manager) in your os of choice. Then, run these two commands -

npm install -g phonegap
npm install -g cordova
(You may need to use sudo in Linux, or run the command prompt as an administrator in Windows)

--------------------------------

There's an app store on the "PhoneGap Developer App" which lets you test the app on your phone without dealing with building it an all that nonsense. To run that, navigate to the app directory in your terminal and run the command "phonegap serve". You can then connect to the given IP in the phonegap developer app to test the application on the phone.

--------------------------------

That will probably be enough in most cases, but unfortunately, local notifications don't work through that method. To test those, we need to run it on an actual device or an emulator of one. I tried getting the Android emulator running on my machine, but had no luck.

However, I was able to get the app running on an actual android device by turning on developer mode, and USB debugging (method varies based on device and android version), plugging it in to a USB port, and running this command -

cordova run --device