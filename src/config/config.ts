export const getProp = (key: string, def?: any) => process.env[key] || def;
