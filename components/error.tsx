'use client'

export default function ErrorPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <p style={{
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Sorry, something went wrong
      </p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Intentar de nuevo
      </button>
    </div>
  )
} 