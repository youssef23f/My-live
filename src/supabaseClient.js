import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tqxkoyirgeixhujztkgq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_R7d_vgDsgAtB3qQ2FCBouw_PP8W5aJK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);