# Form Analysis Rate Limiting

This document explains the rate limiting system implemented for the form analysis feature.

## Overview

The form analysis feature is rate limited to **3 video analyses per 24 hours** per user. This is implemented for several reasons:

1. **Cost Control**: AI video analysis is expensive
2. **Fair Usage**: Ensures all users get equal access 
3. **Server Protection**: Prevents abuse and overload
4. **Quality Focus**: Encourages users to be thoughtful about their submissions

## How It Works

### Database Level
- A `form_analysis_rate_limits` table tracks usage per user
- Uses a sliding 24-hour window (not calendar day)
- Automatically resets after 24 hours from first request in window

### Edge Function Level
- Rate limit check happens **before** video processing
- Returns detailed error information when limit exceeded
- Includes standard HTTP rate limiting headers

### Client Level
- Shows user-friendly error messages
- Disables video capture buttons when rate limited
- Displays countdown until reset time

## Security Features

1. **Server-Side Enforcement**: Cannot be bypassed from client
2. **Database Integrity**: Uses PostgreSQL functions with proper locking
3. **Service Role Access**: Rate limit table only accessible by service role
4. **Atomic Operations**: Race conditions prevented by database constraints

## Implementation Details

### Database Function
```sql
SELECT public.check_form_analysis_rate_limit(
  p_user_id => 'user-uuid',
  p_max_requests => 3,
  p_window_hours => 24
);
```

### Response Format
```json
{
  "allowed": true,
  "requests_remaining": 2,
  "reset_time": "2024-01-01T12:00:00Z",
  "window_start": "2024-01-01T11:00:00Z"
}
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704110400000
Retry-After: 3600
```

## Setup Instructions

1. **Run the migration**:
   ```bash
   supabase db reset  # If in development
   # OR
   supabase migration up  # For production
   ```

2. **Verify the function**:
   ```sql
   SELECT public.check_form_analysis_rate_limit('test-user-id'::uuid);
   ```

3. **Test the edge function**:
   ```bash
   curl -X POST https://your-project.supabase.co/functions/v1/analyze-form \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

## Monitoring

You can monitor rate limiting with these queries:

```sql
-- Check current rate limits for all users
SELECT 
  u.email,
  rl.request_count,
  rl.window_start,
  rl.window_start + INTERVAL '24 hours' as reset_time
FROM form_analysis_rate_limits rl
JOIN auth.users u ON u.id = rl.user_id
ORDER BY rl.updated_at DESC;

-- Check how many users are currently rate limited
SELECT COUNT(*) as rate_limited_users
FROM form_analysis_rate_limits 
WHERE request_count >= 3 
  AND window_start > NOW() - INTERVAL '24 hours';
```

## Customization

To change the rate limits, modify these values:

1. **In the edge function** (`supabase/functions/analyze-form/index.ts`):
   ```typescript
   const { data: rateLimitResult } = await supabaseClient
     .rpc('check_form_analysis_rate_limit', {
       p_user_id: userId,
       p_max_requests: 5,    // Change this
       p_window_hours: 12    // Change this
     });
   ```

2. **In the client code** (`app/(tabs)/form-analysis.tsx`):
   ```typescript
   let rateLimitMessage = 'You have reached the limit of 5 video analyses per 12 hours.';
   ```

## Troubleshooting

### Common Issues

1. **"Rate limit check failed"**
   - Check if migration ran successfully
   - Verify service role permissions
   - Check edge function logs

2. **Rate limit not resetting**
   - Verify the window_start calculation
   - Check if timezone is correct
   - Review database function logic

3. **False positives**
   - Check for duplicate user IDs
   - Verify rate limit function logic
   - Review error handling in edge function

### Debug Queries

```sql
-- Check specific user's rate limit status
SELECT * FROM form_analysis_rate_limits 
WHERE user_id = 'your-user-id';

-- Reset a user's rate limit (admin only)
UPDATE form_analysis_rate_limits 
SET request_count = 0, window_start = NOW() 
WHERE user_id = 'user-id-to-reset';

-- Delete all rate limit data (testing only)
TRUNCATE form_analysis_rate_limits;
``` 