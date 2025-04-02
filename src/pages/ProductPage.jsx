import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Divider,
  TextField,
  Button,
  Box,
  Avatar,
} from '@mui/material'
import { fetchFeedbacks, addFeedback } from '../features/feedbackSlice'
import { loadProducts } from '../features/productsSlice'

const ProductPage = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const [comment, setComment] = React.useState('')
  const [rating, setRating] = React.useState(5)

  const { items: products, status: productsStatus } = useSelector(
    (state) => state.products
  )
  const { items: feedbacks, status: feedbacksStatus } = useSelector(
    (state) => state.feedback
  )
  const { token } = useSelector((state) => state.auth)

  const product = products.find((p) => p.id === parseInt(id))

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(loadProducts())
    }
    console.log(id)
    dispatch(fetchFeedbacks(id))
  }, [dispatch, id, productsStatus])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (comment.trim() && rating > 0) {
      const tempId = Date.now() // Временный ID для оптимистичного обновления
      dispatch(
        addFeedback({
          productId: parseInt(id),
          comment,
          rating,
          tempId, // Добавляем временный идентификатор
        })
      )
        .unwrap() // Обрабатываем Promise
        .then(() => {
          setComment('')
          setRating(5)
        })
        .catch((err) => {
          console.error('Failed to add feedback:', err)
        })
      dispatch(loadProducts())
    }
  }

  if (productsStatus === 'loading' || feedbacksStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <Container maxWidth='md' sx={{ my: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component='img'
              height='400'
              image={product.image}
              alt={product.title}
              sx={{ objectFit: 'contain' }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='h3' gutterBottom>
            {product.title}
          </Typography>
          <Typography variant='h5' color='text.secondary' gutterBottom>
            {product.price}$
          </Typography>
          <Typography variant='h4' gutterBottom sx={{ display: 'inline' }}>
            {product.rating.toFixed(1)}
          </Typography>
          <Rating
            value={product.rating}
            precision={0.1}
            readOnly
            sx={{ my: 2 }}
          />
          <Typography variant='body1' paragraph>
            {product.description}
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            Category: {product.category}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant='h4' gutterBottom>
        Отзывы
      </Typography>

      {feedbacks.length === 0 ? (
        <Typography variant='body1' color='text.secondary'>
          Пока нет отзывов
        </Typography>
      ) : (
        feedbacks.map((feedback) => (
          <Box key={feedback.id || feedback.tempId} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ mr: 2 }} />
              {feedback.rating ? (
                <Rating value={feedback.rating} precision={0.1} readOnly />
              ) : (
                <Typography color='text.secondary'>
                  Оценка загружается...
                </Typography>
              )}
            </Box>
            {feedback.comment ? (
              <Typography variant='body1'>{feedback.comment}</Typography>
            ) : (
              <Typography color='text.secondary'>
                Текст отзыва загружается...
              </Typography>
            )}
            <Divider sx={{ my: 4 }} />
          </Box>
        ))
      )}

      {token && (
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Typography variant='h6' gutterBottom>
            Добавить свой отзыв
          </Typography>
          <Rating
            value={rating}
            onChange={(e, newValue) => setRating(newValue)}
            precision={0.5}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant='outlined'
            label='Your review'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type='submit' variant='contained'>
            Отправить
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default ProductPage
