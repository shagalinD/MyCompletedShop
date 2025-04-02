import React from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { addToCart } from '../features/cartSlice'
import { Link } from 'react-router-dom'
const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
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
          flexDirection: 'column', // Элементы внутри будут располагаться вертикально
        }}
      >
        <CardMedia
          component='img'
          height='170'
          image={product.image}
          alt={product.title}
          sx={{
            objectPosition: 'top', // Указывает, что изображение должно быть выровнено по верхнему краю
            marginBottom: 0, // Убирает отступ снизу изображения
            paddingBottom: 0, // Убирает отступы по нижнему краю
          }}
        />
        <CardContent
          component={Link}
          to={`/product/${product.id}`}
          sx={{ paddingTop: 0, marginTop: 'auto' }}
        >
          <Typography variant='h6'>{product.title}</Typography>
          <Typography variant='body2'>{product.description}</Typography>
          <Typography variant='h5'>{product.price}$</Typography>
          <Rating
            value={product.rating}
            precision={0.1}
            readOnly
            sx={{ mt: 1 }}
          />

          <Button
            variant='contained'
            onClick={() => dispatch(addToCart(product))}
            sx={{ mt: 2 }}
          >
            Добавить в корзину
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default ProductCard
