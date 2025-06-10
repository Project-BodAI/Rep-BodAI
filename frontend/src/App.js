import { useState } from 'react';

function App() {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(prev => !prev);
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>      
      <button
        onClick={handleClick}
        style={{
          marginTop: '60px',
          padding: '30px 60px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >        
        Tıkla Benii
      </button>
      {visible && <h1>Ne var lan!</h1>}
    </div>
  );
}

export default App;
