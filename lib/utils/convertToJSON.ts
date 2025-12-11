export function convertToJSON<T>(data: T): T {
  const convertedData = JSON.parse(JSON.stringify(data));
  return convertedData;
}
