# StackOverflow Chat Scraper

This is a node.js server-side application, meant to be working alongside [StackOverflow Chat API](https://github.com/Kamilczak020/StackOverflow-Chat-API).

It allows for easy scheduled scraping of the SO chat transcript, then automatically pushing the data to the database.

It can run in two modes:
* local - if you are hosting the database on your own machine, it can push data straight to it.
* remote - if the database is hosted on another machine, it can send POST and PUT requests to the API. 

It also comes with plenty of customization through configs, so you can set it up to work just as you need it to.

## Getting started

First, you should decide wether you want for it to work remotely or locally. 