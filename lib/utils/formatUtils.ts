/**
 * Formats a date string into a string in the format "YYYY.MM.DD".
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}. ${month}. ${day}`;
};

/**
 * Returns a string representing the size in bytes, kilobytes, or megabytes.
 *
 * @param {number} size - The size in bytes.
 * @returns {string} A string representing the size in bytes, kilobytes, or megabytes.
 */
export const formatSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1048576) {
        return `${(size / 1024).toFixed(2)} KB`;
    } else {
        return `${(size / 1048576).toFixed(2)} MB`;
    }
};