export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${year}.${month}.${day}`;
};


export const formatSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1048576) {
        return `${(size / 1024).toFixed(2)} KB`;
    } else {
        return `${(size / 1048576).toFixed(2)} MB`;
    }
};