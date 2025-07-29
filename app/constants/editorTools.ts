const editorTools = {} as const;

type EditorTools = typeof editorTools;

export type EditorTool = EditorTools[keyof EditorTools];
