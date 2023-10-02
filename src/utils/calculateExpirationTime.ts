export function calculateExpirationTime(expireTime: string) {
    const expirationDate = new Date();
    const expireUnit = expireTime.slice(-1);
    const expireValue = parseInt(
        expireTime.substring(0, expireTime.length - 1),
    );

    if (isNaN(expireValue) || !['m', 's', 'd', 'h'].includes(expireUnit)) {
        throw new Error('Invalid expiration time format');
    }
    switch (expireUnit) {
        case 'm':
            expirationDate.setMinutes(
                expirationDate.getMinutes() + expireValue,
            );
            break;
        case 's':
            expirationDate.setSeconds(
                expirationDate.getSeconds() + expireValue,
            );
            break;

        case 'd':
            expirationDate.setDate(expirationDate.getDate() + expireValue);
            break;
        case 'h':
            expirationDate.setHours(expirationDate.getHours() + expireValue);
            break;
        default:
            break;
    }

    return expirationDate.toISOString();
}
