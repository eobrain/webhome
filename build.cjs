const COMPILEJS = 'java -jar tools/closure/closure-compiler-v20190929.jar -O ADVANCED'
const COMPILED = [
  'sw.js',
  '_includes/home.js',
  '_includes/post.js',
  '_includes/post_blocking.js'
]
const compile = `${COMPILEJS} --js $< --js_output_file $@`

module.exports = {
  serve: {
    deps: ['compile'],
    exec: 'jekyll serve --port 8000 --strict_front_matter --watch --drafts'
  },

  compile: {
    deps: ['extra', ...COMPILED]
  },

  'sw.js': {
    deps: ['js/sw.js'],
    exec: compile
  },

  '_includes/%.js': {
    deps: ['js/%.js'],
    exec: compile
  },

  prodbuild: {
    deps: ['compile'],
    exec: `
      JEKYLL_ENV=production jekyll build --strict_front_matter --config _config.yml,_secret.yml
      minify -r -o _site/ _site
    `
  },

  deploy: {
    deps: ['prodbuild'],
    exec: 'firebase deploy'
  },

  extra: {
    exec: 'cd extra/covidgrowth && npx bajel'
  },

  refetch: {
    exec: `
    cd extra/covidgrowth
    npx bajel clean
    npx bajel
    `
  },

  clean: {
    exec: `
      jekyll clean
      rm -f ${COMPILED.join(' ')}
      (cd extra/covidgrowth && npx bajel clean)
    `
  }
}
