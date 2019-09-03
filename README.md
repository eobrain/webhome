# Eamonn's Web Home Source

Source for Eamonn's home page on the web, http://eamonn.org

Prerequities:

1. For generating site
    1. install [rvm][2]
    2. `rvm install 2.6.4`
    3. `rvm use 2.6.4`
2. For deploying to FIrebase histing
   1. install [nvm][1]
   2. `nvm install stable`
   3. `nvm use stable`
   4. `npm install -g firebase-tools`
   5. `firebase login`



Building

1. `cd` to webhome directory
2. `jekyll build`

Local serving

1. `jekyll serve`
2. open http://localhost:4000

Publish

1. `firebase use --add`
2. `jekyll build`
3. `firebase deploy`

[1]: https://github.com/creationix/nvm
[2]: http://rvm.io/1
