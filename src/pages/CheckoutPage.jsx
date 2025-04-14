import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material'
import { BackToStoreBanner } from '../components/BackToStore'
import { createOrder } from '../features/orderSlice'
import { clearCart, fetchCart } from '../features/cartSlice'
import axios from 'axios'

const CheckoutPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector((state) => state.cart)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    saveInfo: false,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    const newErrors = {}
    if (
      !formData.address.match(
        /^[а-яА-Яa-zA-Z\s-]+,\s*[а-яА-Яa-zA-Z\s-]+,\s*(?:[а-яА-Яa-zA-Z0-9\s-.]*[а-яА-Яa-zA-Z0-9]+)+,\s*[а-яА-Яa-zA-Z0-9\/-]+$/
      )
    )
      newErrors.address = 'Invalid address'
    if (!formData.cardNumber.match(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/))
      newErrors.cardNumber = 'Invalid card number'
    if (!formData.expDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/))
      newErrors.expDate = 'MM/YY'
    if (!formData.cvv.match(/^\d{3}$/)) newErrors.cvv = 'Invalid CVV'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const orderData = {
        address: formData.address,
      }

      await dispatch(createOrder(formData.address)).unwrap()
      dispatch(fetchCart())
      navigate('/success', { state: { orderSuccess: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Order processing failed')
    } finally {
      setLoading(false)
    }
  }

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 16)
    const parts = []
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4))
    }
    return parts.join(' ')
  }

  // Форматирование срока действия
  const formatExpDate = (value) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 4)
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let formattedValue = value

    switch (name) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value)
        break
      case 'expDate':
        formattedValue = formatExpDate(value)
        break
      case 'postalCode':
      case 'cvv':
        formattedValue = value.replace(/\D/g, '')
        break
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue,
    }))
  }

  return (
    <>
      <BackToStoreBanner />

      <Container maxWidth='md' sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom>
          Оформление заказа
        </Typography>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                Адрес доставки
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Адрес (Страна, город, улица, дом)'
                name='address'
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='h6' gutterBottom>
                Данные карты
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Номер карты'
                name='cardNumber'
                value={formData.cardNumber}
                onChange={handleChange}
                inputProps={{ maxLength: 19 }}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                placeholder='0000 0000 0000 0000'
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Срок действия (MM/ГГ)'
                name='expDate'
                value={formData.expDate}
                onChange={handleChange}
                inputProps={{ maxLength: 5 }}
                error={!!errors.expDate}
                helperText={errors.expDate}
                placeholder='MM/ГГ'
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='CVV'
                name='cvv'
                value={formData.cvv}
                onChange={handleChange}
                inputProps={{ maxLength: 3 }}
                error={!!errors.cvv}
                helperText={errors.cvv}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='saveInfo'
                    checked={formData.saveInfo}
                    onChange={handleChange}
                    color='primary'
                  />
                }
                label='Сохранить данные для следующих покупок'
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Подтвердить заказ'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  )
}

export default CheckoutPage
