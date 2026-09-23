import {z} from 'zod';

export const runtime='nodejs';
const schema=z.object({
 key:z.string().uuid(),name:z.string().trim().min(2).max(120),
 email:z.string().trim().email().max(254),phone:z.string().trim().max(40),
 city:z.string().trim().min(2).max(120),attendees:z.coerce.number().int().min(1).max(50),
 type:z.enum(['Attendee','Volunteer']),prayer:z.string().trim().max(2000),consent:z.literal(true)
});
export async function POST(request:Request){
 if(request.headers.get('sec-fetch-site')==='cross-site')return Response.json({error:'Please register using the event page.'},{status:403});
 const origin=request.headers.get('origin');
 if(origin&&new URL(origin).host!==request.headers.get('host'))return Response.json({error:'Please register using the event page.'},{status:403});
 try{
  const raw=await request.text();
  if(raw.length>12000)return Response.json({error:'Your submission is too long.'},{status:413});
  let body:unknown;
  try{body=JSON.parse(raw)}catch{return Response.json({error:'Invalid registration.'},{status:400})}
  const result=schema.safeParse(body);
  if(!result.success)return Response.json({error:'Please check your name, email, location, and attendee count, and accept the registration notice.'},{status:400});
  const d=result.data;
  const url=process.env.SUPABASE_URL;
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw new Error('Supabase environment variables are missing');
  const endpoint=new URL('/rest/v1/registrations?on_conflict=id',url);
  const response=await fetch(endpoint,{
   method:'POST',headers:{'apikey':key,'Authorization':`Bearer ${key}`,'Content-Type':'application/json','Prefer':'resolution=ignore-duplicates,return=minimal'},
   body:JSON.stringify({id:d.key,name:d.name,email:d.email.toLowerCase(),phone:d.phone,city:d.city,attendees:d.attendees,attendance_type:d.type,prayer:d.prayer,consent_version:'event-registration-v1',created_at:new Date().toISOString()}),
   cache:'no-store',signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)throw new Error(`Supabase registration insert failed: ${response.status}`);
  return Response.json({success:true},{headers:{'Cache-Control':'no-store'}});
 }catch(error){console.error('Registration save failed',error);return Response.json({error:'We couldn’t save your registration. Your entries are still here. Please try again.'},{status:503})}
}
