M4=m4 -Itemplates
P=public
T=templates

build: $P/js/app.js $P/2018-08-21.html $P/2018-08-19.html $P/404.html $P/index.html

publish: build
	firebase deploy

$P/js/app.js: src/app.ts
	tsc --outFile $@ src/app.ts

$P/2018-08-21.html: $T/2018-08-21.html $T/page.html
	$(M4) $T/2018-08-21.html >$@
$P/2018-08-19.html: $T/2018-08-19.html $T/page.html
	$(M4) $T/2018-08-19.html >$@
$P/404.html: $T/404.html $T/page.html
	$(M4) $T/404.html >$@
$P/index.html: $T/index.html $T/page.html
	$(M4) $T/index.html >$@

clean:
	rm -f  $P/*.html $P/js/*.js
