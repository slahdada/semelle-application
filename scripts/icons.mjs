import {chromium} from '@playwright/test';
import fs from 'node:fs';
const b=await chromium.launch({channel:'chrome',headless:true});const p=await b.newPage();const svg=fs.readFileSync('public/favicon.svg','utf8');for(const size of [192,512]){await p.setViewportSize({width:size,height:size});await p.setContent(`<style>body{margin:0}svg{width:100vw;height:100vh}</style>${svg}`);await p.screenshot({path:`public/icon-${size}.png`})}await b.close();
