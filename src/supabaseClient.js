// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// رابط المشروع الأساسي
const SUPABASE_URL = 'https://tqxkoyirgeixhujztkgq.supabase.co';

// المفتاح العام (Publishable Key)
const SUPABASE_ANON_KEY = 'sb_publishable_R7d_vgDsgAtB3qQ2FCBouw_PP8W5aJK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);