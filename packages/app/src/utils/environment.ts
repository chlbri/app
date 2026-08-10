// export const isCI = () => process.env.CI === 'true';
// export const IS_PRODUCTION = () => process.env.NODE_ENV === 'production';

/**
 * Checks if we are in a development environment.
 */
export const IS_TEST = () => process.env.NODE_ENV === 'test';
