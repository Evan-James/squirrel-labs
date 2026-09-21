import sharp from 'sharp';
import { mkdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
const source=path.resolve('../squirrel-labs-artwork');
const output=path.resolve('public/images');
await mkdir(output,{recursive:true});
const assets=[['02-electrician-workshop.png','workshop'],['03-squirrel-cable.png','squirrel'],['04-miniature-laboratory.png','laboratory'],['05-workshop-sunset.png','ending'],['06-squirrel-visitor.png','visitor'],['07-van-departure.png','departure'],['08-system-machine.png','machine']];
for(const [file,name] of assets){
 try {await stat(path.join(source,file));}catch{continue;}
 for(const [suffix,width] of [['',1600],['-small',800]]){
  await sharp(path.join(source,file)).resize({width,withoutEnlargement:true}).webp({quality:83,alphaQuality:95}).toFile(path.join(output,`${name}${suffix}.webp`));
 }
 console.log(name,Math.round((await stat(path.join(output,`${name}.webp`))).size/1024)+' KB');
}
await mkdir('design',{recursive:true});
await copyFile(path.join(source,'prompt-manifest.json'),'design/prompt-manifest.json');
