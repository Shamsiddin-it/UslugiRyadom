import { z } from 'zod';

const phoneRegex = /^\+?[0-9]{9,15}$/;

export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Введите имя'),
    email: z.string().email('Введите корректный email'),
    phone: z.string().regex(phoneRegex, 'Введите телефон в формате +992900000000'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string().min(6, 'Подтвердите пароль'),
    role: z.enum(['client', 'master']),
    city: z.string().min(1, 'Выберите город'),
    district: z.string().min(1, 'Выберите район'),
    street: z.string().optional(),
    house: z.string().optional(),
    landmark: z.string().optional(),
    profession: z.string().optional(),
    experience: z.coerce.number().optional(),
    about: z.string().optional(),
    categoryIds: z.array(z.string()).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароли не совпадают',
        path: ['confirmPassword'],
      });
    }

    if (data.role === 'master') {
      if (!data.profession || data.profession.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Укажите профессию',
          path: ['profession'],
        });
      }

      if (!data.experience || data.experience < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Укажите опыт',
          path: ['experience'],
        });
      }

      if (data.categoryIds.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Выберите хотя бы одну категорию',
          path: ['categoryIds'],
        });
      }
    }
  });

export const createOrderSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа'),
  description: z.string().min(10, 'Минимум 10 символов'),
  categoryId: z.string().min(1, 'Выберите категорию'),
  city: z.string().min(1, 'Выберите город'),
  district: z.string().min(1, 'Выберите район'),
  street: z.string().optional(),
  house: z.string().optional(),
  landmark: z.string().optional(),
  price: z.coerce.number().positive('Цена должна быть больше 0'),
  paymentType: z.enum(['cash', 'card']),
});

export const masterProfileSchema = z.object({
  profession: z.string().min(2, 'Укажите профессию'),
  experience: z.coerce.number().min(0, 'Опыт не может быть отрицательным'),
  about: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  street: z.string().optional(),
  house: z.string().optional(),
  landmark: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, 'Выберите хотя бы одну категорию'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
export type MasterProfileFormValues = z.infer<typeof masterProfileSchema>;
