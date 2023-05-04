import React from 'react'

// inline styles
const STYLE_TO_DATA = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  border: '0px solid',
  width: '20rem',
  background: 'rgba(22, 24, 28, 0.2)',
  color: 'white',
  padding: '1em',
  borderRadius: '10px',
  marginTop:'.5rem'
}

export  function LoginData() {
  return (
    <article style={{position:'fixed', left:'20%'}}>
        <div style={STYLE_TO_DATA}>
        <h2 style={{ alignSelf: 'center', margin: 0}}><b>Data to login</b></h2>
        <h3>☑️ Worker</h3>
          <span><b>User:</b> user / <b>Pass:</b> user </span>
        <h3>☑️Client</h3>
          <span><b>User: </b>Rohe <b>Pass:</b> admin</span>
        </div>
    </article>
  )
}
