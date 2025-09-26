CREATE TYPE "public"."statusPedido" AS ENUM('PENDENTE', 'CONCLUIDO', 'CONFIRMADO');--> statement-breakpoint
CREATE TABLE "pedido" (
	"id" serial PRIMARY KEY NOT NULL,
	"data" timestamp NOT NULL,
	"status" "statusPedido"
);
