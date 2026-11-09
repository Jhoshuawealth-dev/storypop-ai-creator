export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      characters: {
        Row: {
          created_at: string
          id: string
          name: string
          reference_paths: string[]
          style: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          reference_paths?: string[]
          style?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          reference_paths?: string[]
          style?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      credit_balances: {
        Row: {
          credits_total: number
          credits_used: number
          plan_id: string | null
          renews_on: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          credits_total?: number
          credits_used?: number
          plan_id?: string | null
          renews_on?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          credits_total?: number
          credits_used?: number
          plan_id?: string | null
          renews_on?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generation_jobs: {
        Row: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          error: string | null
          id: string
          input: Json
          kind: string
          output_path: string | null
          progress: number
          project_id: string | null
          stage: string
          status: string
          thumbnail_path: string | null
          updated_at: string
          user_id: string
          worker_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          input?: Json
          kind?: string
          output_path?: string | null
          progress?: number
          project_id?: string | null
          stage?: string
          status?: string
          thumbnail_path?: string | null
          updated_at?: string
          user_id: string
          worker_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          input?: Json
          kind?: string
          output_path?: string | null
          progress?: number
          project_id?: string | null
          stage?: string
          status?: string
          thumbnail_path?: string | null
          updated_at?: string
          user_id?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generation_jobs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          description: string
          hashtags: string[]
          id: string
          platforms: string[]
          project_id: string | null
          published_at: string | null
          scheduled_at: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          hashtags?: string[]
          id?: string
          platforms?: string[]
          project_id?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          hashtags?: string[]
          id?: string
          platforms?: string[]
          project_id?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string
          bio: string
          created_at: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string
          bio?: string
          created_at?: string
          full_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string
          bio?: string
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          character_id: string | null
          created_at: string
          duration_seconds: number
          id: string
          idea: string
          ratio: string
          scenes: Json
          script: Json
          status: string
          style_id: string
          thumbnail_path: string | null
          title: string
          updated_at: string
          user_id: string
          video_path: string | null
          voice_id: string
        }
        Insert: {
          character_id?: string | null
          created_at?: string
          duration_seconds?: number
          id?: string
          idea?: string
          ratio?: string
          scenes?: Json
          script?: Json
          status?: string
          style_id?: string
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
          user_id: string
          video_path?: string | null
          voice_id?: string
        }
        Update: {
          character_id?: string | null
          created_at?: string
          duration_seconds?: number
          id?: string
          idea?: string
          ratio?: string
          scenes?: Json
          script?: Json
          status?: string
          style_id?: string
          thumbnail_path?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_path?: string | null
          voice_id?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          connected: boolean
          created_at: string
          handle: string
          id: string
          name: string
          platform: string
          user_id: string
        }
        Insert: {
          connected?: boolean
          created_at?: string
          handle?: string
          id?: string
          name?: string
          platform: string
          user_id: string
        }
        Update: {
          connected?: boolean
          created_at?: string
          handle?: string
          id?: string
          name?: string
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_next_job: {
        Args: { _worker_id: string }
        Returns: {
          claimed_at: string | null
          completed_at: string | null
          created_at: string
          error: string | null
          id: string
          input: Json
          kind: string
          output_path: string | null
          progress: number
          project_id: string | null
          stage: string
          status: string
          thumbnail_path: string | null
          updated_at: string
          user_id: string
          worker_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "generation_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
