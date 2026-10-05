// Adapt the existing Sites packager at the Windows process boundary.
// Credentials remain on stdin; no plugin source or global Git setting is changed.
import childProcess from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import path from 'node:path';
if(process.platform==='win32'){
 const original=childProcess.spawn;
 childProcess.spawn=function(executable,args=[],options={}){
  let adapted=args;
  if(executable==='bash'&&String(args[0]).replaceAll('\\','/').endsWith('/package-site.sh')){
   adapted=[...args];
   adapted[0]=adapted[0].replaceAll('\\','/');
   adapted[1]=adapted[1].replaceAll('\\','/');
   // mkdir -p with an absolute drive path probes protected parent folders
   // inside Windows sandboxes. Resolve the same archive relative to cwd.
   adapted[2]=path.relative(options.cwd??process.cwd(),adapted[2]).replaceAll('\\','/');
  }
  return original.call(this,executable,adapted,{...options,windowsHide:true});
 };
 syncBuiltinESMExports();
}
