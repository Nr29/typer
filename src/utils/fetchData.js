// utils/fetchData.js
const monthMap = {
    'Styczeń': '01',
    'Luty': '02',
    'Marzec': '03',
    'Kwiecień': '04',
    'Maj': '05',
    'Czerwiec': '06',
    'Lipiec': '07',
    'Sierpień': '08',
    'Wrzesień': '09',
    'Październik': '10',
    'Listopad': '11',
    'Grudzień': '12'
  };
  
  function convertDate(dateString) {
    const parts = dateString.replace(',', '').split(' ');
  
    if (parts.length !== 4) {
      return null;
    }
  
    const [dayOfWeek, day, month, yearWithColon] = parts;
    const year = yearWithColon.replace(':', ''); // Usunięcie dwukropka z roku
    const formattedDay = day.padStart(2, '0');
    const formattedMonth = monthMap[month];
  
    if (!formattedMonth) {
      return null;
    }
  
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
    return formattedDate;
  }
  
  const fetchData = async (SPREADSHEET_ID, API_KEY, RANGE, setMatches, setPredictions, setNextMatches) => {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    const rows = data.values;
  
    let currentDate = '';
    const formattedMatches = [];
    const formattedPredictions = [];
  
    rows.forEach((row, rowIndex) => {
      if (row[0] && row[0].length > 4) { // Jest to data
        currentDate = convertDate(row[0]);
      } else if (row[0]) { // Jest to mecz
        const match = {
          rowIndex: rowIndex + 2,
          date: currentDate,
          group: row[0],
          time: row[1],
          team1: row[2],
          team2: row[3],
          score: `${row[4] || ''}-${row[5] || ''}`,
        };
        formattedMatches.push(match);
      }
    });
  
    // Pobierz kolumny użytkowników
    const userColumns = [];
    for (let i = 8; i < rows[0].length; i += 3) {
      userColumns.push(i);
    }
  
    rows.forEach((row, rowIndex) => {
      if (row[0] && row[0].length <= 4) { // Jest to mecz
        userColumns.forEach(colIndex => {
          const prediction = {
            rowIndex: rowIndex + 2,
            user: rows[0][colIndex] || '',
            team1Prediction: row[colIndex] || '',
            team2Prediction: row[colIndex + 1] || '',
            points: row[colIndex + 2] || '',
          };
          formattedPredictions.push(prediction);
        });
      }
    });
  
    console.log('formattedPredictions:', formattedPredictions);
    setMatches(formattedMatches);
    setPredictions(formattedPredictions);
  
    // Znalezienie najbliższych meczów
    const now = new Date();
    const nextMatchDate = formattedMatches.find(match => new Date(`${match.date}T${match.time}`) > now)?.date;
    const nearestMatches = formattedMatches.filter(match => match.date === nextMatchDate);
    setNextMatches(nearestMatches);
  };
  
  export { fetchData };
  