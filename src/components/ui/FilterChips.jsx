import React from 'react'

function FilterChips() {
  return (
    <form className="filter">
    <input className="btn btn-square" type="reset" value="×" />
    <input className="btn" type="radio" name="frameworks" aria-label="Svelte" />
    <input className="btn" type="radio" name="frameworks" aria-label="Vue" />
    <input className="btn" type="radio" name="frameworks" aria-label="React" />
    <input className="btn" type="radio" name="frameworks" aria-label="Svelte" />
    <input className="btn" type="radio" name="frameworks" aria-label="Vue" />
    <input className="btn" type="radio" name="frameworks" aria-label="React" />
</form>
  )
}

export default FilterChips