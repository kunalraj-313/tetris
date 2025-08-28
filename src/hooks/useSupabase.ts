import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ScoreData {
  name: string;
  score: number;
  time_elapsed: number;
}

export const useSupabase = () => {
  const saveScore = async (scoreData: ScoreData) => {
    try {
      const { data, error } = await supabase.from("scores").insert([
        {
          name: scoreData.name,
          score: scoreData.score,
          time_elapsed: scoreData.time_elapsed,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error saving score:", error);
        return { success: false, error };
      }

      console.log("Score saved successfully:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error saving score:", error);
      return { success: false, error };
    }
  };

  const getHighScores = async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching high scores:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error fetching high scores:", error);
      return { success: false, error };
    }
  };

  return {
    saveScore,
    getHighScores,
  };
};
