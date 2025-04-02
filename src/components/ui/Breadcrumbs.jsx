import React from 'react'

function Breadcrumbs({title}) {
  return (
    <div className="breadcrumbs text-sm">
    <ul>
        <li><a>Home</a></li>
        <li><a>{title}</a></li>
    </ul>
</div>
  )
}

export default Breadcrumbs