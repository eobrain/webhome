# Eamonn's Web Home Source

Source for Eamonn's home page on the web, http://eamonn.org

Prerequities:

1.  install [nvm][1]
2.  `nvm install stable`
3.  `nvm use stable`
4.  `npm install -g firebase-tools`
5.  `firebase login`
6.  On Linux or ChromeOS
    1.  `sudo apt install make m4 node-typescript python`


Building


1.  `cd` to webhome directory
2.  `make`


Local serving

1.  `make serve`
2.  open http://localhost:8000

Publish

1.  `firebase use --add
2.  `make publish`

[1]: https://github.com/creationix/nvm