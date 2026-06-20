-- Create the assessments table referencing auth.users(id)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on assessments
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Configure RLS policies for owner access only
DROP POLICY IF EXISTS "Users can read their own assessments" ON public.assessments;
CREATE POLICY "Users can read their own assessments"
    ON public.assessments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.assessments;
CREATE POLICY "Users can insert their own assessments"
    ON public.assessments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own assessments" ON public.assessments;
CREATE POLICY "Users can update their own assessments"
    ON public.assessments
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.assessments;
CREATE POLICY "Users can delete their own assessments"
    ON public.assessments
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
