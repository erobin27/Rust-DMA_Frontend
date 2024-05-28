export const getBooleanFromEnv = (
  key?: string,
  defaultValue: boolean = false
): boolean => {
  if (!key) return false;

  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === "true";
};
