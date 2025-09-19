CREATE TABLE "cliente" (
	"id" serial PRIMARY KEY NOT NULL,
	"rg" text NOT NULL,
	"cpf" text NOT NULL,
	"nome" text NOT NULL,
	"endereco" text NOT NULL,
	"profissao" text
);
