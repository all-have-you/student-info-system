import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 定义类型
interface User {
  username: string;
  role: string;
}

interface Student {
  id: string;
  studentId: string;
  name: string;
  gender: string;
  age: number;
  grade: number;
  class: number;
}

interface Score {
  id: string;
  studentId: string;
  name: string;
  gradeClass: string;
  math: number;
  chinese: number;
  english: number;
  total: number;
}

interface AppState {
  user: User | null;
  students: Student[];
  scores: Score[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'SET_SCORES'; payload: Score[] }
  | { type: 'ADD_SCORE'; payload: Score }
  | { type: 'UPDATE_SCORE'; payload: Score }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// 初始状态
const initialState: AppState = {
  user: null,
  students: [],
  scores: [],
  loading: false,
  error: null,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_STUDENTS':
      return { ...state, students: action.payload };
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.id ? action.payload : student
        ),
      };
    case 'SET_SCORES':
      return { ...state, scores: action.payload };
    case 'ADD_SCORE':
      return { ...state, scores: [...state.scores, action.payload] };
    case 'UPDATE_SCORE':
      return {
        ...state,
        scores: state.scores.map(score =>
          score.id === action.payload.id ? action.payload : score
        ),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// 创建Context
interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  setScores: (scores: Score[]) => void;
  addScore: (score: Score) => void;
  updateScore: (score: Score) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider组件
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const setStudents = (students: Student[]) => {
    dispatch({ type: 'SET_STUDENTS', payload: students });
  };

  const addStudent = (student: Student) => {
    dispatch({ type: 'ADD_STUDENT', payload: student });
  };

  const updateStudent = (student: Student) => {
    dispatch({ type: 'UPDATE_STUDENT', payload: student });
  };

  const setScores = (scores: Score[]) => {
    dispatch({ type: 'SET_SCORES', payload: scores });
  };

  const addScore = (score: Score) => {
    dispatch({ type: 'ADD_SCORE', payload: score });
  };

  const updateScore = (score: Score) => {
    dispatch({ type: 'UPDATE_SCORE', payload: score });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser,
        setStudents,
        addStudent,
        updateStudent,
        setScores,
        addScore,
        updateScore,
        setLoading,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 自定义Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
