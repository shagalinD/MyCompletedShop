import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Box } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export const BackToStoreBanner = () => {
  const navigate = useNavigate()

  return (
    <Box
      onClick={() => navigate('/shop')}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        p: 2,
        marginBottom: 3,
        '&:hover': {
          backgroundColor: 'action.hover',
          borderRadius: 1,
        },
      }}
    >
      <ArrowBackIcon color='primary' />
      <Typography variant='body1' color='primary'>
        Вернуться на главную
      </Typography>
    </Box>
  )
}
