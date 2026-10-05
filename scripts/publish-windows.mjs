// Usage: node scripts/publish-windows.mjs PLUGIN_ROOT --project-id SITE_ID
// Feed the normal Sites workflow JSON, including its credential, on stdin.
import {spawn} from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
const [pluginRoot,...args]=process.argv.slice(2);
if(!pluginRoot||args[0]!=='--project-id'||!args[1])throw Error('Provide the Sites plugin directory and --project-id.');
const env={...process.env};
if(process.platform==='win32'){
 const gitRoot=path.join(env.ProgramFiles??'C:/Program Files','Git');
 env.PATH=[path.join(gitRoot,'bin'),path.join(gitRoot,'cmd'),path.join(gitRoot,'usr/bin'),path.dirname(process.execPath),env.PATH??''].join(path.delimiter);
 let count=Number(env.GIT_CONFIG_COUNT??0);
 for(const [key,value]of [['safe.directory',process.cwd().replaceAll('\\','/')],['http.sslBackend','openssl']]){
  env[`GIT_CONFIG_KEY_${count}`]=key;env[`GIT_CONFIG_VALUE_${count}`]=value;count++;
 }
 env.GIT_CONFIG_COUNT=String(count);
 const shim=fileURLToPath(new URL('./windows-spawn-compat.mjs',import.meta.url));
 env.NODE_OPTIONS=((env.NODE_OPTIONS??'')+' --import='+pathToFileURL(shim).href).trim();
 const temp=path.join(process.cwd(),'.sites-runtime','tmp');fs.mkdirSync(temp,{recursive:true});
 env.TEMP=temp;env.TMP=temp;env.TMPDIR=temp.replaceAll('\\','/');
}
const child=spawn(process.execPath,[path.join(pluginRoot,'scripts/site-workflow.mjs'),...args],{env,windowsHide:true,stdio:['pipe','inherit','inherit']});
process.stdin.pipe(child.stdin);
child.on('error',e=>{console.error(e.message);process.exitCode=1});
child.on('exit',code=>{process.exitCode=code??1});
