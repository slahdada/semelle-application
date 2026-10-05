import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:60000,workers:1,use:{baseURL:'http://127.0.0.1:5174',channel:'chrome',headless:true},webServer:{command:'node scripts/serve-test.mjs',url:'http://127.0.0.1:5174',reuseExistingServer:true},reporter:[['list'],['json',{outputFile:'../../work/test-report.json'}]]});
