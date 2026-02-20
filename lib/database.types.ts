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
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    slug: string
                    image?: string | null
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    slug?: string
                    image?: string | null
                    description?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    id: string
                    name: string
                    price: number
                    image: string | null
                    description: string | null
                    category_id: number | null
                    shop: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    price: number
                    image?: string | null
                    description?: string | null
                    category_id?: number | null
                    shop?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    price?: number
                    image?: string | null
                    description?: string | null
                    category_id?: number | null
                    shop?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            knasta_prices: {
                Row: {
                    id: number
                    product_id: string
                    price: number
                    url: string | null
                    last_updated: string
                }
                Insert: {
                    id?: number
                    product_id: string
                    price: number
                    url?: string | null
                    last_updated?: string
                }
                Update: {
                    id?: number
                    product_id?: string
                    price?: number
                    url?: string | null
                    last_updated?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "knasta_prices_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            product_specs: {
                Row: {
                    id: number
                    product_id: string
                    name: string
                    value: string
                }
                Insert: {
                    id?: number
                    product_id: string
                    name: string
                    value: string
                }
                Update: {
                    id?: number
                    product_id?: string
                    name?: string
                    value?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "product_specs_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
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
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
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
