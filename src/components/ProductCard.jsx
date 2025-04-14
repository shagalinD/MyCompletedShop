import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Box,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { addCartItem, fetchCart } from '../features/cartSlice'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()

  const handleAddToCart = async () => {
    await dispatch(
      addCartItem({ product_id: product.id, quantity: 1 })
    ).unwrap()
    dispatch(fetchCart())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          maxWidth: 345,
          height: 400,
          margin: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardMedia
          component='img'
          height='170'
          image={product.image}
          alt={product.title}
          sx={{
            objectPosition: 'top',
            marginBottom: 0,
            paddingBottom: 0,
          }}
        />
        <CardContent sx={{ paddingTop: 0, marginTop: 'auto' }}>
          <Box component={Link} to={`/product/${product.id}`}>
            <Typography variant='h6'>{product.title}</Typography>
            <Typography variant='body2'>{product.description}</Typography>
            <Typography variant='h5'>{product.price} ₽</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, mt: 1 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant='subtitle2' color='text.secondary'>
                ({product.feedback_count})
              </Typography>
            </Box>
          </Box>

          <Button variant='contained' onClick={handleAddToCart} sx={{ mt: 2 }}>
            Добавить в корзину
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProductCard
