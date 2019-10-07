COMPILEJS=java -jar tools/closure/closure-compiler-v20190929.jar

COMPILED=_includes/home.js _includes/post.js _includes/post_blocking.js

serve:
	jekyll serve --port 8000 --strict_front_matter --watch --drafts

compile: $(COMPILED)

_includes/home.js: js/home.js
	$(COMPILEJS) --js $< --js_output_file $@
_includes/post.js: js/post.js
	$(COMPILEJS) --js $< --js_output_file $@
_includes/post_blocking.js: js/post_blocking.js
	$(COMPILEJS) --js $< --js_output_file $@

prodbuild: compile
	JEKYLL_ENV=production jekyll build --strict_front_matter --config _config.yml,_secret.yml
	minify -r -o _site/ _site

deploy: prodbuild
	firebase deploy

clean:
	jekyll clean
	rm -f $(COMPILED)
