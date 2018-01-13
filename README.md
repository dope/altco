# Altco

Following crypto heavily I wanted to create a simple chrome extension which
wasn't too distracting but was good enough to give me a quick update or if
I wanted I could take a time to catch up on the latest headlines.

### Installation

The most easiest method is installing through the Chrome Store [here](https://chrome.google.com/webstore/detail/altco/dlmjmklpkfldkhbfkkhbnegfiacaognj)

Alternatively you can download the project
[here](https://github.com/dope/altco/archive/master.zip) and add it to chrome as a local
extension like this:

- Navigate to chrome://extensions
- Expand the Developer dropdown menu and click “Load Unpacked Extension”
- Navigate to the local folder containing the extension’s code and click Ok
- Assuming there are no errors, the extension should load into your browser
> Taken from here: https://superuser.com/questions/247651/how-does-one-install-an-extension-for-chrome-browser-from-the-local-file-system

### Build

If you want to run it locally as a _website_ you can achieve this with the
following steps

```git clone git@github.com:dope/altco.git```
``` cd altco && open src/override.html```
