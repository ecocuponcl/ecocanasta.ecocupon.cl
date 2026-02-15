export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            categories: {
                Row: {
                    id: number
                    name: string
                    slug: string
                    image: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    slug: string
                    image?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    slug?: string
                    image?: string | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: number
                    name: string
                    price: number
                    image: string | null
                    category_id: number | null
                    shop: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    price: number
                    image?: string | null
                    category_id?: number | null
                    shop?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    price?: number
                    image?: string | null
                    category_id?: number | null
                    shop?: string | null
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    role?: string | null
                    updated_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
