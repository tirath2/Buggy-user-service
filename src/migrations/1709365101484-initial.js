const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1709365101484 {
    name = 'Initial1709365101484'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "uploaded_by" integer, "deleted_by" integer, "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying, "link" character varying, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "uploaded_by" integer, "deleted_by" integer, "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "project_id" integer NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "uploaded_by" integer, "deleted_by" integer, "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "project_id" integer NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_72a40468c3924e43b934542e8e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "uploaded_by" integer, "deleted_by" integer, "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "mobile" character varying, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_project"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }
}
