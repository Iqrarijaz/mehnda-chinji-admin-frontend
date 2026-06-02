/**
 * Generates and downloads a CSV file from an array of objects.
 * 
 * @param {Array} data - Array of objects to be converted to CSV.
 * @param {string} filename - The name of the downloaded file (e.g., 'report.csv').
 */
export const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
        console.warn("No data available for export");
        return;
    }

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV string
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const cell = row[header] === null || row[header] === undefined ? '' : row[header];
            let cellString = String(cell);
            
            // Apply title case to alphabetic strings (like names)
            if (typeof cell === 'string' && !/^\d+$/.test(cellString) && !/^[+0]\d+$/.test(cellString)) {
                 // For names, addresses, and statuses, capitalize first letter of each word
                 cellString = cellString.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
            
            cellString = cellString.replace(/"/g, '""');
            // Force Excel to treat long number strings (like phone numbers) as text
            if (/^[+0]\d{7,15}$/.test(cellString) || /^\d{10,15}$/.test(cellString)) {
                return `="""${cellString}"""`;
            }
            return `"${cellString}"`;
        }).join(','))
    ].join('\n');
    
    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
