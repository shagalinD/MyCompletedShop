import React, { useEffect, useState } from 'react'
import { Avatar, Button, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const AuthButton = () => {
  const navigate = useNavigate()
  const [signedIn, setSignIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setSignIn(true)
    }
  }, [signedIn])

  const handleLogin = () => {
    navigate('/auth') // Переход на страницу авторизации
  }

  const handleProfile = () => {
    navigate('/profile')
  }

  return (
    <div
      className='AuthButton'
      style={{ position: 'absolute', right: '15px', top: '15px' }}
    >
      {signedIn ? (
        <Tooltip title='Перейти в профиль'>
          <Avatar
            alt='Remy Sharp'
            src='/static/images/avatar/1.jpg'
            sx={{ width: 56, height: 56, cursor: 'pointer' }}
            onClick={handleProfile}
          />
        </Tooltip>
      ) : (
        <Button variant='outlined' color='primary' onClick={handleLogin}>
          Войти / Регистрация
        </Button>
      )}
    </div>
  )
}

export default AuthButton
