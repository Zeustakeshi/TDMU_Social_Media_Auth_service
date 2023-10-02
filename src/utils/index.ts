export * from './calculateExpirationTime';

export const objectExcludeField = <T, Key extends keyof T>(
    object: T,
    keys: Key[],
) => {
    return Object.fromEntries(
        Object.entries(object).filter(([key]) => !keys.includes(key as Key)),
    );
};
