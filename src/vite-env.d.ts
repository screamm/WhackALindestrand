// src/vite-env.d.ts

/// <reference types="vite/client" />

declare module '*.png' {
    const value: string;
    export default value;
  }
  
  declare module '*.mp3' {
    const value: string;
    export default value;
  }
  
  declare module '*.wav' {
    const value: string;
    export default value;
  }