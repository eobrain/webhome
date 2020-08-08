# Eamonn's Web Home Source

Source for Eamonn's home page on the web, http://eamonn.org

Prerequities:

1. For generating site
    1. install [rvm][2]
    2. `rvm install 2.6.4`
    3. `rvm use 2.6.4`
    4. [Install minify][3]
    5. `sudo apt-get install default-jdk`
    6. `gem install bundler jekyll`
2. For deploying to Firebase hosting
   1. install [nvm][1]
   2. `nvm install stable`
   3. `nvm use stable`
   4. `npm install -g firebase-tools`
   5. `firebase login`
   6. `firebase use --add`

If you want to use Google Analytics add a local file called `_secret.yml` containing

```yaml
jekyll_analytics:
  GoogleAnalytics:
    id: UA-XXXXXXX-X
```

(Replacing `UA-XXXXXXX-X` with your tracking ID.)


Local building and serving

1. `npx bajel compile`
2. `npx bajel serve`
3. open http://localhost:8000

Publish

1. `npx bajel deploy`

[1]: https://github.com/creationix/nvm
[2]: http://rvm.io/1
[3]: https://github.com/tdewolff/minify/tree/master/cmd/minify
