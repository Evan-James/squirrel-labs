import assert from 'node:assert/strict';
const base='http://localhost:5173';
const payload={id:'6a216b7b-7a45-4960-bac8-5e41d472feca',name:'Website Test',business:'Squirrel Labs QA',email:'test@example.com',phone:'0400000000',industry:'Test business',help:'I’m missing enquiries',problem:'Test enquiry: checking that the form saves safely.',improvement:'Reliable capture and follow-up.',budget:'',timeframe:'',website:''};
async function post(data,origin=base){return fetch(`${base}/api/quote`,{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(data)});}
assert.equal((await post({...payload,email:'invalid'})).status,400,'Reject invalid contact information');
assert.equal((await post(payload,'https://unrelated.example')).status,403,'Reject a cross-origin submission');
assert.equal((await post({...payload,website:'spam'})).status,400,'Reject filled honeypot');
for(let n=0;n<2;n++){const response=await post(payload);assert.equal(response.status,201);assert.equal((await response.json()).reference,'SL-6A216B7B');}
console.log('PASS: invalid input, cross-origin and honeypot rejected; repeated submission returns the same receipt.');
