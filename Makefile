P=public
T=templates
M4=m4 $T/page.html

build: $P/js/app.js $P/2018-08-21.html $P/2018-08-19.html $P/404.html $P/index.html

publish: build
	firebase deploy

$P/js/app.js: src/app.ts
	tsc --outFile $@ src/app.ts

$P/%.html: $T/%.html
	$(M4) $< >$@

clean:
	rm -f  $P/*.html $P/js/*.js
