import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';


export default function Data() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/hi`, { url });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); 
    }
  }




  
  function collectAllByType(type) {
    return data.flatMap((page) => page[type] || []);
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '30px',
    tableLayout: 'auto', 
  };

  const cellStyle = {
    wordBreak: 'break-word',
    whiteSpace: 'normal',
    padding: '8px',
    border: '1px solid #ccc',
    verticalAlign: 'top',
  };

  const snoStyle = {
    ...cellStyle,
    width: '1%',
    textAlign: 'center',
    whiteSpace: 'nowrap', 
  };

  const headingStyle = {
    marginLeft: '20px',
    marginTop: '30px',
    fontWeight: 'bold',
    listStyleType: 'disc', 
    paddingLeft: '20px',  
  };

  return (
    <div>
      {loading ? (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p>Scraping in progress...</p>
  </div>
) : (
  <div>
      
      <div style={{ marginBottom: '10px' }}>
        Enter URL  &nbsp;  &nbsp; :
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ margin: '10px 10px', padding: '4px' }}
        />
        <button onClick={fetchData}>Scrape</button>
      </div>

      <h2>Scraped Data (Grouped by Element Type)</h2>
      {data.length > 0 && (
  <a href={`${backendUrl}/download-excel`} download>
    <button className='download'>Download Excel File</button>
  </a>
)}
    
      {["headings", "paragraphs", "links", "buttons", "emails"].map((type) => {
        const items = collectAllByType(type);
        if (items.length === 0) return null;

        return (
          <>
          
          <div key={type}>
            <h3 style={headingStyle}>
              • {type.charAt(0).toUpperCase() + type.slice(1)} 
            </h3>
            

            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={snoStyle}>S.No.</th>
                    <th style={cellStyle}>Content</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((text, index) => (
                    <tr key={index}>
                      <td style={snoStyle}>{index + 1}</td>
                      <td style={cellStyle}>{text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           

          </div>
          </>
        );
      }
      
      )}


      

</div>

)}

    </div>
    
  );
}
