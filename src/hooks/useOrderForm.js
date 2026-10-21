import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderSchema, defaultValues } from '../schemas/orderSchema';
import { useContent } from '../content';

export const useOrderForm = (initialGroup = '') => {
  const { groups: groupsData, form: labels } = useContent();
  const form = useForm({
    resolver: zodResolver(orderSchema(labels)),
    defaultValues: { ...defaultValues, eventDate: new Date(), group: initialGroup, equipment: labels.equipmentOptions[0]?.value || '' },
  });
  const selected = useWatch({ control: form.control, name: "group" });
  return {
    form,
    groups: groupsData.map(group => ({value: group.slug, label: group.name})),
    selectedGroupData: groupsData.find(group => group.slug === selected),
  };
};
