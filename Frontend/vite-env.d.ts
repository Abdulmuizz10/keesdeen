interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_CLOUDINARY_PRESET: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_SQUARE_APP_ID: string;
  readonly VITE_SQUARE_LOCATION_ID: string;
  readonly VITE_API_URL: string;
  readonly VITE_CONTACT_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
