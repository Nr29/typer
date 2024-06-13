import React from 'react';

function PointsTable({ points }) {
  if (!points.length) return null;

  // Find the index of the "Suma" column
  const header = points[0];
  const sumaIndex = header.indexOf('Suma');

  // Sort the points based on the "Suma" column, excluding the header
  const sortedPoints = [...points.slice(1)].sort((a, b) => b[sumaIndex] - a[sumaIndex]);

  return (
    <table>
      <thead>
        <tr>
          <th>Miejsce</th>
          {header.slice(1).map((cell, index) => (
            <th key={index}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedPoints.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>{rowIndex + 1}</td>
            {row.slice(1).map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PointsTable;
