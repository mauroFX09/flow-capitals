export type Profile = {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'premium' | 'standard'
  avatar_url: string | null
  country: string | null
  experience: string | null
  goals: string | null
  preferred_pairs: string[] | null
  bio: string | null
  created_at: string
}

export type Trade = {
  id: string
  user_id: string
  pair: string
  direction: string
  entry_price: number | null
  exit_price: number | null
  stop_loss: number | null
  take_profit: number | null
  lot_size: number | null
  pnl: number
  rr: number | null
  emotion: string
  notes: string | null
  followed_plan: boolean | null
  screenshot_urls: string[]
  screenshots: string[]
  session: string
  trade_date: string
  created_at: string
}

export type Course = {
  id: string
  title: string
  description: string
  icon: string
  order_number: number
  created_at: string
}

export type Lesson = {
  id: string
  course_id: string
  title: string
  description: string | null
  video_url: string | null
  duration_minutes: number | null
  order_number: number
  created_at: string
}

export type LessonProgress = {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
}

export type WallPost = {
  id: string
  user_id: string
  screenshot_url: string | null
  amount: number
  caption: string | null
  is_public: boolean
  created_at: string
}

export type WeeklyReview = {
  id: string
  user_id: string
  week_start: string
  wins: string | null
  losses: string | null
  improve: string | null
  focus: string | null
  created_at: string
}