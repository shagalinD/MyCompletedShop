import React, { useEffect, useState } from 'react'
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
  IconButton,
} from '@mui/material'
import { BackToStoreBanner } from '../components/BackToStore'
import EditIcon from '@mui/icons-material/Edit'
import {
  fetchFeedbacks,
  addFeedback,
  fetchUserFeedback,
  updateFeedback,
} from '../features/feedbackSlice'
import { loadProducts } from '../features/productsSlice'

const ProductPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  // Состояния для формы
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [isEditing, setIsEditing] = useState(false)

  // Получаем данные из Redux store
  const { items: products, status: productsStatus } = useSelector(
    (state) => state.products
  )
  const feedbacks = useSelector((state) => state.feedback.items)
  const feedbacksStatus = useSelector((state) => state.feedback.status)
  const userFeedback = useSelector((state) => state.feedback.userFeedback)
  const { token } = useSelector((state) => state.auth)

  const product = products.find((p) => p.id === parseInt(id))

  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(loadProducts())
    }
    dispatch(fetchUserFeedback(id))
    dispatch(fetchFeedbacks(id))
  }, [dispatch, id, productsStatus])

  // Сброс формы при переключении режима редактирования
  useEffect(() => {
    if (userFeedback?.exists && !isEditing) {
      setComment(userFeedback.comment)
      setRating(userFeedback.rating)
    }
  }, [userFeedback, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim() || rating <= 0) return

    try {
      if (userFeedback?.exists) {
        // Обновляем существующий отзыв
        await dispatch(
          updateFeedback({
            productId: parseInt(id),
            comment,
            rating,
          })
        ).unwrap()
        setIsEditing(false)
      } else {
        // Добавляем новый отзыв
        const tempId = Date.now()
        await dispatch(
          addFeedback({
            productId: parseInt(id),
            comment,
            rating,
            tempId,
          })
        ).unwrap()
        setComment('')
        setRating(5)
      }
      dispatch(loadProducts()) // Обновляем рейтинг продукта
    } catch (err) {
      console.error('Failed to submit feedback:', err)
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (userFeedback?.exists) {
      setComment(userFeedback.comment)
      setRating(userFeedback.rating)
    } else {
      setComment('')
      setRating(5)
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
      <BackToStoreBanner />
      <Grid container spacing={4}>
        {/* Product details section (unchanged) */}
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

      {/* Feedback list section */}
      {feedbacks.length === 0 ? (
        <Typography variant='body1' color='text.secondary'>
          Пока нет отзывов
        </Typography>
      ) : (
        feedbacks.map(
          (feedback) =>
            feedback.user_id != userFeedback?.user_id && (
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
            )
        )
      )}

      {/* User feedback section */}
      {token && (
        <Box sx={{ mt: 4 }}>
          <Typography variant='h6' gutterBottom>
            {userFeedback?.exists ? 'Ваш отзыв' : 'Добавить свой отзыв'}
          </Typography>

          {userFeedback?.exists && !isEditing ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={userFeedback.rating} precision={0.1} readOnly />
                <IconButton onClick={handleEditClick} sx={{ ml: 1 }}>
                  <EditIcon />
                </IconButton>
              </Box>
              <Typography variant='body1'>{userFeedback.comment}</Typography>
            </Box>
          ) : (
            <Box component='form' onSubmit={handleSubmit}>
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
                label='Ваш отзыв'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button type='submit' variant='contained'>
                  {userFeedback?.exists ? 'Сохранить' : 'Отправить'}
                </Button>
                {userFeedback?.exists && isEditing && (
                  <Button variant='outlined' onClick={handleCancelEdit}>
                    Отмена
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Container>
  )
}

export default ProductPage
