build:
	jekyll build

publish: build
	firebase deploy

serve: 
	jekyll serve

clean:
	jekyll clean
