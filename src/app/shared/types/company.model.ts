export interface Company {
    id: string;
    name: string;
    logo_url: string;
    preferences: {
        mode: 'light' | 'dark';
        user_defined_scheme?: {
            dark: ColorScheme;
            light: ColorScheme;
        }
    };
    default_currency: string;
    default_language: string;
    global_tax_rate: number;
    created_at: Date;
    updated_at: Date;
}

export interface ColorScheme {
    primary: string;
    secondary: string;
    tertiary: string;
    accent: string;
}