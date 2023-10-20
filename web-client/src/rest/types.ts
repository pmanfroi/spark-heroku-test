export interface User {
  id: string
  cognitoId: string
  firstName: string
  lastName: string
  email: string
  role: string
  permissions: any
}

export enum ProblemStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  INITIAL_REVIEW = 'INITIAL_REVIEW',
  FINAL_REVIEW = 'FINAL_REVIEW',
  SELECTED = 'SELECTED',
  BACKLOG = 'BACKLOG',
  CLOSED = 'CLOSED  ',
}

export enum ProblemVariantType {
  SUB_PROBLEM = 'SUB',
  NARROWER = 'NARROWER',
  BROADER = 'BROADER',
  ROOT = 'ROOT',
}

export enum RatingType {
  passion = 'PASSION',
  importance = 'IMPORTANCE',
  favorite = 'FAVORITE',
}

export type ColorValueHex = `#${string}`

export enum Colors {
  PURPLE = 'purple',
  VIOLET = 'violet',
  INDIGO = 'indigo',
  CYAN = 'cyan',
  BLUE = 'blue',
  SLATE = 'slate',
}

export interface Tag {
  id: string
  label: string
  bgColor: Colors | ColorValueHex
  textColor: Colors | ColorValueHex
}

export interface ProblemVariant {
  id: string
  problemId: string
  type: ProblemVariantType
  order: number
  content: string
  isPreferred: boolean
  createdBy: string
  ratings?: ProblemVariantRating[]
  subProblems: SubProblem[]
}

export interface ProblemVariantRating {
  id: string
  problemVariantId: string
  ratingType: RatingType
  rating: number
  userId: string
}

export interface SubProblem {
  id: string
  problemVariantId: string
  order: number
  content: string
  createdBy: string
}

export type UserRating = {
  passion?: PassionLevel
  importance?: ImportanceLevel
  favorite?: number
}

export interface Category {
  id: string
  name: string
  description: string
  createdBy: User
  createdAt: Date
  updatedAt: Date
}

export interface Label {
  id: string
  name: string
  bgColor: ColorValueHex
  textColor: ColorValueHex
  createdBy: User
  createdAt: Date
  updatedAt: Date
}

export type ProblemType = {
  id: string
  publicId: number
  title: string
  content: string
  status: ProblemStatus
  preferredVariantId: string
  problemVariants?: ProblemVariant[]
  categories?: Category[]
  createdAt: string
  labels?: Label[]
  createdBy: string
  userRating: UserRating
}

export type InsightType = {
  output: string
  topics: string
}

export enum PassionLevel {
  TOTALLY_JAZZED = 2,
  INTERESTING = 1,
  NOT_FOR_ME = 0,
}

export enum ImportanceLevel {
  SUPER_HIGH = 2,
  HAS_POTENTIAL = 1,
  LOW = 0,
}

export enum ResourceTypes {
  PROBLEM = 'PROBLEM',
  PROBLEM_VARIANT = 'PROBLEM_VARIANT',
  SUB_PROBLEM = 'SUB_PROBLEM',
  PROBLEM_SURVEY = 'PROBLEM_SURVEY',
  CATEGORY = 'CATEGORY',
  USER = 'USER',
  LABEL = 'LABEL',
}

export enum Roles {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  EXECUTIVE = 'EXECUTIVE',
  REVIEWER = 'REVIEWER',
}

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  READY_TO_LAUNCH = 'READY_TO_LAUNCH',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
}

export type ProblemSurvey = {
  id: string
  title: string
  description: string
  status: SurveyStatus
  active: boolean
  createdBy: string
  ownedBy: string
  usersCount: number
  problemsCount: number
  thumbsUpCount: number
  thumbsDownCount: number
}

export enum OrderBy {
  NONE = 'NONE',
  IMPORTANCE = 'IMPORTANCE',
  PASSION = 'PASSION',
  FAVORITE = 'FAVORITE',
  CREATION_DATE = 'CREATION_DATE',
  STATUS = 'STATUS',
}

export interface CategoryWithProblems {
  category: Category
  problems: ProblemType[]
}
