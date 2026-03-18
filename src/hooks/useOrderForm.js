// hooks/useOrderForm.js
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { orderSchema, defaultValues } from '../schemas/orderSchema';
import { groupsData } from '../data/groups';
// import { sendToTelegram } from '../services/telegramService';

export const useOrderForm = (initialGroup = '') => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      ...defaultValues,
      group: initialGroup,
    },
  });

  const groups = groupsData.map(g => ({
    value: g.slug,
    label: g.name,
  }));

  const selectedGroupData = groupsData.find(
    g => g.slug === form.watch('group')
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // 1. Отправка в Telegram
      console.log('ADASFDSVSDVSD')
      
      // 2. Успех
      toast.success('Заявка отправлена! Мы свяжемся с вами');
      form.reset();
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      toast.error('Что-то пошло не так. Попробуйте позже');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    groups,
    selectedGroupData,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
};