module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            CREATE TABLE users (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              cognito_id text not null,
              first_name text not null,
              last_name text not null,
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE TABLE problems (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              public_id serial not null,
              title text not null, 
              created_by uuid REFERENCES users (id),
              owned_by uuid REFERENCES users (id),
              status text not null,
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE TABLE problem_variants (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              problem_id uuid REFERENCES problems (id),
              type text not null,
              created_by uuid REFERENCES users (id),
              "order" int not null,
              content text not null,
              is_preferred bool not null,
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );
            
            CREATE TABLE problem_variant_ratings (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              problem_variant_id uuid REFERENCES problem_variants (id),
              user_id uuid REFERENCES users (id),
              rating_type text not null,
              rating int not null,
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE TABLE sub_problems (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              problem_variant_id uuid REFERENCES problem_variants (id),
              created_by uuid REFERENCES users (id),
              "order" int not null,
              content text not null,
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE TABLE problem_categories (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              name text not null,
              description text not null,
              created_by uuid REFERENCES users (id),
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE TABLE problem_category_links (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              problem_category_id uuid REFERENCES problem_categories (id),
              problem_id uuid REFERENCES problems (id),
              created_by uuid REFERENCES users (id),
              created_at timestamp not null default now(),
              updated_at timestamp not null default now()
            );

            CREATE TABLE IF NOT EXISTS labels (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              name text not null,
              bg_color text not null,
              text_color text not null,
              created_by uuid REFERENCES users (id),
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );
    
            CREATE TABLE IF NOT EXISTS problem_label_links (
                id uuid PRIMARY KEY default uuid_generate_v4(),
                problem_id uuid REFERENCES problems (id),
                label_id uuid REFERENCES labels (id),
                created_at timestamp not null default now(),
                created_by uuid REFERENCES users (id),
                updated_at timestamp not null default now()
            );

            CREATE TABLE IF NOT EXISTS problem_surveys (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              title text not null,
              description text not null,
              status text not null,
              active boolean not null default true,
              created_by uuid REFERENCES users (id),
              owned_by uuid REFERENCES users (id),
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE TABLE IF NOT EXISTS problem_survey_votes (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              vote int not null,
              problem_id uuid REFERENCES problems (id),
              problem_variant_id uuid REFERENCES problem_variants (id),
              problem_survey_id uuid REFERENCES problem_surveys (id),
              created_by uuid REFERENCES users (id),
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp,
              UNIQUE (problem_variant_id, created_by)
            );

            CREATE TABLE IF NOT EXISTS problem_survey_links (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              problem_survey_id uuid REFERENCES problem_surveys (id),
              problem_id uuid REFERENCES problems (id),
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE TABLE IF NOT EXISTS user_survey_links (
              id uuid PRIMARY KEY default uuid_generate_v4(),
              survey_id uuid REFERENCES problem_surveys (id),
              user_id uuid REFERENCES users (id),
              created_at timestamp not null default now(),
              updated_at timestamp not null default now(),
              deleted_at timestamp
            );

            CREATE UNIQUE INDEX unique_problem_variant_user_rating ON problem_variant_ratings (problem_variant_id, user_id, rating_type);

          `,
        {transaction: transaction}
      )
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      // intentionally left blank
      await queryInterface.sequelize.query(
        `
        DROP INDEX IF EXISTS unique_problem_variant_user_rating;
        DROP TABLE IF EXISTS user_survey_links;
        DROP TABLE IF EXISTS problem_survey_links;
        DROP TABLE IF EXISTS problem_survey_votes;
        DROP TABLE IF EXISTS problem_surveys;
        DROP TABLE IF EXISTS problem_label_links;
        DROP TABLE IF EXISTS labels;
        DROP TABLE IF EXISTS problem_category_links;
        DROP TABLE IF EXISTS problem_categories;
        DROP TABLE IF EXISTS sub_problems;
        DROP TABLE IF EXISTS problem_variant_ratings;
        DROP TABLE IF EXISTS problem_variants;
        DROP TABLE IF EXISTS problems;
        DROP TABLE IF EXISTS users;
      `,
        {transaction: transaction}
      )
    }),
}
