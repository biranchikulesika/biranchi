import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim().replace(/^"/, '').replace(/"$/, '');
      }
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
    console.error('❌ Supabase credentials are not configured in the environment.');
    console.error('Please configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Connecting to Supabase at ${supabaseUrl}...`);

  try {
    // 1. Test Connection / Insert
    const testEmail = `test_${Date.now()}@example.com`;
    console.log(`Inserting test subscriber: ${testEmail}`);
    const { data: insertData, error: insertError } = await supabase
      .from('subscribers')
      .insert({ email: testEmail, isVerified: true })
      .select()
      .single();

    if (insertError) throw insertError;
    console.log('✅ Insert successful:', insertData);

    // 2. Read
    const { data: readData, error: readError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('id', insertData.id)
      .single();

    if (readError) throw readError;
    console.log('✅ Read successful:', readData);

    // 3. Delete
    const { error: deleteError } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) throw deleteError;
    console.log('✅ Delete successful for:', insertData.id);
    
    console.log('\n✅ All read/write operations verified successfully.');
  } catch (err: any) {
    console.error('\n❌ Operation failed:', err.message || err);
    process.exit(1);
  }
}

run();
