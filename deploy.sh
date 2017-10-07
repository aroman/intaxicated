#!/bin/sh
cd client && npm run build && cp -r build ../server &&
cd .. && git commit -a &&
git subtree push --prefix server heroku master
