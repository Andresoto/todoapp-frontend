export const formatTimestamp = (timestamp: { _seconds: number; _nanoseconds: number }): Date => {
    // eslint-disable-next-line no-underscore-dangle
    return new Date(timestamp._seconds * 1000);
};
