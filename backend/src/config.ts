import dotenv from 'dotenv'

dotenv.config()

export default {
  COGNITO: {
    USER_POOL_ID: process.env.COGNITO_USER_POOL_ID || '',
    CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
  },

  AWS: {
    REGION: process.env.AWS_REGION || '',
    ACCESS_KEY: process.env.AWS_ACCESS_KEY || '',
    SECRET_KEY: process.env.AWS_SECRET_KEY || '',
  },
}
