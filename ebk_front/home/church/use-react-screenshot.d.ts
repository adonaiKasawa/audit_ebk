declare module "use-react-screenshot" {
  export function useScreenshot<T extends HTMLElement>(options?: {
    type?: string;
    quality?: number;
  }): [string | null, (ref: T | null) => Promise<string>, boolean];
}