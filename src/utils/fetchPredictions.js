export const fetchPredictions = async (SPREADSHEET_ID, API_KEY, RANGE) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
  const data = await response.json();
  return data.values;
};
