import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../modules/login';
import axios from 'axios';

// Интерфейс урока
export interface Lesson {
    id: number;
    name: string;
    description: string;
    start: string;
    end: string;
    courseID: number;
}

// Создаем ключ для хранения уроков по месяцам
const createMonthKey = (month: number, year: number): string => {
    return `${year}_${month}`;
};

// Интерфейс состояния уроков
interface LessonsState {
    lessons: Record<string, Lesson[]>; // Уроки, индексированные по ключу месяца
    currentMonth: number;
    currentYear: number;
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: LessonsState = {
    lessons: {},
    currentMonth: new Date().getMonth() + 1, // +1, потому что в JS месяцы начинаются с 0
    currentYear: new Date().getFullYear(),
    loading: false,
    error: null
};

// Асинхронный thunk для загрузки уроков
export const fetchLessons = createAsyncThunk(
    'lessons/fetchLessons',
    async ({ month, year, userId }: { month: number; year: number; userId: number }, { rejectWithValue }) => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(`http://localhost:8080/api/lessons/${userId}`, {
                params: { month, year },
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            return {
                lessons: response.data.lessons,
                month,
                year
            };
        } catch (error) {
            console.error("Ошибка получения расписания", error);
            return rejectWithValue('Не удалось загрузить расписание');
        }
    }
);

// Создаем slice
const lessonsSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
        setCurrentMonth(state, action) {
            state.currentMonth = action.payload;
        },
        setCurrentYear(state, action) {
            state.currentYear = action.payload;
        },
        clearLessons(state) {
            state.lessons = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessons.fulfilled, (state, action) => {
                const { lessons, month, year } = action.payload;
                // Сохраняем уроки под соответствующим ключом
                state.lessons[createMonthKey(month, year)] = lessons;
                state.loading = false;
            })
            .addCase(fetchLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

// Экспортируем действия и редюсер
export const { setCurrentMonth, setCurrentYear, clearLessons } = lessonsSlice.actions;
export default lessonsSlice.reducer;

// Определяем тип для корневого состояния (это должен быть тип RootState из store.ts)
interface RootStateWithLessons {
    lessons: LessonsState;
}

// Селектор для получения уроков текущего месяца
export const selectCurrentMonthLessons = (state: RootStateWithLessons) => {
    const { currentMonth, currentYear, lessons } = state.lessons;
    const key = createMonthKey(currentMonth, currentYear);
    return lessons[key] || [];
};

// Селектор для проверки, загружены ли уроки для конкретного месяца
export const selectHasLessonsForMonth = (state: RootStateWithLessons, month: number, year: number) => {
    const key = createMonthKey(month, year);
    return !!state.lessons.lessons[key];
};

// Селекторы для текущего состояния
export const selectCurrentMonth = (state: RootStateWithLessons) => state.lessons.currentMonth;
export const selectCurrentYear = (state: RootStateWithLessons) => state.lessons.currentYear;
export const selectIsLoading = (state: RootStateWithLessons) => state.lessons.loading;