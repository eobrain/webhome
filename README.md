# Eamonn's Web Home Source

Source for Eamonn's home page on the web, http://eamonn.org

Prerequities:

1. For generating site
    1. install [rvm][2]
    2. `rvm install 2.6.4`
    3. `rvm use 2.6.4`
    4. `bundle install`
    5. [Install minify][3]
    6. `sudo apt-get install default-jdk`
    7. `gem install bundler jekyll rexml kramdown ffi public_suffix addressable`
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




## Guide to the Repo

* **BUILD.cjs** -- Top-level build file. Invoked with `npx bajel ...`
* **_post/** -- Source markdown for blog bosts
* **_site/** -- Generated static files to be deployed
* **covidgrowth/** -- Source markdown and generated JavaScript for Covid graphs
* **css/** -- Source and generated CSS
* **extra/**
    * **covidgrowth/** -- Node.js code-generator code and data files for Covid graphs.
        * **BUILD.toml** -- Build file, called from top-level build file.
        * **web** -- Source JavaScript and generated data JavaScript for Covid graphs



[1]: https://github.com/creationix/nvm
[2]: http://rvm.io/1
[3]: https://github.com/tdewolff/minify/tree/master/cmd/minify
