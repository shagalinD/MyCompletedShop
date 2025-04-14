import { useState } from 'react'
import { Check, Phone } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Container,
} from '@mui/material'
import { BackToStoreBanner } from '../components/BackToStore'
import { styled } from '@mui/material/styles'

const SuccessPage = () => {
  const dispatch = useDispatch()
  const { orderNumber, orderStatus, orderDate } = useSelector(
    (state) => state.order
  )
  const phoneNumber = '+7 (800) 123-45-67'

  const SuccessIcon = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.main,
    width: 64,
    height: 64,
    marginBottom: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
    },
  }))

  const ContactIcon = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    width: 40,
    height: 40,
  }))

  return (
    <Container maxWidth='md' sx={{ py: 6, px: 4 }}>
      <BackToStoreBanner />
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <SuccessIcon>
          <Check fontSize='inherit' />
        </SuccessIcon>
        <Typography variant='h4' component='h1' gutterBottom>
          Заказ успешно создан!
        </Typography>
        <Typography color='text.secondary'>
          Спасибо за ваш заказ. Мы отправили подтверждение на вашу электронную
          почту.
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardHeader
          title='Информация о заказе'
          subheader={`Номер заказа: ${orderNumber}`}
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div>
              <Typography variant='subtitle1' gutterBottom>
                Статус заказа
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'success.main',
                }}
              >
                <Check fontSize='small' />
                <Typography>{orderStatus}</Typography>
              </Box>
            </div>

            <Divider />

            <div>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemText primary='Дата заказа:' secondary={orderDate} />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText
                    primary='Способ оплаты:'
                    secondary='Банковская карта'
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText primary='Статус оплаты:' secondary='Оплачено' />
                </ListItem>
              </List>
            </div>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title='Есть вопросы?'
          subheader='Наша служба поддержки готова помочь вам с любыми вопросами по вашему заказу'
        />
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ContactIcon>
              <Phone fontSize='small' />
            </ContactIcon>
            <div>
              <Typography variant='caption' color='text.secondary'>
                Позвоните нам
              </Typography>
              <Typography variant='body1'>{phoneNumber}</Typography>
            </div>
          </Box>
        </CardContent>
        <CardContent sx={{ pt: 0 }}>
          <Button
            fullWidth
            variant='contained'
            startIcon={<Phone />}
            onClick={() =>
              (window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`)
            }
          >
            Позвонить
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}

export default SuccessPage
