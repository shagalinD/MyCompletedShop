import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart, clearCart, removeCartItem } from '../features/cartSlice'
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  ButtonGroup,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total, status, error } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch, total])

  const handleRemove = async (itemId) => {
    await dispatch(removeCartItem({ product_id: itemId })).unwrap()
    dispatch(fetchCart())
  }

  const handleClear = async () => {
    await dispatch(clearCart()).unwrap()
    dispatch(fetchCart())
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  if (status === 'loading') {
    return <CircularProgress />
  }

  return (
    <Card sx={{ maxWidth: '100%', margin: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant='h6'>Корзина</Typography>
        <List>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ListItem>
                <ListItemText
                  primary={item.product.title}
                  secondary={`${item.quantity} x ${item.product.price}₽`}
                />
                <Button onClick={() => handleRemove(item.product_id)}>
                  Удалить
                </Button>
              </ListItem>
            </motion.div>
          ))}
        </List>
        {total != 0 ? (
          <Typography variant='h6'>
            Общая стоимость: {total.toFixed(2)} ₽
          </Typography>
        ) : (
          <Typography variant='subtitle1'>
            Корзина пока пуста... Вперед за покупами!
          </Typography>
        )}
        {total != 0 && (
          <ButtonGroup variant='text' orientation='vertical'>
            <Button
              onClick={handleClear}
              variant='contained'
              color='error'
              sx={{ mt: 2 }}
            >
              Очистить корзину
            </Button>
            <Button
              onClick={handleCheckout}
              variant='contained'
              color='primary'
              sx={{ mt: 2 }}
            >
              Перейти к оформлению
            </Button>
          </ButtonGroup>
        )}
      </CardContent>
    </Card>
  )
}

export default Cart
