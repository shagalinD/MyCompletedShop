import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../features/authSlice'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true) // true - авторизация, false - регистрация
  const [formData, setFormData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLogin) {
      try {
        await dispatch(loginUser(formData)).unwrap()
        navigate('/shop') // Сработает только при успешном выполнении
      } catch (error) {
        // Обработка ошибки
      }
    } else {
      try {
        await dispatch(registerUser(formData)).unwrap()
        navigate('/shop') // Сработает только при успешной регистрации
      } catch (error) {
        // Обработка ошибки
      }
    }
  }

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height='100vh'
    >
      <Paper elevation={3} sx={{ padding: 4, width: 300, textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom>
          {isLogin ? 'Вход' : 'Регистрация'}
        </Typography>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin='normal'
            required
          />
          <TextField
            label='Пароль'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin='normal'
            required
          />

          <Button
            type='submit'
            variant='contained'
            color='primary'
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>

        <Button
          onClick={() => setIsLogin(!isLogin)}
          color='secondary'
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLogin
            ? 'Нет аккаунта? Зарегистрироваться'
            : 'Уже есть аккаунт? Войти'}
        </Button>
      </Paper>
    </Box>
  )
}

export default AuthPage
