export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      instagram_posts: {
        Row: {
          id: string;
          user_id: string;
          caption: string;
          post_type: "image" | "carousel" | "reel" | "story";
          status: "scheduled" | "draft" | "published" | "backlog";
          scheduled_date: string | null;
          published_date: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          caption: string;
          post_type: "image" | "carousel" | "reel" | "story";
          status: "scheduled" | "draft" | "published" | "backlog";
          scheduled_date?: string | null;
          published_date?: string | null;
          tags?: string[];
        };
        Update: {
          caption?: string;
          post_type?: "image" | "carousel" | "reel" | "story";
          status?: "scheduled" | "draft" | "published" | "backlog";
          scheduled_date?: string | null;
          published_date?: string | null;
          tags?: string[];
        };
        Relationships: [];
      };
      competitors: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          notes?: string;
        };
        Update: {
          name?: string;
          notes?: string;
        };
        Relationships: [];
      };
      competitor_accounts: {
        Row: {
          id: string;
          competitor_id: string;
          platform: "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin" | "facebook";
          handle: string;
          followers: number;
          followers_growth: number;
          engagement_rate: number;
          posts_per_week: number;
          last_post_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          competitor_id: string;
          platform: "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin" | "facebook";
          handle: string;
          followers?: number;
          followers_growth?: number;
          engagement_rate?: number;
          posts_per_week?: number;
          last_post_date?: string | null;
        };
        Update: {
          handle?: string;
          followers?: number;
          followers_growth?: number;
          engagement_rate?: number;
          posts_per_week?: number;
          last_post_date?: string | null;
        };
        Relationships: [];
      };
      calendar_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          platform: "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin" | "facebook";
          status: "scheduled" | "published" | "draft";
          content_type: string;
          date: string;
          time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          platform: "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin" | "facebook";
          status: "scheduled" | "published" | "draft";
          content_type: string;
          date: string;
          time?: string | null;
        };
        Update: {
          title?: string;
          platform?: "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin" | "facebook";
          status?: "scheduled" | "published" | "draft";
          content_type?: string;
          date?: string;
          time?: string | null;
        };
        Relationships: [];
      };
      carousel_designs: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slides: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          slides?: Json;
        };
        Update: {
          title?: string;
          slides?: Json;
        };
        Relationships: [];
      };
      saved_news: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          source: string;
          topic: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          source: string;
          topic: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
