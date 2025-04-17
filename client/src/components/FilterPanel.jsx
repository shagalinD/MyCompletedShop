import React from 'react'
import { Button, ButtonGroup } from '@mui/material'
const FilterPanel = ({ onFilterChange }) => {
  const categories = ['Все', 'Электроника', 'Одежда', 'Книги']
  return (
    <ButtonGroup variant='contained' sx={{ my: 2 }}>
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => {
            let filter
            switch (category) {
              case 'Электроника':
                filter = 'electronics'
                break
              case 'Одежда':
                filter = 'clothing'
                break
              case 'Книги':
                filter = 'books'
                break
              default:
                filter = 'Все'
                break
            }
            onFilterChange(filter)
          }}
        >
          {category}
        </Button>
      ))}
    </ButtonGroup>
  )
}
export default FilterPanel
