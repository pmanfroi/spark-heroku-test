import { keys } from 'ramda'
import { ProblemCategory } from './db/models/problemCategory'
import { ProblemSurvey } from './db/models/problemSurvey'
import { ProblemSurveyVote } from './db/models/problemSurveyVote'

export interface User {
  id: string
  firstName: string
  lastName: string
  // email: string // we'll get the e-mail from cogntio in the FE instead of storing it in the db
  cognitoID: string
  createdAt: Date
  updatedAt: Date
}

export interface UserCognito {
  email: string
  given_name: string
  family_name: string
  sub: string
  iss: string
  'cognito:username': string
  origin_jti: string
  aud: string
  event_id: string
  token_use: string
  auth_time: number
  exp: number
  iat: number
  jti: string
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

export const statusTypeList = keys(ProblemStatus)

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

export interface Problem {
  id: string
  publicId: number
  title: string
  status: ProblemStatus
  createdBy: User
  ownedBy: User
  createdAt: Date
  updatedAt: Date
}

export interface ProblemUpdateData {
  status?: ProblemStatus
  title?: string
  categories?: string[]
  labels?: string[]
}

export interface Label {
  id: string
  bgColor: string
  textColor: string
  name: string
  createdBy: User
  createdAt: Date
  updatedAt: Date
}

export interface LabelUpdateData {
  bgColor?: string
  textColor?: string
  name?: string
}

export type LabelResponse = {
  id: string
  textColor: string
  bgColor: string
  name: string
  createdBy: User
  createdAt: Date
  updatedAt: Date
}

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
  color: Colors
  createdBy: User
  createdAt: Date
  updatedAt: Date
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
}

export enum NewProblemDirection {
  UP = 'UP',
  DOWN = 'DOWN',
}

export type ProblemVariantUpdateData = Partial<Pick<ProblemVariant, 'content' | 'isPreferred'>>

export type ProblemVariantRatingData = Pick<ProblemVariantRating, 'rating'>

export type ProblemVariantRatingRequest = Pick<ProblemVariantRating, 'ratingType' | 'rating'>

export interface ProblemVariantRating {
  id: string
  problemVariantId: string
  ratingType: string
  rating: number
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface SubProblem {
  id: string
  parentVariantId: string
  createdBy: User
  order: number
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  createdBy: User
  createdAt: Date
  updatedAt: Date
}

export interface ProblemCategoryLink {
  id: string
  problemId: string
  problemCategoryId: string
  createdBy: User
  createdAt: Date
  updatedAt: Date
}

export type ProblemResponse = {
  id: string
  publicId: number
  title: string
  status: ProblemStatus
  preferredVariantId: string
  problemVariants?: ProblemVariant[]
  categories?: ProblemCategory[]
  labels?: Label[]
  createdBy: string
  ownedBy: string
}

export interface ApiErrorResponse {
  status: number
  message: string
  data?: any
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

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  READY_TO_LAUNCH = 'READY_TO_LAUNCH',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
}

export const surveyStatusList = keys(SurveyStatus)

export type ProblemSurveyCreateData = Pick<
  ProblemSurvey,
  'title' | 'description' | 'status' | 'createdBy'
> & {
  problemIds: string[]
  usersIds: string[]
}

export type ProblemSurveyUpdateData = Partial<
  Pick<ProblemSurvey, 'title' | 'description' | 'status' | 'ownedBy' | 'active'>
> & {
  problemIds?: string[]
  usersIds?: string[]
}

export type ProblemSurveyVoteCreateData = Pick<
  ProblemSurveyVote,
  'problemSurveyId' | 'problemId' | 'problemVariantId' | 'vote' | 'createdBy'
>

export type ProblemSurveyVoteUpdateData = Pick<ProblemSurveyVote, 'vote'>
