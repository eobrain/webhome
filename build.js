const build = require('bajel')

const COMPILEJS = 'java -jar tools/closure/closure-compiler-v20190929.jar -O ADVANCED'
const COMPILED = ['sw.js', '_includes/home.js', '_includes/post.js', '_includes/post_blocking.js']
const compile = c => `${COMPILEJS} --js ${c.source} --js_output_file ${c.target}`

build({
  serve: ['compile',
    c => 'jekyll serve --port 8000 --strict_front_matter --watch --drafts'],

  compile: COMPILED,

  'sw.js': ['js/sw.js',
    compile],

  '_includes/%.js': ['js/%.js',
    compile],

  prodbuild: ['compile',
    c => 'JEKYLL_ENV=production jekyll build --strict_front_matter --config _config.yml,_secret.yml',
    c => 'minify -r -o _site/ _site'],

  deploy: ['prodbuild',
    c => 'firebase deploy'],

  clean: [
    c => 'jekyll clean',
    c => `rm -f ${COMPILED.join(' ')}`]
})
