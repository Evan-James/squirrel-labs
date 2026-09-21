import { z } from 'zod';
import { quoteDatabase } from '@/lib/quotes';
const short=z.string().trim().min(1).max(160);
const long=z.string().trim().min(1).max(2500);
const schema=z.object({id:z.string().uuid(),name:short,business:short,email:z.string().trim().email().max(254),phone:z.string().trim().min(6).max(160),industry:short,help:long,problem:long,improvement:long,budget:z.string().trim().max(160).default(''),timeframe:z.string().trim().max(160).default(''),website:z.string().max(0).optional()});
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Please send your request from this website.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Please use the quote form.'},{status:415});
 let input:unknown;
 try{const body=await request.text();if(body.length>14000)return Response.json({error:'Please shorten your request.'},{status:413});input=JSON.parse(body);}catch{return Response.json({error:'Your request could not be read. Please try again.'},{status:400});}
 const parsed=schema.safeParse(input);if(!parsed.success)return Response.json({error:'Please check your contact details and complete the required fields.'},{status:400});
 const q=parsed.data;
 try{
  await quoteDatabase().prepare('INSERT INTO quote_requests (id,name,business,email,phone,industry,help,problem,improvement,budget,timeframe,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(q.id,q.name,q.business,q.email,q.phone,q.industry,q.help,q.problem,q.improvement,q.budget,q.timeframe,Date.now()).run();
  return Response.json({reference:`SL-${q.id.slice(0,8).toUpperCase()}`},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('Quote storage failed',error instanceof Error?error.name:'StorageError');return Response.json({error:'We couldn’t save your request just now. Your answers are still here — please try again.'},{status:503});}
}
