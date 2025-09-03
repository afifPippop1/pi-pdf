export interface Font {
  variants: string[];
  subsets: string[];
  family: string;
  category: string;
  version: string;
  files: Record<string, string>;
}
