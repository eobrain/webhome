P=public
T=templates
M4=m4 $T/lib.html $T/data.m4

build: \
 $P/2019-01-21.html \
 $P/2018-11-03.html \
 $P/2018-10-06.html \
 $P/2018-08-21.html \
 $P/2018-08-19.html \
 $P/404.html $P/index.html \
 $P/js/app.js

publish: build
	firebase deploy

$P/js/app.js: src/app.ts
	tsc --outFile $@ src/app.ts

$P/%.html: $T/%.html $T/data.m4
	$(M4) $< >$@

serve: build
	cd public && python -m SimpleHTTPServer

clean:
	rm -f  $P/*.html $P/js/*.js
