// This file helps set up supabase connection for login / web sessions

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // need to use this extension bc its the same as the middleware.ts

export const supabase = createClientComponentClient();

// use this for admin only pages
// export const supabaseAdmin = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
// );