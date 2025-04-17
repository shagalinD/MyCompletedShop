import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Button,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Grid,
} from '@mui/material'
import { getProfile, logout, updateUser } from '../features/authSlice'
import { getAll } from '../features/orderSlice'
import { BackToStoreBanner } from '../components/BackToStore'
import axios from 'axios'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const { orders } = useSelector((state) => state.order)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState()
  const [phoneStatus, setPhoneStatus] = useState(true)

  // Загрузка заказов пользователя
  useEffect(() => {
    console.log(user)
    console.log(token)
    const fetchOrders = async () => {
      try {
        await dispatch(getProfile()).unwrap()
        await dispatch(getAll()).unwrap()
        setFormData({
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          email: user?.email ?? '',
          phoneNumber: user?.phoneNumber ?? '',
        })
      } catch (err) {
        console.log(err)

        setError('Ошибка загрузки заказов')
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchOrders()
  }, [token])

  // Обработка выхода
  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
  }

  // Обновление информации
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(
        updateUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
        })
      ).unwrap()
      await dispatch(getProfile()).unwrap()
      setEditMode(false)
    } catch (err) {
      setError('Ошибка обновления данных')
    }
  }

  // Валидация телефона
  const validatePhone = (phoneNumber) => {
    setPhoneStatus(/^\+?[1-9]\d{10,14}$/.test(phoneNumber) || phoneNumber == '')
  }

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <BackToStoreBanner />
      <Typography variant='h4' gutterBottom>
        Профиль пользователя
      </Typography>

      {/* Форма редактирования */}
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Имя'
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Фамилия'
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Телефон'
                value={formData.phoneNumber}
                onChange={(e) => {
                  validatePhone(e.target.value)
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }}
                error={!phoneStatus}
                helperText={!phoneStatus && 'Неверный формат телефона'}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                sx={{ mr: 2 }}
                disabled={!phoneStatus}
              >
                Сохранить
              </Button>
              <Button variant='outlined' onClick={() => setEditMode(false)}>
                Отмена
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        /* Информация о пользователе */
        <>
          <Typography variant='h6' gutterBottom>
            {user?.firstName ?? ''} {user?.lastName ?? ''}
          </Typography>
          <Typography gutterBottom>Email: {user?.email ?? ''}</Typography>
          {user && user.phoneNumber && (
            <Typography gutterBottom>
              Телефон: {user?.phoneNumber ?? ''}
            </Typography>
          )}
          <Button
            variant='contained'
            sx={{ mt: 2 }}
            onClick={() => setEditMode(true)}
          >
            Редактировать профиль
          </Button>
        </>
      )}

      {/* Список заказов */}
      <Typography variant='h5' sx={{ mt: 4, mb: 2 }}>
        История заказов
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity='error'>{error}</Alert>
      ) : orders.length === 0 ? (
        <Typography>У вас пока нет заказов</Typography>
      ) : (
        <List>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <ListItem>
                <ListItemText
                  primary={`Заказ ${order.order_number}`}
                  secondary={
                    `Дата: ${new Date(order.date).toLocaleDateString()} | ` +
                    `Статус: ${order.status} | ` +
                    `Сумма: ${order.total.toFixed(2)} ₽`
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Кнопка выхода */}
      <Button
        variant='outlined'
        color='error'
        sx={{ mt: 4 }}
        onClick={handleLogout}
      >
        Выйти из аккаунта
      </Button>
    </Container>
  )
}

export default ProfilePage
