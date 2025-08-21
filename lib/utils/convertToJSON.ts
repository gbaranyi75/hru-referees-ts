export function convertToJSON(data: any) {
  const convertedData = JSON.parse(JSON.stringify(data));
  return convertedData;
}
