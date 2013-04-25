enyo/tools/deploy.js
rm -rf ../gh-pages/*
cp -r deploy/samples/* ../gh-pages
rm -rf deploy build
