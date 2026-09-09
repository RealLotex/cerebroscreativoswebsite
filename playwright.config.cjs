const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({testDir:'tests',workers:1,timeout:90000,retries:0,reporter:[['list'],['html',{open:'never'}]],use:{baseURL:'http://127.0.0.1:8765'},webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:8765',reuseExistingServer:false}});
